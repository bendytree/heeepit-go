var crypto = require('crypto');
var helpers = require("../helpers");


module.exports = function(req){
    //get the query string
    var qs = helpers.getQueryStringFromUrl(req.url);
    if(!qs) return {error:"No query string was provided."};
    
    //separate libs and flags
    var flags = [];
    var libs = [];
    var refererBaseUrl = req.headers.referer.replace(helpers.rx.baseUrlRegex, '')+'/';
    var isSpecificToRefererUrl = false;
    
    //go through each piece of the qs
    _.each(qs.split(","), function(i){
        if(i.indexOf("--") == 0){
            //clean up flags
            flags.push(i.substring(2).toLowerCase());
        }else if(helpers.rx.isLibName.test(i)){
            //don't mess with lib names
            libs.push(i);
        }else{
            //for urls, include full url if needed
            if(i.indexOf("http") != 0){
                isSpecificToRefererUrl = true;
                i = refererBaseUrl + "/" + i.replace(helpers.rx.trimLeadingForwardSlashes, "");
            }
            libs.push(i);
        }
    });
    
    //convenience function for checking flags later
    var hasFlag = function(flag){
        return flags.indexOf(flag) != -1;
    };
    
    //validate assets
    if(!libs.length){
        return {error:"At least one lib is required."};
    }
    
    //debug?
    var debug = null;
    if(hasFlag("prod")){
        debug = false;
    }else if(hasFlag("debug")){
        debug = true;
    }else{
        debug = req.headers.referer && helpers.rx.isDebug.test(req.headers.referer);
    }
    
    //build the key
    var key = "wad:"+crypto.createHash('md5').update(
        [].concat(
            isSpecificToRefererUrl ? ["for:"+refererBaseUrl] : ["generic"],
            _.sortBy(libs, helpers.returnSelf),
            _.sortBy(_.filter(flags, function(f){ return f != 'force' }), helpers.returnSelf)
        ).join('|')
    ).digest("hex");
    
    //build the settings object
    return {
        flags: flags,
        libs: libs,
        debug: debug,
        force: hasFlag("force"),
        key: key,
        hasFlag: hasFlag
    };
};
