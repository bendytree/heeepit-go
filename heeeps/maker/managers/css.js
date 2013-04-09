
var helpers = require('../../helpers');
var uglifycss = require('uglifycss');
var Manager = require("./manager");

module.exports = Manager.extend({
    build: function(callback){
        if(this.useOriginal){
            //just reference the original script
            callback({
                type: 'css',
                js: "document.write(\"<link rel='stylesheet' type='text/css' href='"+this.lib+"' />\");"
            });
            return;
        }
        
        //load the css and minify it
        this.getUrl(function (error, body) {
            if (error) {
                callback({ error: error });
            }else{
                //minify
                body = uglifycss.processString(body);
                
                callback({
                    type: 'css',
                    js: helpers.cssToJs(body)
                });
            }
        });
    },    
    loadDependencies: function(callback){
        //css never has a dependency
        callback(null, []); 
    }
});

module.exports.filter = /[.]css$/i;
