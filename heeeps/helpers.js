
var ejs = require('ejs');
var errorTemplate = require('fs').readFileSync(__dirname + '/../views/errorsjs.ejs', 'ascii');
var isLibNameRegex = /^[-a-z0-9]*$/i;

module.exports = {
    getQueryStringFromUrl: function (url){
        var indexOfQuestionMark = url.indexOf("?");
        if(indexOfQuestionMark == -1 || indexOfQuestionMark == url.length-1)
            return '';
        return url.substring(indexOfQuestionMark+1);  
    },
    cssToJs: function (css){
        return 'document.write("<style type=text/css> '+css+' </style>");';
    },
    formatErrors: function (errors, settings){
        return ejs.render(errorTemplate, {
            errors:errors, 
            settings:settings
        });
    },
    isUrlLocal: function(url){
        return /^(http[s]?:\/\/)?(localhost|127[.]0[.]0[.]1|0[.]0[.]0[.]0)/i.test(url);
    },
	isLibNameRegex: isLibNameRegex,
    isLibName: function(lib){
        return isLibNameRegex.test(lib);
    }
};