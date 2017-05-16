'use strict';

var $ = require('jquery'),
    Class = require('class.extend');

module.exports = Class.extend({

   sayHello: function() {
      console.log('Hello!');  // eslint-disable-line no-console
      $('.app').append($('<h1>Hello</h1>'));
   },

});
