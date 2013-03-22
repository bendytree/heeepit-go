

module.exports = {
    getQueryStringFromUrl: function(url){
        var indexOfQuestionMark = url.indexOf("?");
        if(indexOfQuestionMark == -1 || indexOfQuestionMark == url.length-1){
            return null;
        }
        return url.substring(indexOfQuestionMark+1);  
    },
    isUrlLocal: function(url){
        
    },
    rx: {        
        var isDebugRegex = /^http[s]?:\/\/(localhost|127[.]0[.]0[.]1)/i;
        var baseUrlRegex = /\/[^\/]*$/i;
    }
};