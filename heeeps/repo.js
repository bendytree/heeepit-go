
var redis = require("redis");
var config = require('../config');
//var client = redis.createClient(null, config.redisurl);

module.exports = {
	set: function (key, val) {
		return;
		
		client.set(key, val);
	    client.expire(key, 120);
	},
	get: function (key, callback) {
		callback('not found', null);
		return;
		
		client.get(key, callback);
	},
	delete: function (key) {
		return;
		
	    client.del(key);
	}
};


// var data = {};
// module.exports = {
// 	set: function (key, val) {
// 	    setTimeout(function(){
//     	    data[key] = val;
//         }, 1);
// 	},
// 	get: function (key, callback) {
// 	    callback(data[key]);
// 	},
// 	delete: function (key) {
// 	    delete data[key];
// 	}
// };
