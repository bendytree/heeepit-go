
var request = require('request');
var uglify = require("uglify-js");
var coffee = require('coffee-script');

var isJsRegex = /[.]js$/i;
var isCoffeeRegex = /[.]coffee$/i;

module.exports = [
    {
    },
    {
        supports: function(url, settings){
            return !settings.isDebug && isJsRegex.test(url);
        },
        build: function(url, settings, callback){
        }
    },
    {
        supports: function(url, settings){
            return settings.isDebug && isCoffeeRegex.test(url);
        },
        build: function(url, settings, callback){
            callback({
                js: "document.write(\"<script type='text/javascript' src='"+url+"'></script>\");"
            });
        }
    },
    {
        supports: function(url, settings){
            return !settings.isDebug && isCoffeeRegex.test(url);
        },
        build: function(url, settings, callback){
            request(url, function (error, response, body) {
                var note = "/* SOURCE: "+url+" */\n";
                if (error) {
                    body = "/* ERROR: " + error + " */";
                }else{
                    body = coffee.compile(body);                    
                    body = uglify.minify(body, {fromString: true}).code;
                }
                
                callback({
                    js: note+body
                });
            });
        }
    }
];

