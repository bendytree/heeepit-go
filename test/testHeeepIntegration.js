
var assert = require("assert");
var mockit = require("mockit");
var Manager = require("../heeeps/maker/managers/manager");

var TestManager = Manager.extend({
    build: function(callback){
        if(this.lib == 'jquery') callback({type:'js',js:'jquery'});
        if(this.lib == 'jquery-ui-css') callback({type:'css',js:'jquery-ui-css'});
        if(this.lib == 'jquery-ui') callback({type:'js',js:'jquery-ui'});
        if(this.lib == 'http://mysite.com/page.js') callback({type:'js',js:'page.js'});
        if(this.lib == 'http://mysite.com/site.css') callback({type:'css',js:'site.css'});
    },
    loadDependencies: function(callback){
        callback(null, this.lib == 'jquery-ui' ? ['jquery', 'jquery-ui-css'] : []);
    }
});

beforeEach(function(){
	for (var prop in require.cache)
		if (require.cache.hasOwnProperty(prop))
			delete require.cache[prop];
});

describe('go action', function(){
  
  it('should respond correctly', function(done){
      var crumbs = [];
      var go = mockit("../actions/go", {
        './repo': {
            delete: function(){ crumbs.push('repo.delete'); },
            set: function(){ crumbs.push('repo.set'); },
            get: function(){ assert(false, 'should not call repo.get'); }
        },
        './managers/managerSelector': {select:function(lib, settings){
			return new TestManager(lib, settings);
        }}
      });
      
      var req = { 
        url:"http://go.heeep.it?jquery-ui,page.js,--force,http://mysite.com/site.css",
        headers: {referer:"http://mysite.com/index.html"}
      };
      var res = {
        send: function(response){
          assert.equal(response, 'jquery-ui-css\n\nsite.css\n\njquery\n\njquery-ui\n\npage.js');
          assert.equal(crumbs.join('|'), 'repo.delete|repo.set');
          done();
        }
      };
      
      go(req, res);
  });
    
});
