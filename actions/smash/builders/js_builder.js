
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
            var note = "/* SOURCE: "+url+" */\n";
            if (error) {
                body = "/* ERROR: " + error + " */";
            }else{                
                body = uglify.minify(body, {fromString: true}).code;
            }
            
            callback({
                js: note+body
            });
        });
    };
    
    this.getDependencyNames = function(){
        return []; //js never has a dependency
    };
};

builder.supports = function(lib){
    return helpers.rx.isUrlJs.test(lib);
};
