
var repo = require('./repo');
var maker = require('./maker/maker');
var helpers = require('./helpers');

module.exports = function(settings, callback){       
    
    //validate settings
    if(settings.error){
        callback(helpers.formatErrors([settings.error], settings));
        return;
    }
    
    //clear cache if force
    if(settings.force){
        repo.delete(settings.key); //async, no callback
    }

    var buildIt = function(){
        //build the response
        maker(settings, function(err, js){
            //cache the result
            if(!settings.debug && !err)
                repo.set(settings.key, js);
        
            //respond to the request
            callback(js);
        });
    };
    
    //look in the cache?
    var couldBeCached = !settings.force && !settings.debug;
    if(couldBeCached){
        repo.get(settings.key, function(err, js){
            //if cached, we're done
            if(js){
                callback(js);
                return;
            }
        
            buildIt();
        });
    }else{
        buildIt();
    }
};

