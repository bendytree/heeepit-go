var crypto = require('crypto');
var helpers = require("../helpers");


module.exports = function(req){
    //get the query string
    var qs = helpers.getQueryStringFromUrl(req.url);
    if(!qs) return {error:"No query string was provided."};
    
    //sort urls, flags, and names
    var flags = [];
    var urls = [];
    var libs = [];
    var refererBaseUrl = req.headers.referer.replace(baseUrlRegex, '')+'/';
    _.each(qs.split(","), function(i){
        if(i.indexOf("--") == 0){
            flags.push(i.substring(2).toLowerCase());
        }else if((/[^_-a-z0-9]/i).test(i)){
            libs.push(i);
        }else{            
            if(i.indexOf("http") != 0){
                i = refererBaseUrl + "/" + i.replace(/^\/*/, "");
            }
            urls.push(i);
        }
    });
    var hasFlag = function(flag){
        return flags.indexOf(flag) != -1;
    };
    
    //validate assets
    if(!(urls.length + libs.length)){
        return {error:"At least one url or lib is required."};
    }
    
    //debug?
    var debug = null;
    if(hasFlag("prod")){
        debug = false;
    }else if(hasFlag("debug")){
        debug = true;
    }else{
        debug = req.headers.referer && isDebugRegex.test(req.headers.referer);
    }
    
    var key = "smash:"+crypto.createHash('md5').update([
        refererBaseUrl,
        urls.join('|'),
        libs.join('|'),
        _.filter(flags, function(f){ return f != 'force' }).join('|')
    ].join('|')).digest("hex");
    
    //build the settings object
    return {
        flags: flags,
        urls: urls,
        libs: libs,
        debug: debug,
        force: hasFlag("force"),
        key: key
    };
};
