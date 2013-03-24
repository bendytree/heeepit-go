
var builder_classes = [
    require('package'),
    require('js'),
    require('css'),
    require('coffee'),
    require('less')
];

module.exports = {
    select: function(lib){
        var builderClass = _.find(builder_classes, function(c){
            return c.supports(lib);
        });
        return new builderClass(lib, settings);
    }
};
