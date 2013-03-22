
var crypto = require('crypto');

module.exports = function(settings){        
    var key = [
        settings.type,
        settings.urls.join(","),
        settings.baseUrl
    ].join(":");
        
    return "smash:"+crypto.createHash('md5').update(key).digest("hex");
};
