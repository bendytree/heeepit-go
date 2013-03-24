
var wadRepo = require('wadRepo');
var wadMaker = require('/wadMaker');

module.exports = 
{
    find: function(settings, callback){       
    
        //validate settings
        if(settings.error){
            callback(settings.error);
            return;
        }
    
        //clear cache if force
        if(settings.force){
            wadRepo.delete(key); //async, no callback
        }
    
        var finish = function(){
            //build the response
            wadMaker.make(settings, function(err, js){
                //cache the result
                if(!settings.debug && !err)
                    wadRepo.set(key, js);
            
                //respond to the request
                callback(js);
            });
        };
        
        //look in the cache?
        var couldBeCached = !settings.force && !settings.debug;
        if(couldBeCached){
            wadRepo.get(settings.key, function(js){
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
    }
};

