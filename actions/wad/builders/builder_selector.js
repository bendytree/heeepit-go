
var builder_classes = [
    require('package_builder'),
    require('js_builder'),
    require('css_builder'),
    require('coffee_builder'),
    require('less_builder')
];

module.exports = function(lib){
    var builderClass = _.find(builder_classes, function(builder_class){
        return builder_class.supports(lib);
    });
    return new builderClass(lib, settings);
};
