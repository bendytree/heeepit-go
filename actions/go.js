
var helpers = require('../heeeps/helpers');
var finder = require('../heeeps/finder');
var settingsParser = require('../heeeps/settingsParser');

module.exports = function (req, res) {
    
    //not production
    res.send("alert('http://go.heeep.it is not yet active. See about.heeep.it for details.');");
    return;
    
    //split the qs by ,
    var args = helpers.getQueryStringFromUrl(req.url).split(',');
    
    //the referer is our base url
    if(req.headers && req.headers.referer)
        args.push('--base:'+req.headers.referer);
        
    //parse the settings
    var settings = settingsParser.parse(args);
        
    //find or make the heeep
    finder(settings, function (js){
        res.send(js);
    });
};
