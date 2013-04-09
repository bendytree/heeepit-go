
var request = require('request');
var Class = require("simple-class").Class;
var helpers = require("../../helpers");

module.exports = Class.extend({
	init: function(lib, settings){
		this.lib = lib;
		this.settings = settings;
		this.useOriginal = this.settings.debug || helpers.isUrlLocal(lib);
		this.name = helpers.isLibName(lib) ? lib : null;
	},
	getUrl: function(callback){
		request(this.lib, function (error, response, body) {
			callback(error, body);
		});
	},
	getDependencies: function(callback){
		if(this.dependencies)
		{
			callback(this.dependencies);
			return;
		}
		
		var me = this;
		this.loadDependencies(function(err, dependencies){
			me.dependencies = dependencies;
			callback(err, dependencies);
		});
	}
});
