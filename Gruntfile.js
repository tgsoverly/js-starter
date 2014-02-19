var barename = "library"
var namespace = "MyLibrary"

module.exports = function(grunt) {
  grunt.loadNpmTasks("grunt-es6-module-transpiler");
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.initConfig({
    clean: {
      build: ["dist", "tmp"],
      bower: ["bower_components"]
    },
    bower: {
      install: {
        options: {
          targetDir: "vendor"
          //just run 'grunt bower:install' and you'll see files from your Bower packages in lib directory
        }
      }
    },
    qunit: {
      all: ['tests/*.html']
    },
    transpile: {
      amd: {
        type: 'amd',
        files: [{
          expand: true,
          cwd: 'src/',
          src: ['**/*.js'],
          dest: 'tmp/',
          ext: '.amd.js'
        }]
      },

      commonjs: {
        type: 'cjs',
        files: [{
          expand: true,
          cwd: 'src/',
          src: ['lib/*.js'],
          dest: 'dist/commonjs/',
          ext: '.js'
        },
        {
          src: ['src/'+barename+'.js'],
          dest: 'dist/commonjs/main.js'
        }]
      }
    },
    concat: {
      amd: {
        src: "tmp/**/*.amd.js",
        dest: "dist/"+barename+".amd.js"
      },
    },
    browser: {
      dist: {
        src: ["vendor/loader/loader.js", "dist/"+barename+".amd.js"],
        dest: "dist/"+barename+".js",
        options: {
          barename: barename,
          namespace: namespace
        }
      }
    }
  });

  grunt.registerMultiTask('browser', "Export a module to the window", function() {
    var opts = this.options();
    this.files.forEach(function(f) {
      var output = ["(function(globals) {"];

      output.push.apply(output, f.src.map(grunt.file.read));

      output.push(grunt.template.process(
        'window.<%= namespace %> = requireModule("<%= barename %>");', { 
        data: {
          namespace: opts.namespace,
          barename: opts.barename
        }
      }));
      output.push('})(window);');

      grunt.file.write(f.dest, grunt.template.process(output.join("\n")));
    });
  });

  grunt.registerTask("default", ["clean", "transpile", "concat:amd", "browser"]);
  grunt.registerTask("build", ["default"]);
  grunt.registerTask("test", ["build", "qunit"]);
}
