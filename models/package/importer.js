
var request = require('require');
var _ = require('underscore');
var async = require('async');
var request = require('request');
var builder_selector = require('builder_selector');

module.exports = function(Package){
    
    var srcs = [
        {
            name: 'jquery',
            title: 'jQuery',
            description: 'The Write Less, Do More, JavaScript Library',
            website: 'http://jquery.com',
            src: "http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js",
            dependencies: []
        },
        {
            name: 'jquery-ui-theme-smoothness',
            title: 'jQuery UI Theme Smoothness',
            description: 'The smoothness theme for jQuery UI.',
            website: 'http://jqueryui.com',
            src: "http://code.jquery.com/ui/1.10.2/themes/smoothness/jquery-ui.css",
            dependencies: []
        },
        {
            name: 'jquery-ui',
            title: 'jQuery UI',
            description: 'jQuery UI is a curated set of user interface interactions, effects, widgets, and themes built on top of the jQuery JavaScript Library.',
            website: 'http://jqueryui.com',
            src: "http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.2/jquery-ui.min.js",
            dependencies: ['jquery', 'jquery-ui-theme-smoothness']
        },
        {
            name: 'adapt',
            title: 'adapt.js',
            description: 'Determines which CSS file to load before the browser renders a page.',
            website: 'http://adapt.960.gs',
            src: 'https://raw.github.com/nathansmith/adapt/master/assets/js/adapt.js',
            dependencies: []
        },
        {
            name: '960grid',
            title: '960 Grid',
            description: 'The 960 Grid System is an effort to streamline web development workflow by providing commonly used dimensions, based on a width of 960 pixels.',
            website: 'http://960.gs',
            src: 'http://cachedcommons.org/cache/960/0.0.0/stylesheets/960-min.css',
            dependencies: []
        },
        {
            name: '960text',
            title: '960 Grid - Text',
            description: 'The text.css stylesheet which is an optional part of 960 grid.',
            website: 'http://960.gs',
            src: 'http://raw.github.com/nathansmith/960-Grid-System/master/code/css/min/text.css',
            dependencies: []
        },
        {
            name: '960reset',
            title: '960 Grid - Reset',
            description: 'The goal of a reset stylesheet is to reduce browser inconsistencies in things like default line heights, margins and font sizes of headings, and so on.',
            website: 'http://meyerweb.com/eric/tools/css/reset',
            src: 'http://raw.github.com/nathansmith/960-Grid-System/master/code/css/min/reset.css',
            dependencies: []
        }, 
        {
            name: 'mustache',
            title: 'Mustache',
            description: 'Logic-less {{mustache}} templates with JavaScript',
            website: 'http://mustache.github.com',
            src: 'https://raw.github.com/janl/mustache.js/master/mustache.js',
            dependencies: []
        },
        {
            name: 'unsemantic-grid-responsive',
            title: 'Unsemantic Grid - Responsive',
            description: 'Mobile and Desktop breakpoints. Unsemantic is a fluid grid system that is the successor to the 960 Grid System. It works in a similar way, but instead of being a set number of columns, it\'s entirely based on percentages.',
            website: 'http://unsemantic.com',
            src: 'https://raw.github.com/nathansmith/unsemantic/master/assets/stylesheets/unsemantic-grid-responsive.css',
            dependencies: []            
        },
        {
            name: 'unsemantic-grid-responsive-tablet',
            title: 'Unsemantic Grid - Responsive, With Table',
            description: 'Mobile, Tablet, and Desktop breakpoints. Unsemantic is a fluid grid system that is the successor to the 960 Grid System. It works in a similar way, but instead of being a set number of columns, it\'s entirely based on percentages.',
            website: 'http://unsemantic.com',
            src: 'http://raw.github.com/nathansmith/unsemantic/master/assets/stylesheets/unsemantic-grid-responsive-tablet.css',
            dependencies: []            
        },
        {
            name: 'yui',
            title: 'YUI',
            description: 'The YUI seed file is an ultra-small bit of JavaScript that enables you to load any YUI component on your page.',
            website: 'http://yuilibrary.com',
            src: 'http://yui.yahooapis.com/3.9.0/build/yui/yui-min.js',
            dependencies: []            
        },
        {
            name: 'prototype',
            title: 'PrototypeJS',
            description: 'Prototype takes the complexity out of client-side web programming. Built to solve real-world problems, it adds useful extensions to the browser scripting environment and provides elegant APIs around the clumsy interfaces of Ajax and the Document Object Model.',
            website: 'http://prototypejs.org',
            src: 'https://ajax.googleapis.com/ajax/libs/prototype/1.7.1.0/prototype.js',
            dependencies: []            
        },
        {
            name: 'scriptaculous',
            title: 'script.aculo.us',
            description: 'script.aculo.us provides you with easy-to-use, cross-browser user interface JavaScript libraries to make your web sites and web applications fly.',
            website: 'http://script.aculo.us',
            src: 'https://ajax.googleapis.com/ajax/libs/scriptaculous/1.9.0/scriptaculous.js',
            dependencies: ['prototype']            
        },
        {
            name: 'mootools',
            title: 'MooTools',
            description: 'MooTools is a compact, modular, Object-Oriented JavaScript framework designed for the intermediate to advanced JavaScript developer. It allows you to write powerful, flexible, and cross-browser code with its elegant, well documented, and coherent API.',
            website: 'http://mootools.net',
            src: 'http://ajax.googleapis.com/ajax/libs/mootools/1.4.5/mootools-yui-compressed.js',
            dependencies: []            
        },
        {
            name: 'swfobject',
            title: 'SWFObject',
            description: 'SWFObject is an easy-to-use and standards-friendly method to embed Flash content, which utilizes one small JavaScript file.',
            website: 'http://code.google.com/p/swfobject',
            src: 'http://ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js',
            dependencies: []
        },
        {
            name: 'angular',
            title: 'AngularJS',
            description: 'AngularJS lets you extend HTML vocabulary for your application. The resulting environment is extraordinarily expressive, readable, and quick to develop.',
            website: 'http://angularjs.org',
            src: 'http://ajax.googleapis.com/ajax/libs/angularjs/1.0.5/angular.min.js',
            dependencies: []
        },
        {
            name: 'dojo',
            title: 'Dojo',
            description: 'Dojo saves you time and scales with your development process, using web standards as its platform. It’s the toolkit experienced developers turn to for building high quality desktop and mobile web applications.',
            website: 'http://dojotoolkit.org',
            src: 'http://ajax.googleapis.com/ajax/libs/dojo/1.8.3/dojo/dojo.js',
            dependencies: []            
        },
        {
            name: 'underscore',
            title: 'UnderscoreJS',
            description: 'Underscore is a utility-belt library for JavaScript that provides a lot of the functional programming support that you would expect in Prototype.js (or Ruby), but without extending any of the built-in JavaScript objects. It\'s the tie to go along with jQuery\'s tux, and Backbone.js\'s suspenders.',
            website: 'http://underscorejs.org',
            src: 'https://raw.github.com/documentcloud/underscore/master/underscore-min.js',
            dependencies: []            
        },
        {
            name: 'backbone',
            title: 'Backbone.js',
            description: 'Backbone.js gives structure to web applications by providing models with key-value binding and custom events, collections with a rich API of enumerable functions, views with declarative event handling, and connects it all to your existing API over a RESTful JSON interface.',
            website: 'http://backbonejs.org',
            src: 'http://backbonejs.org/backbone-min.js',
            dependencies: []            
        },
        {
            name: 'raphael',
            title: 'Raphaël',
            description: 'Raphaël is a small JavaScript library that should simplify your work with vector graphics on the web. If you want to create your own specific chart or image crop and rotate widget, for example, you can achieve it simply and easily with this library.',
            website: 'http://raphaeljs.com',
            src: 'https://raw.github.com/DmitryBaranovskiy/raphael/master/raphael-min.js',
            dependencies: []            
        },
        {
            name: 'datejs',
            title: 'Datejs',
            description: 'Datejs is an open-source JavaScript Date Library. Comprehensive, yet simple, stealthy and fast. Datejs has passed all trials and is ready to strike. Datejs doesn’t just parse strings, it slices them cleanly in two.',
            website: 'http://www.datejs.com',
            src: 'http://datejs.googlecode.com/files/date.js',
            dependencies: []            
        },
        {
            name: 'momentjs',
            title: 'MomentJS',
            description: 'A 5.5kb javascript date library for parsing, validating, manipulating, and formatting dates.',
            website: 'http://momentjs.com',
            src: 'https://raw.github.com/timrwood/moment/2.0.0/min/moment.min.js',
            dependencies: []            
        }
    ];
    
    var names = _.map(srcs, function(src){
        return src.name;
    });
    
    Package.find()
           .where('name')
           .in(names)
           .select('name')
           .exec(function(err, knownNames)
    {
        var unknownNames = _.difference(names, knownNames);
        var unknownSrcs = _.map(unknownNames, function(name){
            return _.find(srcs, function(src){
                return src.name == name;
            });
        });
        
        async.parallel(
            _.map(unknownSrcs, function(src){
                return function(callback){
                    var builder = builder_selector(src.src);
                    builder.build(function(result){
                        if(result.error){
                            callback(result.error);
                            return;
                        }
                        src.type = result.type;
                        src.code = result.js;
                        Package.create(src, function (err, p) {
                            callback(err);
                        })
                    });
                };
            })
        );
    });
    

};