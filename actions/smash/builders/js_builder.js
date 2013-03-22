
module.exports = builder = function(url, settings){
    this.url = url;
    this.settings = settings;
    
    this.build = function(callback){
        if(this.settings.debug || this.settings.isUrlLocal(this.url)){
            callback({
                js: "document.write(\"<script type='text/javascript' src='"+this.url+"'></script>\");"
            });
            return;
        }
                
        request(url, function (error, response, body) {
            var note = "/* SOURCE: "+url+" */\n";
            if (error) {
                body = "/* ERROR: " + error + " */";
            }else{
                if((/[.]coffee$/i).test(url)){
                    body = coffee.compile(body);
                }
                
                body = uglify.minify(body, {fromString: true}).code;
            }
            
            callback({
                js: note+body
            });
        });
    };
    
    this.getDependencyNames = function(){
        
    };
};

builder.supports = function(url, settings){
    return settings.isDebug && isJsRegex.test(url);
};
