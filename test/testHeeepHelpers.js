
var assert = require("assert");
var helpers = require("../heeeps/helpers");


describe('helpers', function(){
  
    describe('getQueryStringFromUrl', function(){
      it('should split a query string at the question mark', function(){
        assert.equal(helpers.getQueryStringFromUrl("http://x.com?abc"), "abc");
      });
  
      it('should return an empty string with no question mark', function(){
        assert.equal(helpers.getQueryStringFromUrl("http://x.com"), "");
      });
  
      it('should return an empty string with question mark last', function(){
        assert.equal(helpers.getQueryStringFromUrl("http://x.com?"), "");
      });
  
      it('should return results after first question mark, not last', function(){
        assert.equal(helpers.getQueryStringFromUrl("http://x.com?a?b"), "a?b");
      });
    });  
    
    describe('cssToJs', function(){
      it('should doc.write a style tag', function(){
        assert.equal(helpers.cssToJs("body{}"), 'document.write("<style type=text/css> body{} </style>");');
      });
    });
    
    describe('formatErrors', function(){
      it('should write errors in a closure', function(){
        var js = helpers.formatErrors([],{});
        assert(js.indexOf('(function () {') == 0, js);
      });
      
      it('should contain the error messages', function(){
        var js = helpers.formatErrors(['abcde', 'fghijk'],{});
        assert(js.indexOf('abcde') > -1, js);
        assert(js.indexOf('fghijk') > -1, js);
      });
    });
    
    describe('isUrlLocal', function(){
      it('should be true for http://localhost', function(){
        assert(helpers.isUrlLocal("http://localhost"));
      });
      
      it('should be true for https://localhost', function(){
        assert(helpers.isUrlLocal("https://localhost"));
      });
      
      it('should be true for localhost without http', function(){
        assert(helpers.isUrlLocal("localhost"));
      });
      
      it('should not be true if localhost is just in the url', function(){
        assert(!helpers.isUrlLocal("http://x.com/localhost"));
      });
      
      it('should be true if localhost is domain and in the path', function(){
        assert(helpers.isUrlLocal("http://localhost/localhost"));
      });
      
      it('should be true with a port', function(){
        assert(helpers.isUrlLocal("http://localhost:3000"));
      });
      
      it('should be true with a path', function(){
        assert(helpers.isUrlLocal("http://localhost/lksjdf?oiejfief"));
      });
      
      it('should be true for localhost.com', function(){
        assert(helpers.isUrlLocal("http://localhost.com"));
      });
      
      it('should be true for 127.0.0.1', function(){
        assert(helpers.isUrlLocal("http://127.0.0.1"));
      });
      
      it('should be true for 0.0.0.0', function(){
        assert(helpers.isUrlLocal("http://0.0.0.0"));
      });
    });
    
    describe('isLibName', function(){
      it('should be true for letters, numbers, dashes', function(){
        assert(helpers.isLibName("sdf23-234-saf-3r293r-f"));
      });
      
      it('should be false if a space is included', function(){
        assert(!helpers.isLibName("sdf sdf"));
      });
      
      it('should be false if a slash is included', function(){
        assert(!helpers.isLibName("sdf/sdf"));
      });
      
      it('should be false if a dot is included', function(){
        assert(!helpers.isLibName("sdf.sdf"));
      });
    });
    
});
