
var request = require('request');
var helpers = require('helpers');
var uglifycss = require('uglifycss');
var less = require('less');

module.exports = builder = function(url, settings){
    this.url = url;
    this.settings = settings;
    this.useOriginal = this.settings.debug || helpers.rx.isUrlLocal.test(this.url);
    
    this.build = function(callback){
        if(this.useOriginal){
            //just reference the original script
            callback({
                cssjs: "document.write(\"<link rel='stylesheet/less' type='text/css' href='"+this.url+"' />\");"
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
                less.render(body, function (e, css) {
                    if(e){
                        body = "/* ERROR: " + e + " */";
                    }else{
                        //now minify
                        body = uglifycss.processString(css);
                    }
                });
            }
            
            callback({
                cssjs: note+helpers.cssToJs(body)
            });
        });
    };
    
    this.getDependencyNames = function(){
        //use local less parser if we're using the original
        return this.useOriginal ? ["less"] : [];
    };
};

builder.supports = function(url){
    return helpers.rx.isUrlLess.test(url);
};
