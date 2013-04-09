
var Manager = require("./manager");
var uglify = require("uglify-js");
var coffee = require('coffee-script');


module.exports = Manager.extend({    
    build: function(callback){
        //debug or local urls should just reference the original script
        if(this.useOriginal){
            callback({
                type: 'js',
                js: "document.write(\"<scr\"+\"ipt type='text/coffeescript' src='"+this.lib+"'></scr\"+\"ipt>\");"
            });
            return;
        }
        
        //load it
        this.getUrl(function (error, body) {
            if (error) {
                callback({ error: error });
            }else{
                try {
                    //compile coffee to js
                    body = coffee.compile(body);
                    
                    //minify the js
                    body = uglify.minify(body, {fromString: true}).code;
                    
                    //callback
                    callback({
                        type: 'js',
                        js: body
                    });
                }catch(error){
                    callback({ error: error });
                }
            }
        });
    },
    loadDependencies: function(callback){
        //need to reference coffee-script parser if we're using direct reference
        callback(null, this.useOriginal ? ['coffee-script'] : []);
    }
});

module.exports.filter = /[.]coffee$/i;
