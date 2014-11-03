var gulp       = require('gulp'),
    browserify = require('browserify'),
    watchify   = require('watchify'),
    reactify   = require('reactify'),
    source     = require('vinyl-source-stream'),
    print      = require('gulp-print'),
    concat     = require('gulp-concat'),
    less       = require('gulp-less'),
    clean      = require('gulp-clean'),
    nodemon    = require('gulp-nodemon'),
    argv       = require('yargs').argv;


var entryFile = './assets/js/app.js',

    scriptPaths = [
      './assets/js/**/*.js*'
    ],

    lessPaths = [
      './assets/less/*.less'
    ],

    htmlPaths = [
      './assets/*.html'
    ],

    staticPaths = [
      './assets/static/**/*'
    ];


gulp.task('scripts', function() {
  var bundle = browserify(watchify.args),
      watchedBundle = watchify(bundle);

  watchedBundle.add(entryFile);

  watchedBundle.on('update', function() {
    buildBundle(watchedBundle);
  });

  watchedBundle.on('log', function(message) {
    log('Bundle compiled - ' + message);
  });

  buildBundle(watchedBundle);
});

function buildBundle(watchedBundle) {
  watchedBundle.transform(reactify, {es6: true})
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./public/js'));
}

function log(message) {
  gulp.src('./').pipe(print(function() {
    return message;
  }));
}

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

gulp.task('static', function() {
  gulp.src(staticPaths)
    .pipe(gulp.dest('./public'));
});

gulp.task('clean', function() {
  gulp.src('./public', {read: false})
    .pipe(clean());
});

gulp.task('compile', ['scripts', 'less', 'html', 'static']);

gulp.task('watch', function(){
  gulp.watch(lessPaths, ['less']);
  gulp.watch(htmlPaths, ['html']);
});

gulp.task('server', function() {
  var options = {
    script: './server/server.js',
    watch: './server',
    env: {
      STREAM: argv.stream
    }
  };

  nodemon(options).on('restart', function(){
    log('Server restarted.');
  });
});

gulp.task('default', ['compile', 'watch', 'server']);
