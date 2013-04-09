
var Package = require("../../../models/package");
var Manager = require("./manager");
var managerSelector = require("./managerSelector");
var helpers = require("../../helpers");

		
module.exports = Manager.extend({
    build: function(callback){
		if(!this.package){
			callback({error:'Package not found.'});
			return;
		}
		
		var manager = managerSelector.select(this.package.srcUrl, this.settings);
		manager.build(function (result){
		    callback(result);
		});
    },
	loadDependencies: function(callback){
	    var me = this;
        Package.findOne({name:this.lib}, function(err, package){
            me.package = package;
            callback(null, package ? package.dependencies : []);
        });
    }
});

module.exports.filter = helpers.isLibNameRegex;
