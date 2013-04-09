
var _ = require("underscore")._;

module.exports = function(items, idSelector, edgeIdSelector){
    if(!items)
        return [];
    
    var resolvedItems = [];
    var resolvedIds = [];
    var seenIds = [];
    
    var itemsWithNoId = _.filter(items, function(i){
        return !idSelector(i);
    });
    items = _.filter(items, function(i){
        return !!idSelector(i);
    });
    
    var resolve = function(item){
        items.splice(items.indexOf(item), 1);
        
        var itemId = idSelector(item);
        seenIds.push(itemId);
       
        var edgeIds = edgeIdSelector(item);
        for(var i=0; i<edgeIds.length; i++){
            var edgeId = edgeIds[i];
            if(_.contains(resolvedIds, edgeId))
                continue;
            if(_.contains(seenIds, edgeId))
                throw ('Circular reference detected: ' + edgeId + ' and ' + itemId);
                
            var edgeItem = _.find(items, function(i){return idSelector(i) == edgeId;});
            resolve(edgeItem);
        }
        resolvedItems.push(item);
        resolvedIds.push(itemId);
    };
    
    //kick it off
    while(items.length > 0)
        resolve(items[0]);
    
    //return the ordered items (no ids go last)
    return resolvedItems.concat(itemsWithNoId);
};