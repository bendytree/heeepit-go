
var request = require('request');
var uglifycss = require('uglifycss');
var less = require('less');

var helpers = require('/helpers');

module.exports = builder = function(url, settings){
    this.url = url;
    this.settings = settings;
    this.useOriginal = this.settings.debug || helpers.rx.isUrlLocal.test(this.url);
    
    this.build = function(callback){
        if(this.useOriginal){
            //just reference the original script
            callback({
                type: 'css',
                js: "document.write(\"<link rel='stylesheet/less' type='text/css' href='"+this.url+"' />\");"
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
                less.render(body, function (error, css) {
                    if(error){
                        callback({
                            error: error + " on " + url
                        });
                    }else{
                        //now minify
                        body = uglifycss.processString(css);
                        
                        callback({
                            type: 'css',
                            js: "/* SOURCE: "+url+" */\n"+helpers.cssToJs(body)
                        });
                    }
                });
            }
        });
    };
    
    this.getDependencyNames = function(callback){
        //use local less parser if we're using the original
        callback(this.useOriginal ? ["less"] : []);
    };
};

builder.supports = function(url){
    return helpers.rx.isUrlLess.test(url);
};
