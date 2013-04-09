

var Manager = require("./manager");

module.exports = Manager.extend({
    build: function(callback){
        callback({ error: 'unknown' });
    },
    loadDependencies: function(callback){
        callback(null, []);
    }
});

module.exports.filter = /.*/;

