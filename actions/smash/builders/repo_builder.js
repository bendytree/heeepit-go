
var helpers = require("../../helpers");

module.exports = builder = function(url, settings){
    this.url = url;
    this.settings = settings;
    
    this.build = function(callback){
        callback({
        });
    };
    
    this.getDependencyNames = function(){
        
    };
};

builder.supports = function(url){
    return helpers.rx.isLibName.test(url);
};
