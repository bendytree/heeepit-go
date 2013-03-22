
module.exports = builder = function(url, settings){
    this.url = url;
    
    this.build = function(callback){
        callback({
            js: null
        });
    };
    
    this.getDependencyNames = function(){
        
    };
};

builder.supports = function(url, settings){
    return settings.isDebug && isJsRegex.test(url);
};
