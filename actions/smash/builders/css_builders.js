
var request = require('request');
var async = require('async');

module.exports = function(settings, callback){
    //debug?
    if(settings.isDebug){        
    	var css = [];
    	for(var i=0; i<settings.urls.length; i++){
    		css.push("@import url(\""+settings.urls[i]+"\");");
    	}
    	callback(css.join("\n\n"));
        return;
    }
    
    //build a loader for each script
	var loaders = [];
	for(var i=0; i<settings.urls.length; i++){
		loaders.push((function(url){
            return function(loaderCallback){
        	    request(url, function (error, response, body) {
                    var note = "/* SOURCE: "+url+" */\n";
                    if (error) {
                        body = "/* ERROR: " + error + " */";
                    }
                    
                    loaderCallback(null, note+body);
                });
            };
        })(settings.urls[i]));
	}
	
	//the callback when all requests are finished
    async.parallel(loaders, function(err, results){
	    callback(results.join("\n\n"));
    });
};
