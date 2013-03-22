
var data = {};

module.exports = {
	set: function(key, val){
	    setTimeout(function(){
    	    data[key] = val;
        }, 1);
	},
	get: function(key, callback){
	    callback(data[key]);
	},
	delete: function(key){
	    delete data[key];
	}
};

//redis={x:{},set:function(k,v){x[k]=v},get:function(k){return x[k];}}; #RedisInATweet
