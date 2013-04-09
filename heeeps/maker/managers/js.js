

var uglify = require("uglify-js");
var Manager = require("./manager");

module.exports = Manager.extend({
    build: function(callback){
        if(this.useOriginal){
            //just reference the original script
            callback({
                type: 'js',
                js: "document.write(\"<scr\"+\"ipt type='text/javascript' src='"+this.lib+"'></scr\"+\"ipt>\");"
            });
            return;
        }
        
        //load the js 
        this.getUrl(function(err, body){
            if (err) {
                callback({ error: error });
            }else{ 
                //minify it
                callback({
                    type: 'js',
                    js: uglify.minify(body, {fromString: true}).code
                });
            }
        });
    },
    loadDependencies: function(callback){
        //js never has a dependency
        callback(null, []);
    }
});

module.exports.filter = /[.]js$/i;

