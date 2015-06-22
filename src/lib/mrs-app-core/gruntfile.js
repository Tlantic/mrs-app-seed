'use strict';

/*
  Date: 08/16/2013 
  Author: Vinicius Linck <viniciusl@tlantic.com.br>

    Description:    File for build based on Grunt package over NodeJS platform.
 */

module.exports = function (grunt) {

    // loading project properties
    var project = grunt.file.readJSON('config/build.conf.json');


    // Project Configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),               // loading dependencies

        // cleaning last build
        clean: {
            options: {
                force: true,
                "no-write": false
            },
            dist: ["dist", "reports", "docs"],
            min: "dist/minified.js"
        },

        // copy minified file
        copy: {
            min: {
                src:  "dist/minified.js",
                dest: "dist/" + project.minifiedDeployFile
            }
        },

        // JS validator
        jshint: {
            source: ["src/*.js"],
            options: {
                force: false
            } 
        },

        jslint: {
            client: {
                src: ['src/*.js'],
                directives: {
                    browser: true,
                    predef: ['angular']
                },
                options: {
                    junit: 'reports/client-junit.xml'
                }
            }
        },

        // running automated tests
        karma: {
            unit: {
                client: {
                    args: ['args']
                },
                configFile: "config/karma.conf.js"
            }
        },

        rename: {
            coverage: {
                files: [
                    {
                        src: ['reports/coverage/Phantom*/'],
                        dest: 'reports/coverage/PhantomJS/'
                    }
                ]
            }
        },

        // documentation
        yuidoc: {
            compile: {
                name: '<%= pkg.name %>',
                description: '<%= pkg.description %>',
                version: '<%= pkg.version %>',
                url: '<%= pkg.homepage %>',
                options: {
                    paths: ["src"],
                    outdir: "docs"
                }
            }
        },

        // concat
        concat: {
            options: {
                stripBanners: {
                    block: true,
                    line: true
                },
                process: true,
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd HH:MM:ss Z") %> */\n'
            },
            dist: {
                src: ['src/kernel.js', 'src/kernel/**/*.js', 'src/core.js', 'src/core/**/*.js'],
                dest: 'dist/' + project.moduleDeployFile
            }
        },

        // minify
        uglify: {
            options: {
                mangle: project.obfuscate,
                sourceMap: project.obfuscate,
                sourceMapName: 'dist/' + project.mapDeployFile,
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd HH:MM:ss Z") %> */'
            },
            dist: {
                files: {
                    'dist/minified.js' : ['dist/' + project.moduleDeployFile]
                }
            }
        }


    });


    // loading node dependencies
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jslint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-yuidoc');
    grunt.loadNpmTasks('grunt-contrib-rename');


    // tests
    grunt.registerTask('test', ['karma', 'rename:coverage']);

    // run ALL targets
    grunt.registerTask('all', ['clean', 'jshint', 'jslint', 'test', 'yuidoc', 'concat', 'uglify', 'copy:min', 'clean:min']); //distribute

    // Default task(s).
    grunt.registerTask('default', ['all']);
};

