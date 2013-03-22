
module.exports = {
    order: function(items, idSelector, edgeIdSelector){
        if(!items)
            return [];
        
        var resolvedItems = [];
        var resolvedIds = [];
        var seenIds = [];
        
        var itemsWithNoId = $.filter(items, function(i){
            return !idSelector(i);
        });
        items = $.filter(items, function(i){
            return !!idSelector(i);
        });
        
        var resolve = function(item){
            var itemId = idSelector(item);
            seenIds.append(itemId);
           
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
        resolve(items[0]);
        
        //return the ordered items (no ids go last)
        return items.concat(itemsWithNoId);
    }
}