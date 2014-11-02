var gulp       = require('gulp'),
    concat     = require('gulp-concat'),
    traceur    = require('gulp-traceur'),
    exclude    = require('gulp-ignore').exclude,
    less       = require('gulp-less'),
    react      = require('gulp-react'),
    clean      = require('gulp-clean'),
    nodemon    = require('gulp-nodemon'),
    argv       = require('yargs').argv;

var scriptPaths = [

      // this will release the floodgates and compile all old tweetbeat scripts
      // './src/js/**/*.js'

      './app/src/js/*.js'
    ],

    vendorScriptPaths = [
      './app/vendor/flux/dist/Flux.js',
      './app/vendor/react/react.js',
      './app/vendor/react/react-with-addons.js',
      './app/vendor/traceur-runtime/traceur-runtime.js'
    ],

    lessPaths = [

      // this will release the floodgates and compile all old tweetbeat styles
      // './src/less/**/*.less'

      './app/src/less/*.less'
    ],

    componentPaths = [
      './app/src/js/components/**/*.jsx'
    ],

    htmlPaths = [
      './app/src/*.html'
    ];


gulp.task('scripts', function() {
  gulp.src(scriptPaths)
    .pipe(traceur({blockBinding: true}))
    .pipe(concat('main.js'))
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

gulp.task('components', function() {
  gulp.src(componentPaths)

    // compile jsx with es6 syntax
    .pipe(react({harmony: true}))
    .pipe(concat('components.js'))
    .pipe(gulp.dest('./public/js'));
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

gulp.task('compile', ['scripts', 'vendor-scripts', 'less', 'components', 'html']);

gulp.task('watch', function(){
  gulp.watch(scriptPaths, ['scripts']);
  gulp.watch(lessPaths, ['less']);
  gulp.watch(componentPaths, ['components']);
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
