
var helpers = require("../helpers");
var Package = require("/models/package");

module.exports = builder = function(name, settings){
    this.name = name;
    this.settings = settings;
    
    this.build = function(callback){
        callback({
        });
    };
    
    this.getDependencyNames = function(callback){
        var self = this;
        Package.find({name:this.name}, function(err, package){
            self.package = package;
            callback(package ? package.dependencies : []);
        });
    };
};

builder.supports = function(url){
    return helpers.rx.isLibName.test(url);
};
