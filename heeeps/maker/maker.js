
var async = require('async');
var _ = require('underscore')._;
var managerSelector = require('./managers/managerSelector');
var dependencySorter = require('./dependencySorter');
var helpers = require('../helpers');

var getDependencies = function(settings, finalCallback){
    //get a manager for each lib
	var managers = [];

    //build a queue to resolve all the dependencies
    var q = async.queue(function(lib, callback){
        var manager = managerSelector.select(lib, settings);
        managers.push(manager);        

        manager.getDependencies(function(err, names){
            //get unknown package names
            var unknown = _.difference(names, _.map(managers, function(b){ return b.name; }));

            //look for dependencies of the unknowns
            _.each(unknown, function(name){
                q.push(name);
            });
            
            callback();
        });
    }, 10/*concurrency*/);
    
    q.drain = function(){
        finalCallback(null, managers);
    };
    
    //kick off the dependency queue
    q.push(settings.libs);
};


module.exports = function (settings, finalCallback) { 
    
    getDependencies(settings, function(err, managers){
        
        //order the dependencies
        managers = dependencySorter(
            managers, 
            function(b){return b.name;}, 
            function(b){return b.dependencies;}
        );
    	
        //convert managers into loaders
        var loaders = _.map(managers, function (manager) {
    		return function (callback) {
    		    manager.build(function (result) {
					result.manager = manager;
    		        callback(null, result);
    	        });
    	    };
    	});
    
    	//run all loaders in parallel
        async.parallel(loaders, function (err, results) {
            
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
                    errors.push(result.error + ' on ' +result.manager.lib);
            }
    		
            //add the css before the js (local less needs to exist before js parser)
            if(cssjs.length)
                js = cssjs.concat(js);
    
            //add error messages
            if(errors.length)
                js.push(helpers.formatErrors(errors, settings));
    
            //combine it all into js
            js = js.join("\n\n");
    
    	    finalCallback(!!errors.length, js);
        });
    });

};


