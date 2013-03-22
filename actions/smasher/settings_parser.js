
var key_builder = require('./key_builder');

var isDebugRegex = /^http[s]?:\/\/(localhost|127[.]0[.]0[.]1)/i;
var baseUrlRegex = /\/[^\/]*$/i;

module.exports = function(req){
    if(!req.params.type){
        return {error: "No type was given"};
    }
    var type = req.params.type.toLowerCase();
    
    //get the query string
    var indexOfQuestionMark = req.url.indexOf("?");
    if(indexOfQuestionMark == -1 || indexOfQuestionMark == req.url.length-1){
        return {error:"Query string required"};
    }
    var qs = req.url.substring(indexOfQuestionMark+1);
    
    //parse the flags
    var flags = (req.params.flags || '').toLowerCase();
    var hasFlag = function(flag){
        return flags.indexOf(flag) != -1;
    };
    
    //decide if isDebug
    var isDebug = null;
    if(hasFlag("prod")){
        isDebug = false;
    }else if(hasFlag("debug")){
        isDebug = true;
    }else{
        isDebug = isDebugRegex.test(req.headers.referer);
    }
    
    var urls = qs.split(",");
    var baseUrl = req.headers.referer.replace(baseUrlRegex, '')+'/';
    if(!urls.length){
        return {error:"At least one url is required."};
    }
    for(var i=0; i<urls.length; i++){
        var url = urls[i];
        if(url.indexOf("http") == 0)
            continue;
        urls[i] = baseUrl + "/" + url.replace(/^\/*/, "");
    }
    
    //build the settings object
    var settings = {
        type: type,
        urls: urls,
        isDebug: isDebug,
        doForce: hasFlag("force")
    };
    settings.key = key_builder(settings);
    return settings;
};
