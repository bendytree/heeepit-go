
var _ = require('underscore')._;

var managerClasses = [
    require('./package'),
    require('./js'),
    require('./css'),
    require('./coffee'),
    require('./less'),
    require('./error')
];

exports.select = function(lib, settings){
    var managerClass = _.find(managerClasses, function(c){
        return c.filter.test(lib);
    });
    return new managerClass(lib, settings);
};

