
var repo = require('../../repo');

var key_builder = require('./key_builder');
var settings_parser = require('./settings_parser');
var asset_builder = require('./asset_builder');

module.exports = function(req, res){       
    //parse the settings
    var settings = settings_parser(req);
    
    //validate settings
    if(settings.error){
        res.send(settings.error);
        return;
    }
    
    //force means clear the cache
    if(settings.force)
        repo.delete(settings.key); //async, no callback
    
    var finish = function(){
        //build the response
        asset_builder(settings, function(js){
            //cache the result
            if(!settings.debug)
                repo.set(key, js);
        
            //respond to the request
            res.send(js);
        });
    };
    
    //look in the cache?
    var couldBeCached = !settings.force && !settings.debug;
    if(couldBeCached){
        repo.get(settings.key, function(js){
            //if cached, we're done
            if(js){
                res.send(js);
                return;
            }
        
            finish();
        });
    }else{
        finish();
    }
};

