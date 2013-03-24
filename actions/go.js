
var wadFinder = require('/wadFinder');
var settingsParser = require('/settingsParser');

module.exports = function (req, res) {
    //parse the settings
    var qs = helpers.getQueryStringFromUrl(req.url);
    var referer = req.headers ? req.headers.referer : '';
    var settings = settingsParser.parse(qs, referer);
        
    //find the wad (or build it)
    wadFinder.find(settings, function (js){
        res.send(js);
    });
};
