'use strict';

module.exports = function(grunt) {

   var DEBUG = grunt.option('debug');

   grunt.initConfig({

      pkg: grunt.file.readJSON('package.json'),

      project: {
         src: {
            base: 'src',
            js: {
               base: '<%= project.src.base %>/js',
               main: '<%= project.src.js.base %>/main.js',
               thirdparty: [
                  '<%= project.src.js.base %>/thirdparty.js',
                  'node_modules/semantic-ui-css/semantic.js',
               ],
            },
            markup: {
               base: '<%= project.src.base %>/markup',
               templates: [ '<%= project.src.base %>/markup/**/*.html', '!<%= project.src.base %>/markup/index.html' ],
            },
            sass: {
               base: '<%= project.src.base %>/sass',
               main: '<%= project.src.sass.base %>/main.scss',
            },
            css: {
               thirdparty: 'node_modules/semantic-ui-css/semantic.css',
            },
         },
         dist: {
            base: 'dist',
            css: {
               base: '<%= project.dist.base %>/css',
               main: '<%= project.dist.css.base %>/main.css',
               thirdparty: '<%= project.dist.css.base %>/thirdparty.css',
            },
            js: {
               base: '<%= project.dist.base %>/js',
               main: '<%= project.dist.js.base %>/main.js',
               thirdparty: '<%= project.dist.js.base %>/thirdparty.js',
               templates: '<%= project.dist.js.base %>/templates.js',
            },
         },
      },

      browserify: {
         build: {
            files: { '<%= project.dist.js.main %>': [ '<%= project.src.js.main %>' ] },
            options: {
               external: [
                  'class.extend',
                  'jquery',
                  'underscore',
               ],
            },
         },
         thirdparty: {
            files: { '<%= project.dist.js.thirdparty %>': [ '<%= project.src.js.thirdparty %>' ] },
            options: {
               require: [
                  'class.extend',
                  'jquery',
                  'underscore',
               ],
            },
         },
      },

      uglify: {
         options: {
            banner: '/*! Built: <%= grunt.template.today("yyyy-mm-dd") %> */\n',
            sourceMap: DEBUG,
            sourceMapIncludeSources: DEBUG,
            mangle: !DEBUG,
            compress: !DEBUG,
            beautify: DEBUG,
         },
         build: {
            files: { '<%= project.dist.js.main %>': '<%= project.dist.js.main %>' },
         },
         thirdparty: {
            files: { '<%= project.dist.js.thirdparty %>': '<%= project.dist.js.thirdparty %>' },
         },
      },

      nunjucks: {
         build: {
            baseDir: '<%= project.src.markup.base %>/',
            src: '<%= project.src.markup.templates %>',
            dest: '<%= project.dist.js.templates %>',
            options: {
               name: function(filename) {
                  return filename.replace(/^templates\//, '');
               },
            },
         },
      },

      sass: {
         options: {
            sourceMap: DEBUG,
         },

         build: {
            files: { '<%= project.dist.css.main %>': '<%= project.src.sass.main %>' },
         },
      },

      cssmin: {
         options: {
            shorthandCompacting: false,
            roundingPrecision: -1,
         },
         build: {
            files: { '<%= project.dist.css.thirdparty %>': '<%= project.src.css.thirdparty %>' },
         },
      },

      copy: {
         markup: {
            files: [
               { expand: true, cwd: '<%= project.src.markup.base %>', src: 'index.html', dest: '<%= project.dist.base %>' },
            ],
         },
      },

      eslint: {
         target: [ 'Gruntfile.js', 'src/**/*.js', 'tests/**/*.js' ],
      },

   });

   grunt.loadNpmTasks('grunt-browserify');
   grunt.loadNpmTasks('grunt-contrib-copy');
   grunt.loadNpmTasks('grunt-contrib-cssmin');
   grunt.loadNpmTasks('grunt-contrib-uglify');
   grunt.loadNpmTasks('grunt-nunjucks');
   grunt.loadNpmTasks('grunt-sass');
   grunt.loadNpmTasks('grunt-eslint');

   grunt.registerTask('standards', [ 'eslint' ]);
   grunt.registerTask('build', [
      'copy:markup',
      'sass:build',
      'cssmin:build',
      'browserify:build',
      'uglify:build',
      'browserify:thirdparty',
      'uglify:thirdparty',
      'nunjucks:build',
   ]);

   grunt.registerTask('default', [ 'standards', 'build' ]);

};
