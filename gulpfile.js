var gulp       = require('gulp'),
    browserify = require('browserify'),
    reactify   = require('reactify'),
    source     = require('vinyl-source-stream'),
    concat     = require('gulp-concat'),
    exclude    = require('gulp-ignore').exclude,
    less       = require('gulp-less'),
    clean      = require('gulp-clean'),
    nodemon    = require('gulp-nodemon'),
    argv       = require('yargs').argv;


var entryFile = './app/src/js/app.js',

    scriptPaths = [
      './app/src/js/**/*.js'
    ],

    // vendor files need to be manually added to this list
    // note: each vendor file should include a corresponding .min.js file
    vendorScriptPaths = [
      './app/vendor/flux/dist/Flux.js',
      './app/vendor/lodash/dist/lodash.js',
      './app/vendor/react/react.js',
      './app/vendor/react/react-with-addons.js'
    ],

    lessPaths = [

      // this will release the floodgates and compile all old tweetbeat styles
      // './src/less/**/*.less'

      './app/src/less/*.less'
    ],

    htmlPaths = [
      './app/src/*.html'
    ];


gulp.task('scripts', function() {
  browserify(entryFile, {debug: true})
    .transform(reactify, {es6: true})
    .bundle()
    .pipe(source('main.js'))
    .pipe(gulp.dest('./public/js'));
});

gulp.task('vendor-scripts', function() {
  gulp.src(vendorScriptPaths)
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('./public/js'));
});

gulp.task('less', function() {
  gulp.src(lessPaths)
    .pipe(less())
    .pipe(concat('main.css'))
    .pipe(gulp.dest('./public/css'));
});

gulp.task('html', function() {
  gulp.src(htmlPaths)
    .pipe(gulp.dest('./public'));
});

gulp.task('clean', function() {
  var compiledFiles = [
    './public/**/*.html',
    './public/js',
    './public/css',
  ];

  gulp.src(compiledFiles, {read: false})
    .pipe(clean());
});

gulp.task('compile', ['scripts', 'vendor-scripts', 'less', 'html']);

gulp.task('watch', function(){
  gulp.watch(scriptPaths, ['scripts']);
  gulp.watch(lessPaths, ['less']);
  gulp.watch(htmlPaths, ['html']);
});

gulp.task('server', function() {
  var options = {
    script: './server/server.js'
  };

  if(argv.stream) {
    options.env = {STREAM: true};
  }

  nodemon(options).on('restart', function(){
    console.log('Server restarted.');
  });
});

gulp.task('default', ['compile', 'watch', 'server']);
