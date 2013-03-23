
var async = require('async');
var builder_selector = require('./builders/builder_selector');
var package_builder_class = require('./builders/package_builder');
var dependency_resolver = require('./dependency_resolver');


var addNewDependencies = function(names, q, builders){
    //get unknown package names
    var unknown = _.difference(names, _.map(builders, function(b){ return b.name; }));
    
    //register the unknown
    _.each(unknown, function(name){
        //dependencies can only be package names (as opposed to urls)
        var newBuilder = new package_builder_class(name, settings);
        builders.push(newBuilder);
        
        //look for this package's dependencies
        q.push(makeDependencyFinderTask(newBuilder, q, builders));
    });
};

var makeDependencyFinderTask = function(builder, q, builders){
    return function(callback){
        builder.getDependencyNames(function(names){
            addNewDependencies(names, q, builders);
            callback();
        });
    };
};

module.exports = function(settings, finalCallback){    
    //get a builder for each lib
	var builders = _.map(settings.libs, function(lib){
	    return builder_maker(lib);
    });
    
    //build a queue to resolve all the dependencies
    var dependencyQueue = async.queue(function(task, callback){
        task(callback);
    }, 99);
    
    //set the dependency queue final callback
    dependencyQueue.drain = function(){
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
            var errors = [];
            for(var i=0; i<results.length; i++){
                var result = results[i];
                if(result.type == 'css')
                    cssjs.push(result.js);
                if(result.type == 'js')
                    js.push(result.js);
                if(result.error)
                    errors.push(result.error);
            }
        
            //add the css before the js (local less needs to exist before js parser)
            if(cssjs){
                js = cssjs.combine(js);
            }
        
            //add error messages
            if(errors){
                js.push(helpers.formatErrors(errors, settings));
            }
        
            //combine it all into js
            js = js.join("\n\n");
        
    	    finalCallback(!!errors, js);
        });
    };
    
    //kick off the dependency queue
    dependencyQueue.push(_.map(builders, function(builder){
        return makeDependencyFinderTask(builder, dependencyQueueTasks, builders);
    }));
};


