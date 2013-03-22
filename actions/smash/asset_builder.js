
var async = require('async');
var url_builder_classes = require('./builders');
var dependency_resolver = require('./dependency_resolver');

var getBuilder = function(url, settings){
    
};

module.exports = function(settings, finalCallback){    
    //get a builder for each repo
	var repo_builders = _.map(settings.repos, function(repo){
	    return new repo_builder_class(repo, settings);
    });
    
    //get a builder for each url
	var url_builders = _.map(settings.urls, function(url){
	    var builderClass = _.find(url_builder_classes, function(url_builder_class){
            return url_builder_class.supports(url, settings);
        });
        return new builderClass(url, settings);
    });
    
    //combine into one group
    var builders = [].concat(repo_builders, url_builders);
    
    //get complete list of dependencies (unordered)
    for(var i=0; i<builders.length; i++){
        var builder = builders[i];
        var dependencyNames = builder.getDependencyNames();
        var unknownDependenciesNames = _.filter(dependencyNames, function(name){
            return !_.any(builders, function(b){ return b.name == name; });
        });
        _.each(unknownDependenciesNames, function(name){
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
        var css = [];
        for(var i=0; i<results.length; i++){
            var result = results[i];
            if(result.css)
                css.push(result.css);
            if(result.js)
                js.push(result.js);
        }
        
        //add the css as the last js
        if(css){
            css = css.join(' ').replace(/\n+/g, ' ').replace(/"/g, '\"');
            js.push('document.write("<style type=text/css> "'+css+' </style>");');
        }
        
        //combine it all into js
        js = js.join("\n\n");
        
	    finalCallback(js);
    });
};


