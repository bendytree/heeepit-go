
var crypto = require('crypto');
var _ = require('underscore')._;
var helpers = require("./helpers");

module.exports = {
    parse: function(args){
        //remove empties
        args = _.filter(args, function(arg){ return arg; });
        
        //validate the query string
        if(!args || !args.length)
            return {error:"No args provided."};
        
        //sort libs and flags
        var libs = [];
        var flags = {};
        _.each(args, function(arg){
            //cleanup flags
            if(arg.indexOf("--") == 0)
            {
                //trim the --
                arg = arg.substring(2);
                
                //split at : if needed
                var firstColon = arg.indexOf(':');
                if(firstColon == -1){
                    flags[arg.toLowerCase()] = true;
                }else{
                    flags[arg.substring(0, firstColon).toLowerCase()] = arg.substring(firstColon+1);
                }
            }
            else
            {
                libs.push(arg);
            }
        });
        
        flags.force = !!flags.force;
        flags.loud = !!flags.loud;
        
        //get base url
        if(flags.base){
            flags.base = flags.base.replace(/https?:\/\//i, '');
            flags.base = 'http://'+flags.base.replace(/\/[^\/]*$/i, '')+'/';
        }
    
        //debug?
        if(flags.prod){
            flags.debug = false;
        }else if(flags.debug){
            flags.debug = true;
        }else{
            flags.debug = !!flags.base && !!helpers.isUrlLocal(flags.base);
        }
        
        //cleanup libs
        var isSpecificToBase = false;
        for(var i=0; i<libs.length; i++){
            var lib = libs[i];
            if(helpers.isLibName(lib)){
                //don't mess with lib names
            }else{
                //for urls, include full url if needed
                if(lib.indexOf("http") != 0){     
                    if(!flags.debug && !flags.base){
                        return {error:'Unable to resolve relative script url: '+lib};
                    }
                    isSpecificToBase = true;
                    libs[i] = flags.base.replace(/\/+$/, '') + "/" + lib.replace(/^\/*/, "");
                }
            }
        }
    
        //validate assets
        if(!libs.length){
            return {error:"At least one lib is required."};
        }
    
        //build the key
        var rawKey = '', key = '';
        if(!flags.debug){
            rawKey = [].concat(
                isSpecificToBase ? ["for:"+flags.base] : ["generic"],
                _.sortBy(libs, helpers.returnSelf),
                ['loud', flags.loud]
            ).join('|');
            key = "wad:"+crypto.createHash('md5').update(rawKey).digest("hex");
        }
        
        //build the settings object
        return {
            libs: libs,
            debug: flags.debug,
            force: flags.force,
            loud: flags.loud,
            key: key,
            
            testing: {
                rawKey: rawKey,
                flags: flags,
                isSpecificToBase: isSpecificToBase
            }
        };
    }
};
