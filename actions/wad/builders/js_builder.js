
var helpers = require("../../helpers");
var request = require('request');
var uglify = require("uglify-js");


module.exports = builder = function(url, settings){
    this.url = url;
    this.settings = settings;
    this.useOriginal = this.settings.debug || helpers.rx.isUrlLocal.test(this.url);
    
    this.build = function(callback){
        if(this.useOriginal){
            //just reference the original script
            callback({
                js: "document.write(\"<script type='text/javascript' src='"+this.url+"'></script>\");"
            });
            return;
        }
        
        //load the js and minify it
        request(url, function (error, response, body) {
            if (error) {
                callback({
                    error: error + " on " + url
                });
            }else{ 
                callback({
                    js: "/* SOURCE: "+url+" */\n"+uglify.minify(body, {fromString: true}).code
                });
            }
        });
    };
    
    this.getDependencyNames = function(){
        return []; //js never has a dependency
    };
};

builder.supports = function(lib){
    return helpers.rx.isUrlJs.test(lib);
};
