module.exports = function(grunt) {
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  var paths = {
    libraryDir: 'assets',
    templateDir: 'app'
  };


  grunt.initConfig({
    creds: grunt.file.readJSON('server_creds.json'),
    paths: paths,



    //task config
    concat: {
      options: {
        separator: ';'
      },
      concathtml: {
        src: ["<%= paths.templateDir %>/index.html"],
        dest: "index.html"
      },
      concatjs: {
        src: ["<%= paths.libraryDir %>/js/*.js"],
        dest: "scripts.js"
      }
    },

    autoprefixer: {
      dist: {
        src: '<%= paths.libraryDir %>/css/styles.css',
        dest: '<%= paths.libraryDir %>/css/styles.css'
      }
    },

    less: {
     development: {
       options: {
         compress: false
       },
       files: {
         "<%= paths.libraryDir %>/css/main.css": [ "<%= paths.libraryDir %>/less/main.less"] // destination file and source file
       }
     },
     production: {
       options: {
         compress: false
       },
       files: {
         "<%= paths.libraryDir %>/css/main.css": [ "<%= paths.libraryDir %>/less/main.less"]
       }
     }
   },

    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: '<%= paths.libraryDir %>/css',
          src: ['*.css', '!*.min.css'],
          dest: '<%= paths.libraryDir %>/css',
          ext: '.min.css'
        }]
      }
    },

    watch: {
      options: {
        livereload: true
      },

      less: {
       files: ['<%= paths.libraryDir %>/less/**/*.less'], // which files to watch
       tasks: ['less', 'autoprefixer'],
       options: {
         nospawn: true
       }
      },

      css: {
        files: ['<%= paths.libraryDir %>/css/main.css'],
      },

      html: {
        files: ['index.html']
      },

      js: {
        files: ['<%= paths.libraryDir %>/js/**/*.js', '!<%= paths.libraryDir %>/js/scripts.concat.js'],
        tasks: ['concat']
      }
    },

    connect: {
      server: {
        options: {
          hostname :''
        }
      }
    },

    rsync: {
      options: {
         src: "./",
         args: ["--verbose"],
         exclude: ['.git*', 'node_modules', '.sass-cache', 'Gruntfile.js', 'package.json', '.DS_Store', 'README.md', 'server_creds.json'],
         recursive: true,
         syncDestIgnoreExcl: true
      },
      staging: {
         options: {
             dest: "<%= creds.path.staging %>",
             host: "<%= creds.user %>@<%= creds.ip %>"
         }
      },
      prod: {
         options: {
             dest: "<%= creds.path.prod %>",
             host: "<%= creds.user %>@<%= creds.ip %>"
         }
      }
      }
  });

grunt.registerTask('build', ['concat', 'less', 'autoprefixer', 'cssmin']);

grunt.registerTask('default', ['build', 'connect', 'watch']);

};
