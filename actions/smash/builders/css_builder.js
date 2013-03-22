
var request = require('request');
var helpers = require('helpers');
var uglifycss = require('uglifycss');

module.exports = builder = function(url, settings){
    this.url = url;
    this.settings = settings;
    this.useOriginal = this.settings.debug || helpers.rx.isUrlLocal.test(this.url);
    
    this.build = function(callback){
        if(this.useOriginal){
            //just reference the original script
            callback({
                cssjs: helpers.cssToJs("@import:url(\""+this.url+"\");")
            });
            return;
        }
        
        //load the css and minify it
        request(url, function (error, response, body) {
            var note = "/* SOURCE: "+url+" */\n";
            if (error) {
                //use the error message as the body
                body = "/* ERROR: " + error + " */";
            }else{
                //minify
                body = uglifycss.processString(body);
            }
            
            callback({
                cssjs: note+helpers.cssToJs(body)
            });
        });
    };
    
    this.getDependencyNames = function(){
        return []; //css never has a dependency
    };
};

builder.supports = function(url){
    return helpers.rx.isUrlCss.test(url);
};
