
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
                type: 'css',
                js: helpers.cssToJs("@import:url(\""+this.url+"\");")
            });
            return;
        }
        
        //load the css and minify it
        request(url, function (error, response, body) {
            if (error) {
                callback({
                    error: error + " on " + url
                });
            }else{
                //minify
                body = uglifycss.processString(body);
                
                callback({
                    type: 'css',
                    js: "/* SOURCE: "+url+" */\n"+helpers.cssToJs(body)
                });
            }
        });
    };
    
    this.getDependencyNames = function(callback){
        callback([]); //css never has a dependency
    };
};

builder.supports = function(url){
    return helpers.rx.isUrlCss.test(url);
};
