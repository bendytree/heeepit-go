
var request = require('request');
var async = require('async');
var uglify = require("uglify-js");
var coffee = require('coffee-script');

module.exports = function(settings, callback){
    //debug?
    if(settings.isDebug){        
    	var js = [];
    	for(var i=0; i<settings.urls.length; i++){
    		js.push("document.write(\"<script type='text/javascript' src='"+settings.urls[i]+"'></script>\");");
    	}
    	callback(js.join("\n\n"));
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
                    }else{
                        if((/[.]coffee$/i).test(url)){
                            body = coffee.compile(body);
                        }
                        
                        body = uglify.minify(body, {fromString: true}).code;
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