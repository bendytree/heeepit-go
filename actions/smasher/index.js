
var repo = require('../../repo');

var settings_parser = require('./settings_parser');
var js_builder = require('./js_builder');
var css_builder = require('./css_builder');

module.exports = function(req, res){
    //parse the settings
    var settings = settings_parser(req);
    
    //validate settings
    if(settings.error){
        res.send(settings.error);
        return;
    }
    
    //forced means force a refresh
    if(settings.doForce)
        repo.delete(settings.key);
    
    var finish = function(){
        //choose a builder
        var builder = null;
        if(settings.type == 'js')
            builder = js_builder;
        if(settings.type == 'css')
            builder = css_builder;
        
        //build the response
        builder(settings, function(txt){
            //cache the result
            if(!settings.isDebug)
                repo.set(settings.key, txt);
            
            //respond to the request
            res.send(txt);
        });
    };
    
    //look in the cache?
    var couldBeCached = !settings.doForce && !settings.isDebug;
    if(couldBeCached){
        repo.get(settings.key, function(txt){
            //if cached, we're done
            if(txt){
                res.send(txt);
                return;
            }
            
            finish();
        });
    }else{
        finish();
    }
};

