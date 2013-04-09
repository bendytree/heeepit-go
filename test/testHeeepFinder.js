
var assert = require("assert");
var mockit = require("mockit");
var helpers = require("../heeeps/helpers");

var repo = {};
var maker = {};

var finder = mockit("../heeeps/finder", {
    './repo': repo,
    './maker/maker': function(s,c){ maker.make(s,c); }
});

beforeEach(function(){
  repo.get = function(key, callback){callback();};
  repo.set = function(){};
  repo.delete = function(){};
  maker.make = function(settings, callback){callback();}
});

describe('finder', function(){
  
  it('should return a formatted error if settings have errors', function(done){
      var settings = {error:'qwertyuiop'};
      finder(settings, function(js){
          var expected = helpers.formatErrors([settings.error], settings);
          assert.equal(js, expected);
          done();
      });
  });
  
  describe('deletion', function(){      
      it('should delete the previous heeep if force is true', function(done){
          var didDelete = false;
          repo.delete = function(key){
              assert.equal(key, 'abc');
              didDelete = true;
          };
          finder({force:true,key:'abc'}, function(){
              assert(didDelete, 'should have called delete');
              done();
          });
      });
      
      it('should not delete the previous heeep if force is false', function(done){
          repo.delete = function(){ 
              assert(false, 'delete was called'); 
              done(); 
          };
          finder({force:false}, done);
      });
  });
  
  describe('cache', function(){      
      it('should check cache if unforced and production', function(done){
          repo.get = function(key){
              assert.equal(key, 'abc');
              done();
          };
          finder({force:false, debug:false, key:'abc'}, function(){
              assert(false, 'should have checked cache');
              done();
          });
      });
      
      it('should not check cache if forced', function(done){
          repo.get = function(key){
              assert(false, 'should not have called get on cache');
          };
          finder({force:true, key:'abc'}, done);
      });
      
      it('should not check cache if debug', function(done){
          repo.get = function(key){
              assert(false, 'should not have called get on cache');
          };
          finder({debug:true, key:'abc'}, done);
      });
      
      it('should not make if the cache exists', function(done){
          repo.get = function(key, callback){
              callback(null, "ok");
          };
          maker.make = function(settings, callback){
              assert(false, 'should not have called make');
              callback();
          };
          finder({debug:false, key:'abc'}, function(js){ 
              done(); 
          });
      });
      
      it('should make if the cache does not exists', function(done){
          var wasMakeCalled = false;
          repo.get = function(key, callback){
              callback(null);
          };
          maker.make = function(settings, callback){
              wasMakeCalled = true;
              callback();
          };
          finder({debug:false, key:'abc'}, function(js){ 
              assert(wasMakeCalled, "make should have been called");
              done(); 
          });
      });
  });
  
  describe('maker result', function(){      
    it('should be cached if maker succeeded', function(done){
      var wasSetCalled = false;
      repo.set = function(key, val){
          assert.equal(key, "abc"); 
          assert.equal(val, "ok");
          wasSetCalled = true; 
      };
      maker.make = function(settings, callback){ callback(null, 'ok'); };
      finder({debug:false, key:'abc'}, function(js){ 
          assert(wasSetCalled, "'set' should have been called");
          done(); 
      });
    });
    
    it('should not be cached if maker fails', function(done){
      repo.set = function(key, val){
          assert(false, 'should not set cache');
      };
      maker.make = function(settings, callback){ callback('error!', null); };
      finder({debug:false, key:'abc'}, function(js){ 
          done(); 
      });
    });
    
    it('should not be cached if debug is true', function(done){
      repo.set = function(key, val){
          assert(false, 'should not set cache');
      };
      maker.make = function(settings, callback){ callback(null, "ok"); };
      finder({debug:true, key:'abc'}, function(js){ 
          done(); 
      });
    });
  });
});
