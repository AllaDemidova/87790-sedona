"use strict";

module.exports = function (grunt) {
  var staticPagesPath = "src/pages/*.html";
  var stylesheetPath = "src/less/";

  require("load-grunt-tasks")(grunt);

  grunt.initConfig({
    less: {
      style: {
        files: {
          "build/css/style.css": stylesheetPath + "style.less"
        }
      }
    },

    postcss: {
      options: {
        processors: [
          require("autoprefixer")({
            browsers: [
              "last 1 version",
              "last 2 Chrome versions",
              "last 2 Firefox versions",
              "last 2 Opera versions",
              "last 2 Edge versions"
            ]
          }),
          require("css-mqpacker")({
            sort: true
          })
        ]
      },
      style: {
        src: "build/css/*.css"
      }
    },

    csso: {
      style: {
        options: {
          report: "gzip"
        },
        files: {
          "build/css/style.min.css": ["build/css/style.css"]
        }
      }
    },

    imagemin: {
      images: {
        options: {
          optimizationLevel: 3
        },
        files: [{
          expand: true,
          src: ["build/img/**/*.{png,jpg,gif}"]
        }]
      }
    },

    svgstore: {
      options: {
        svg: {
          style: "display: none"
        }
      },

      symbols: {
        files: {
          "build/img/symbols.svg": ["build/img/icons/*.svg"]
        }
      }
    },

    svgmin: {
      symbols: {
        files: [{
          expand: true,
          src: ["build/img/icons/*.svg"]
        }]
      }
    },

    browserSync: {
      server: {
        bsFiles: {
          src: [
            "build/*.html",
            "build/css/*.css"
          ]
        },
        options: {
          server: "build",
          watchTask: true,
          notify: false,
          open: true,
          ui: false
        }
      }
    },

    watch: {
      html: {
        files: [staticPagesPath],
        tasks: ["copy:html"],
        options: {
          spawn: false
        }
      },

      style:{
        files: [stylesheetPath + "**/*.less"],
        tasks: ["less", "postcss", "csso"],
        options: {
          spawn: false
        }
      }
    },

    copy: {
      fonts: {
        files: [{
          expand: true,
          src: [
            "src/fonts/**/*.{woff,woff2}"
          ],
          dest: "build/fonts",
          flatten: true
        }]
      },
      images: {
        files: [{
          expand: true,
          src: [
            "src/img/*.{jpg,svg}"
          ],
          dest: "build/img",
          flatten: true
        }]
      },
      icons: {
        files: [{
          expand: true,
          src: [
            "src/img/icons/*.svg"
          ],
          dest: "build/img/icons",
          flatten: true
        }]
      },
      html:{
        files: [{
          expand: true,
          src: staticPagesPath,
          dest: "build",
          flatten: true
        }]
      }
    },

    clean: {
      build: ["build"],
      options:{
        force: true
      }
    }
  });

  grunt.registerTask("serve", ["browserSync", "watch"]);
  grunt.registerTask("symbols", ["svgmin", "svgstore"]);
  grunt.registerTask("build", [
    "clean",
    "copy",
    "less",
    "postcss",
    "csso",
    "symbols",
    "imagemin"
  ])
};
