'use strict';
var _ = require('underscore'),
    $ = require('jquery'),
    nunjucks = require('nunjucks'),
    Class = require('class.extend');

// Place needed items in the global name space
window._ = _;
window.jQuery = window.$ = $;
window.nunjucks = nunjucks;
window.Class = Class;
