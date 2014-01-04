'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

	// Load grunt tasks automatically
	require('load-grunt-tasks')(grunt);

	// Time how long tasks take. Can help when optimizing build times
	require('time-grunt')(grunt);

	// Define the configuration for all the tasks
	grunt.initConfig({

		// Project settings
		yeoman: {
			// configurable paths
			name: require('./bower.json').name + 'App',
			app: require('./bower.json').appPath || 'app',
			dist: 'public'
		},
		express: {
			options: {
				port: process.env.PORT || 9000
			},
			dev: {
				options: {
					script: 'server.js'
				}
			},
			prod: {
				options: {
					script: 'server.js',
					node_env: 'production'
				}
			}
		},
		watch: {
			js: {
				files: ['{.tmp,<%= yeoman.app %>}/scripts/{,*/}*.js'],
				tasks: ['newer:jshint:all']
			},
			jsTest: {
				files: ['test/spec/{,*/}*.js'],
				tasks: ['newer:jshint:test', 'karma']
			},
			compass: {
				files: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
				tasks: ['compass:server', 'autoprefixer']
			},
			livereload: {
				files: [
					'<%= yeoman.app %>/{,*//*}*.html',
					'{.tmp,<%= yeoman.app %>}/styles/{,*//*}*.css',
					'{.tmp,<%= yeoman.app %>}/scripts/{,*//*}*.js',
					'<%= yeoman.app %>/images/{,*//*}*.{png,jpg,jpeg,gif,webp,svg}',
				],
				options: {
					livereload: true
				}
			},
			express: {
				files: [
					'server.js',
					'lib/{,*//*}*.{js,json}'
				],
				tasks: ['express:dev'],
				options: {
					livereload: true,
					nospawn: true //Without this option specified express won't be reloaded
				}
			},
			styles: {
				files: ['<%= yeoman.app %>/styles/{,*/}*.css'],
				tasks: ['newer:copy:styles', 'autoprefixer']
			},
			gruntfile: {
				files: ['Gruntfile.js']
			}
		},

		// Make sure code styles are up to par and there are no obvious mistakes
		jshint: {
			options: {
				jshintrc: '.jshintrc',
				reporter: require('jshint-stylish')
			},
			all: [
				'<%= yeoman.app %>/scripts/{,*/}*.js'
			],
			test: {
				options: {
					jshintrc: 'test/.jshintrc'
				},
				src: ['test/spec/{,*/}*.js']
			}
		},

		// Empties folders to start fresh
		clean: {
			dist: {
				files: [{
					dot: true,
					src: [
						'.tmp',
						'<%= yeoman.dist %>/*',
						'!<%= yeoman.dist %>/.git*'
					]
				}]
			},
			heroku: {
				files: [{
					dot: true,
					src: [
						'heroku/*',
						'!heroku/.git*',
						'!heroku/Procfile'
					]
				}]
			},
			server: '.tmp'
		},

		// Reads HTML for usemin blocks to enable smart builds that automatically
		// concat, minify and revision files. Creates configurations in memory so
		// additional tasks can operate on them
		useminPrepare: {
			html: ['<%= yeoman.app %>/index.html'],
			options: {
				dest: '<%= yeoman.dist %>'
			}
		},

		// Run some tasks in parallel to speed up the build process
		concurrent: {
			server: [
				'compass:server',
				'copy:styles'
			],
			test: [
				'compass',
				'copy:styles'
			],
			dist: [
				'compass:dist',
				'copy:styles',
				'imagemin',
				'svgmin',
				'htmlmin'
			]
		},

		// Compiles Sass to CSS and generates necessary files if requested
		compass: {
			options: {
				sassDir: '<%= yeoman.app %>/styles',
				cssDir: '.tmp/styles',
				generatedImagesDir: '.tmp/images/generated',
				imagesDir: '<%= yeoman.app %>/images',
				javascriptsDir: '<%= yeoman.app %>/scripts',
				fontsDir: '<%= yeoman.app %>/styles/fonts',
				importPath: '<%= yeoman.app %>/bower_components',
				httpImagesPath: '/images',
				httpGeneratedImagesPath: '/images/generated',
				httpFontsPath: '/styles/fonts',
				relativeAssets: false,
				assetCacheBuster: false
			},
			dist: {
				options: {
					generatedImagesDir: '<%= yeoman.dist %>/images/generated'
				}
			},
			server: {
				options: {
					debugInfo: true
				}
			}
		},

		// Copies remaining files to places other tasks can use
		copy: {
			dist: {
				files: [{
					expand: true,
					dot: true,
					cwd: '<%= yeoman.app %>',
					dest: '<%= yeoman.dist %>',
					src: [
						'*.{ico,png,txt,js}',
						'.htaccess',
						'images/{,*/}*.{webp}',
						'styles/fonts/*',
						'fonts/*'
					]
				}, {
					expand: true,
					cwd: '.tmp/images',
					dest: '<%= yeoman.dist %>/images',
					src: [
						'generated/*'
					]
				}]
			},
			heroku: {
				files: [{
					expand: true,
					dot: true,
					dest: 'heroku',
					src: [
						'<%= yeoman.dist %>/**'
					]
				}, {
					expand: true,
					dest: 'heroku',
					src: [
						'package.json',
						'server.js',
						'lib/**/*'
					]
				}]
			},
			styles: {
				expand: true,
				cwd: '<%= yeoman.app %>/styles',
				dest: '.tmp/styles/',
				src: '{,*/}*.css'
			}
		},

		// The following *-min tasks produce minified files in the dist folder
		imagemin: {
			options: {
				force: true
			},
			dist: {
				files: [{
					expand: true,
					cwd: '<%= yeoman.app %>/images',
					src: '{,*/}*.{png,jpg,jpeg,gif}',
					dest: '<%= yeoman.dist %>/images'
				}]
			}
		},
		svgmin: {
			options: {
				force: true
			},
			dist: {
				files: [{
					expand: true,
					cwd: '<%= yeoman.app %>/images',
					src: '{,*/}*.svg',
					dest: '<%= yeoman.dist %>/images'
				}]
			}
		},
		htmlmin: {
			dist: {
				options: {
					// Optional configurations that you can uncomment to use
					// removeCommentsFromCDATA: true,
					// collapseBooleanAttributes: true,
					// removeAttributeQuotes: true,
					// removeRedundantAttributes: true,
					// useShortDoctype: true,
					// removeEmptyAttributes: true,
					// removeOptionalTags: true*/
				},
				files: [{
					expand: true,
					cwd: '<%= yeoman.app %>',
					src: ['*.html'],
					dest: '<%= yeoman.dist %>'
				}]
			}
		},

		ngtemplates: {
			dist: {
				src: '<%= yeoman.app %>/views/**/*.html',
				dest: '.tmp/scripts/templateCache.js',
				options: {
					base: '<%= yeoman.app %>',
					concat: '<%= yeoman.dist %>/scripts/scripts.js',
					module: '<%= yeoman.name %>',
					url:    function(url) { return url.replace('app/', ''); }
				}
			}
		},

		// Add vendor prefixed styles
		autoprefixer: {
			options: {
				browsers: ['last 1 version']
			},
			dist: {
				files: [{
					expand: true,
					cwd: '.tmp/styles/',
					src: '{,*/}*.css',
					dest: '.tmp/styles/'
				}]
			}
		},

		// Replace Google CDN references
		cdnify: {
			dist: {
				html: ['<%= yeoman.dist %>/*.html']
			}
		},

		// Allow the use of non-minsafe AngularJS files. Automatically makes it
		// minsafe compatible so Uglify does not destroy the ng references
		ngmin: {
			dist: {
				files: [{
					expand: true,
					cwd: '<%= yeoman.dist %>/scripts',
					src: '*.js',
					dest: '<%= yeoman.dist %>/scripts'
				}]
			}
		},
		cssmin: {
			dist: {
				files: {
					'<%= yeoman.dist %>/styles/inline.css': [
						'.tmp/styles/inline.css',
						'<%= yeoman.app %>/styles/inline.css'
					]
				}
			}
		},
		uglify: {
			dist: {
				files: {
					'<%= yeoman.dist %>/scripts/scripts.js': [
						'<%= yeoman.dist %>/scripts/scripts.js'
					]
				}
			},
			options: {
				mangle: false
			}
		},

		// Renames files for browser caching purposes
		rev: {
			dist: {
				files: {
					src: [
						'<%= yeoman.dist %>/scripts/{,*/}*.js',
						'<%= yeoman.dist %>/styles/main.css',
						'<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
						'<%= yeoman.dist %>/styles/fonts/*'
					]
				}
			}
		},

		// Performs rewrites based on rev and the useminPrepare configuration
		usemin: {
			html: ['<%= yeoman.dist %>/{,*/}*.html'],
			css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
			options: {
				dirs: ['<%= yeoman.dist %>']
			}
		},
		inline: {
			dist: {
				src: [ '<%= yeoman.dist %>/index.html', '<%= yeoman.dist %>/redirect.html' ]
			},
		},
		karma: {
			unit: {
				configFile: 'karma.conf.js',
				singleRun: true
			}
		}
	});

	grunt.registerTask('express-keepalive', 'Keep grunt running', function() {
		this.async();
	});

	grunt.registerTask('serve', function (target) {
		if (target === 'dist') {
			return grunt.task.run([
				'build',
				'express:prod',
				'express-keepalive'
			]);
		}

		grunt.task.run([
			'clean:server',
			'concurrent:server',
			'autoprefixer',
			'express:dev',
			'watch'
		]);
	});

	grunt.registerTask('test', [
		'clean:server',
		'concurrent:test',
		'autoprefixer',
		'karma'
	]);

	grunt.registerTask('build', [
		'clean:dist',
		'useminPrepare',
		'concurrent:dist',
		'ngtemplates:dist',
		'autoprefixer',
		'concat',
		'copy:dist',
		'cdnify',
		'ngmin',
		'cssmin',
		'uglify',
		'rev',
		'usemin',
		'inline'
	]);

	grunt.registerTask('heroku', [
		'build',
		'clean:heroku',
		'copy:heroku'
	]);

	grunt.registerTask('default', [
		'newer:jshint',
		'test',
		'build'
	]);
};
