
var assert = require("assert");
var parser = require("../heeeps/settingsParser");

var isTrue = function(args, selector){
    return args, selector, true;
};

var isEqual = function(args, selector, val){
    var result = parser.parse(args);
    var json = JSON.stringify(result);
    try{
        var selectee = eval("result"+selector);
        assert.equal(selectee, val, "expected: "+val+"\nactual: "+selectee+"\nresult:"+json);
    }catch(e){
        assert(false, e + " " +json);
    }
};

describe('settingsParser', function(){
    
  it('should return error when args are blank', function(){
    isTrue(null, ".error");
    isTrue([], ".error");
    isTrue([''], ".error");
    isTrue(['',''], ".error");
  });
  
  it('should require at least one lib', function(){
    isTrue(['--someflag'], '.error');
    isTrue(['http://x.com/script.js'], '.error == null');
  });
  
  it('expects flags to start with two dashes', function(){
    isTrue(['http://x.com/script.js', '--X'], '.testing.flags.x === true');
    isTrue(['http://x.com/script.js', '--Y'], '.testing.flags.x == undefined');
  });
  
  it('assigns a value for the flag using anything after a colon', function(){
    isEqual(['http://x.com/script.js', '--X:something'], '.testing.flags.x', 'something');
  });   
  
  it('interprets letters, numbers, and dashes only as a repo name', function(){
    isTrue(['reponame'], '.libs[0] == "reponame"');
    isTrue(['repo-name'], '.libs[0] == "repo-name"');
    isTrue(['repo-name-2'], '.libs[0] == "repo-name-2"');
  });
  
  it('collects the base url', function(){
    isEqual(['http://x.com/script.js', '--base:http://x.com'], '.testing.flags.base', 'http://x.com/');
  });
  
  it('forces the base url to start with http', function(){
    isEqual(['http://x.com/script.js', '--base:x.com'], '.testing.flags.base', 'http://x.com/');
    isEqual(['http://x.com/script.js', '--base:https://x.com'], '.testing.flags.base', 'http://x.com/');
  });
  
  it('strips page name off base url', function(){
    isEqual(['http://x.com/script.js', '--base:http://x.com/page.html'], '.testing.flags.base', 'http://x.com/');
  });
  
  it('leave directories on the base url', function(){
    isEqual(['http://x.com/script.js', '--base:http://x.com/dir/page.html'], '.testing.flags.base', 'http://x.com/dir/');
  });
  
  it('attaches base url to local path', function(){
    isEqual(['script.js', '--base:http://x.com/dir/page.html'], '.libs[0]', 'http://x.com/dir/script.js');
  });
  
  it('has errors if a local script is referenced in production mode with no base url', function(){
    isTrue(['script.js', '--prod'], '.error');
  });
  
  it('has no errors if a local script is referenced in debug mode with no base url', function(){
    isTrue(['script.js', '--debug'], '.error == undefined');
  });
  
  it('uses a base-specific key if local libs are referenced', function(){
    isTrue(['script.js', '--debug'], '.testing.isSpecificToBase');
  });
  
  it('does not use base-specific key if repos only are referenced', function(){
    isTrue(['reponame'], '.testing.isSpecificToBase == false');
  });
  
  it('forces debug to false by default', function(){
    isTrue(['http://x.com/script.js'], '.debug == false');
  });
  
  it('forces debug to false if a production flag is given', function(){
    isTrue(['http://x.com/script.js', '--prod'], '.debug == false');
  });
  
  it('forces debug to true if a debug flag is given', function(){
    isTrue(['http://x.com/script.js', '--debug'], '.debug');
  });
  
  it('forces debug to true if the base url is localhost', function(){
    isTrue(['http://x.com/script.js', '--base:http://localhost'], '.debug');
  });
  
  it('blanks the key if debug is true', function(){
    isTrue(['http://x.com/script.js', '--debug'], '.key == ""');
  });
  
  it('has a key if debug is false', function(){
    isTrue(['http://x.com/script.js'], '.key != ""');
  });
  
  it('uses base, libs, and important flags to generate the key', function(){
    isEqual(['http://x.com/script.js'], '.testing.rawKey', 'generic|http://x.com/script.js|loud|false');
    isEqual(['http://x.com/script.js', '--loud'], '.testing.rawKey', 'generic|http://x.com/script.js|loud|true');
  });
  
  it('does not use force, debug, prod to generate the key', function(){
    isEqual(['http://x.com/script.js', '--debug', '--prod', '--force'], '.testing.rawKey', 'generic|http://x.com/script.js|loud|false');
  });
  
  it('uses md5 to create the real key', function(){
    isEqual(['http://x.com/script.js'], '.key.indexOf("wad:")', 0);
    isEqual(['http://x.com/script.js'], '.key.length', 36);
  });
  
});
