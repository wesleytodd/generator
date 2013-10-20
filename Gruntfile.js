module.exports = function(grunt) {

  // Generate file specific tasks for mochacov and watch
  // This enables quickly testing just the part of the
  // application you are working on.
  var testTargets = (function getTestTargets () {
    var targets = {
        mochacov: {},
        watch: {}
    };
    grunt.file.expand('test/*.js').forEach(function (file) {
      var key = require('path').basename(file, '.js')
      targets.mochacov[key] = {
        src: [file]
      };
      targets.watch[key] = {
        files: ['main.js', 'lib/*.js', file],
        tasks: ['mochacov:' + key],
      };
    });
    return targets;
  })();

	// Register composite tasks
	grunt.util._({
		'default': ['watch']
	}).map(function(task, name) {
		grunt.registerTask(name, task);
	});

	// Register npm tasks
	[
		'grunt-mocha-cov',
		'grunt-contrib-watch'
	].forEach(grunt.loadNpmTasks);

  // Set task configs
	grunt.initConfig({

    mochacov: grunt.util._.extend({
      options: {
        globals: ['width'],
        timeout: 100000,
        bail: false
      },
      all: {
        src: ['test/*.js']
      }
    }, testTargets.mochacov),

    watch: grunt.util._.extend({
      options: {
        atBegin: true
      },
      all: {
        files: ['main.js', 'lib/*.js', 'test/*.js'],
        tasks: ['mochacov'],
      }
    }, testTargets.watch)

  });

};
