
var async = require('async');
var builder_classes = require('./builders');
var repo_builder_class = require('./builders/repo_builder');
var dependency_resolver = require('./dependency_resolver');


module.exports = function(settings, finalCallback){    
    //get a builder for each lib
	var builders = _.map(settings.libs, function(lib){
	    var builderClass = _.find(builder_classes, function(builder_class){
            return builder_class.supports(lib);
        });
        return new builderClass(lib, settings);
    });
    
    //get complete list of dependencies (unordered)
    for(var i=0; i<builders.length; i++){
        var builder = builders[i];
        
        //get unknown dependencies of the current lib
        var unknownDependenciesNames = _.filter(builder.getDependencyNames(), function(name){
            return !_.any(builders, function(b){ return b.name == name; });
        });
        
        //add those unknown dependencies
        _.each(unknownDependenciesNames, function(name){
            //dependencies can only be repo names (as opposed to urls)
            builders.push(new repo_builder_class(name, settings));
        });
    }
    
    //order the dependencies
    builders = dependency_resolver.order(
        builders, 
        function(b){return b.name;}, 
        function(b){return b.getDependencyNames();}
    );
    
    //convert builders into loaders
    var loaders = [];
	_.each(builders, function(builder){
		loaders.push(function(callback){
		    builder.build(function(result){
		        callback(null, result);
	        });
	    });
	});
	
	//run all loaders in parallel
    async.parallel(loaders, function(err, results){
        //sort all the results into js & css
        var js = [];
        var cssjs = [];
        for(var i=0; i<results.length; i++){
            var result = results[i];
            if(result.cssjs)
                cssjs.push(result.cssjs);
            if(result.js)
                js.push(result.js);
        }
        
        //add the css before the js (local less needs to exist before js parser)
        if(cssjs){
            js = cssjs.combine(js);
        }
        
        //combine it all into js
        js = js.join("\n\n");
        
	    finalCallback(js);
    });
};


