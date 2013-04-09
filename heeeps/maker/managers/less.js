
var uglifycss = require('uglifycss');
var less = require('less');
var Manager = require("./manager");
var helpers = require("../../helpers");

module.exports = Manager.extend({
    build: function(callback){
        if(this.useOriginal){
            //just reference the original script
            callback({
                type: 'css',
                js: "document.write(\"<link rel='stylesheet/less' type='text/css' href='"+url+"' />\");"
            });
            return;
        }
        
        //load the css and minify it
        this.getUrl(function (error, body) {
            if (error) {
                callback({ error: error });
            }else{
                //compile less
                less.render(body, function (error, css) {
                    if(error){
                        callback({ error: error });
                    }else{
                        //now minify
                        body = uglifycss.processString(css);
                        
                        callback({
                            type: 'css',
                            js: helpers.cssToJs(body)
                        });
                    }
                });
            }
        });
    },
    loadDependencies: function(callback){
        //use local less parser if we're using the original
        callback(null, this.useOriginal ? ["less"] : []);
    }
});

module.exports.filter = /[.]less$/i;
