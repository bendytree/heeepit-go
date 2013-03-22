
var helpers = require("../../helpers");
var request = require('request');
var uglify = require("uglify-js");
var coffee = require('coffee-script');

module.exports = builder = function(url, settings){
    this.url = url;
    this.settings = settings;
    this.useOriginal = this.settings.debug || helpers.rx.isUrlLocal.test(this.url);
    
    this.build = function(callback){
        //debug or local urls should just reference the original script
        if(this.useOriginal){
            callback({
                js: "document.write(\"<script type='text/coffeescript' src='"+this.url+"'></script>\");"
            });
            return;
        }
        
        //load it
        request(url, function (error, response, body) {
            if (error) {
                callback({
                    error: error + " on " + url
                });
            }else{
                try {
                    //compile coffee to js
                    body = coffee.compile(body);
                    
                    //minify the js
                    body = uglify.minify(body, {fromString: true}).code;
                    
                    //callback
                    callback({
                        js: "/* SOURCE: "+url+" */\n"+body
                    });
                }catch(error){
                    callback({
                        error: error + " on " + url
                    });
                }
            }
        });
    };
    
    this.getDependencyNames = function(){
        //need to reference coffee-script parser if we're using direct reference
        return this.useOriginal ? ['coffee-script'] : [];
    };
};

builder.supports = function(lib){
    return helpers.rx.isUrlCoffee.test(lib);
};
