
module.exports = helpers = {
    getQueryStringFromUrl: function(url){
        var indexOfQuestionMark = url.indexOf("?");
        if(indexOfQuestionMark == -1 || indexOfQuestionMark == url.length-1){
            return null;
        }
        return url.substring(indexOfQuestionMark+1);  
    },
    returnSelf: function(x){ return x; },
    cssToJs: function(css){
        css = css.replace(helpers.rx.oneOrMoreNewlines, ' ');
        return 'document.write("<style type=text/css> '+css+' </style>");';
    },
    formatErrors: function(errors, settings){
        return @"
            (function(loud){
                var errors = "+JSON.stringify(errors)+@";
                if(loud){
                    errors.unshift(errors.length+' error(s) packaging your assets:');
                    alert(errors.join('\n'));
                }else{
                    if(console && console.log){
                        for(var i=0; i<errors.length; i++){
                            console.log(errors[i]);
                        }
                    }
                }
            })("+settings.loud+@");
        ";
    },
    
    //pre compiled regexes
    rx: {        
        isUrlLocal: /^http[s]?:\/\/(localhost|127[.]0[.]0[.]1|0[.]0[.]0[.]0)/i,
        baseUrl: /\/[^\/]*$/i,
        isLibName: /[^-a-z0-9]/i,
        trimLeadingForwardSlashes: /^\/*/,
        isUrlJs: /[.]js$/i,
        isUrlCoffee: /[.]coffee$/i,
        isUrlCss: /[.]css$/i,
        isUrlLess: /[.]less$/i,
        isUrlSass: /[.]sass$/i,
        oneOrMoreNewlines: /\n+/g
    }
};