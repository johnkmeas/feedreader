module.exports = function(grunt) {

  // Project configuration.
grunt.initConfig({
  concat: {
    js: {
      src: ['jasmine/lib/jasmine-2.1.2/jasmine.js', 'jasmine/lib/jasmine-2.1.2/jasmine-html.js', 'jasmine/lib/jasmine-2.1.2/boot.js'],
      dest: 'dist/js1.concat.js',
    },
    js2: {
      src: ['js/app.js', 'jasmine/spec/feedreader.js'],
      dest: 'dist/js2.concat.js',
    },
    css: {
      src: ['css/normalize.css', 'css/iconmoon.css', 'css/style.css', 'jasmine/lib/jasmine-2.1.2/jasmine.css'],
      dest: 'dist/css.concat.css',
    },
  },
  uglify: {
      js1: {
        src: ['dist/js1.concat.js'],
        dest: 'dist/js1.min.js',
      },
      js2: {
        src: ['dist/js2.concat.js'],
        dest: 'dist/js2.min.js',
      },
  },
  cssmin: {
    css: {
      src: ['dist/css.concat.css'],
      dest: 'dist/css.min.css',
    },
  },
  watch: {
    js: {
      // js/**/*.js means any file ending in js and inside js folder
      files: ['js/**/*.js'],
      tasks: ['concat:js', 'uglify:js'],
    },
    css: {
      files: ['css/**/*.css'],
      tasks: ['concat:css', 'cssmin:css'],
    },
  },
});

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  // run grunt default
  grunt.registerTask('default', ['concat', 'uglify', 'cssmin', 'watch']);
};


// Concat
// npm install grunt-contrib-concat --save-dev
// grunt.loadNpmTasks('grunt-contrib-concat');

// Uglify
// npm install grunt-contrib-uglify --save-dev
// grunt.loadNpmTasks('grunt-contrib-uglify');

// cssmin
// npm install grunt-contrib-cssmin --save-dev
// grunt.loadNpmTasks('grunt-contrib-cssmin');

// watch
// npm install grunt-contrib-watch --save-dev
// grunt.loadNpmTasks('grunt-contrib-watch');
