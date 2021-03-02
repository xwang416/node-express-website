var path = require('path');

module.exports = function(grunt) {

    // Initialize configuration object
    grunt.initConfig({

        // Define configuration for each task
        less: {
            development: {
                options: {
                    compress: false // not Minification
                },
                files: {
                    "./public/css/style.min.css": ["./assets/less/style.less"]
                }
            },
            production: {
                options: {
                    compress: true // not Minification
                },
                files: {
                    "./public/css/style.min.css": ["./assets/less/style.less"]
                }
            }
        },

        autoprefixer: {
            options: {
                browsers: ['> 0.1%', 'ff > 20', 'ie > 9', 'Safari > 8', 'iOS_saf > 7', 'Chrome > 20', 'Opera > 15']
            },
            production: {
                // Target-specific file lists and/or options go here.
                files: {
                    "./public/css/style.min.css": "./public/css/style.min.css"
                }
            },
        },

        imagemin: {
            dynamic: {
                files: [{
                    expand: true,
                    // Compresses all png / jpg / gif images
                    cwd: './assets/images/',
                    src: ['*.{png,jpg}', 'favicon.ico'],
                    dest: './public/assets/images/'
                }]
            }
        },

        copy: {
            main: {
              files: [
                // includes files within path
                {expand: true, flatten: true, src: ['./assets/images/*.gif', './assets/images/*.svg'], dest: 'public/assets/images/', filter: 'isFile'}
              ],
            },
            all: {
              files: [
                // includes files within path
                {expand: true, flatten: true, src: ['./node_modules/bootstrap/dist/css/bootstrap.min.css'], dest: 'public/css/', filter: 'isFile'},
                {expand: true, flatten: true, src: ['./assets/fonts/*'], dest: 'public/fonts/', filter: 'isFile'},
                {expand: true, flatten: true, src: ['./assets/images/*.gif', './assets/images/*.svg'], dest: 'public/assets/images/', filter: 'isFile'},
              ],
            },
        },

        compress: {
            main: {
                options: {
                    archive: 'artifact.tgz'
                },
                files: [{
                    expand: true,
                    cwd: '',
                    src: ['**/*','!node_modules/**','!assets/**','!Gruntfile.js', '!*.tgz', '!*.zip'],
                    dest: '/'
                }]
            }
        },

        webpack: {
            myconfig: {
                mode: 'none',
                entry: {
                    main: "./assets/js/index.js"
                },
                output: {
                    path: path.join(__dirname, "public/js"),
                    filename: "[name].bundle.js"
                },
                optimization: {
                    minimize: true
                },
                module: {
                    rules: [
                      {
                        test: /\.m?js$/,
                        exclude: /(node_modules|bower_components)/,
                        use: {
                          loader: 'babel-loader',
                          options: {
                            presets: ["@babel/preset-env"]
                          }
                        }
                      }
                    ]
                }
                  
            },
        },

        jshint: {
            all: ['Gruntfile.js', 'assets/**/*.js'],
            options: {
                esversion: 6,
                browser: true,
                node: true
            }
        },

        watch: {
            js_script: {
                files: [
                    // Watched files
                    './assets/js/*.js',
                ],
                tasks: ['webpack:myconfig'],
                options: {
                    livereload: true
                }
            },
            less: {
                // Watched files
                files: ['./assets/less/*.less'],
                tasks: ['less:development'],
                options: {
                    livereload: true
                }
            },
            images: {
                // Watched files
                files: ['./assets/images/**/*.{png,jpg}'],
                tasks: ['imagemin'],
                options: {
                    livereload: true
                }
            },
            html: {
                // Watch doc for changes
                files: ['**/*.html', './assets/images/**/*.gif', './assets/images/**/*.svg'],
                tasks: ['copy:main'],
                options: {
                    livereload: true
                }
            }
        }
    });

    // Load plugins
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-webpack');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    // Set default task - for development
    grunt.registerTask('default', ['watch']);
    grunt.registerTask('zip', ['compress']);

    // Prepare for deployment
    grunt.registerTask('build', ['webpack:myconfig', 'less:production', 'autoprefixer', 'imagemin', 'copy:all', 'compress']);

};