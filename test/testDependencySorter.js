
var assert = require("assert");
var _ = require("underscore")._;
var sorter = require("../heeeps/maker/dependencySorter");

var sort = function(items){
    return sorter(items, function(item){return item.id;}, function(item){return item.edges;});
};

describe('sorter', function(){
  
  it('should return empty array for blank array', function(){
      var items = sort([]);
      assert.equal(items.length, 0);
  });
  
  it('should leave the order intact if no edges', function(){
      var items = sort([
          {id:'c',edges:[]},
          {id:'a',edges:[]},
          {id:'b',edges:[]}
      ]);
      var results = _.map(items, function(i){ return i.id; }).join('');
      assert.equal(results, 'cab');
  });
  
  it('should order by deep dependencies', function(){
      var items = sort([
          {id:'c',edges:['a']},
          {id:'a',edges:['b']},
          {id:'b',edges:[]}
      ]);
      var results = _.map(items, function(i){ return i.id; }).join('');
      assert.equal(results, 'bac');
  });
  
  it('should order by split dependencies', function(){
      var items = sort([
          {id:'d',edges:['c']},
          {id:'c',edges:[]},
          {id:'b',edges:['a']},
          {id:'a',edges:[]}
      ]);
      var results = _.map(items, function(i){ return i.id; }).join('');
      assert.equal(results, 'cdab');
  });
  
  it('should leave the order intact if no ids', function(){
      var items = sort([
          {id:null,name:'c',edges:[]},
          {id:null,name:'a',edges:[]},
          {id:null,name:'b',edges:[]}
      ]);
      var results = _.map(items, function(i){ return i.name; }).join('');
      assert.equal(results, 'cab');
  });
  
  it('should place id-less after id-full', function(){
      var items = sort([
          {id:'a',name:'a',edges:[]},
          {id:null,name:'b',edges:[]},
          {id:'c',name:'c',edges:[]},
          {id:null,name:'d',edges:[]}
      ]);
      var results = _.map(items, function(i){ return i.name; }).join('');
      assert.equal(results, 'acbd');
  });
  
});
