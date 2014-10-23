var gulp = require('gulp'),
    concat = require('gulp-concat'),
    traceur = require('gulp-traceur'),
    exclude = require('gulp-ignore').exclude,
    less = require('gulp-less'),
    react = require('gulp-react'),
    clean = require('gulp-clean'),
    nodemon = require('gulp-nodemon');

gulp.task('scripts', function() {

  // this will release the floodgates and compile all old tweetbeat scripts
  // gulp.src('./src/js/**/*.js')

  gulp.src('./src/js/*.js')
    .pipe(traceur({blockBinding: true}))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('./public/js'));
});

var vendorScripts = [
  './src/vendor/react/react.js',
  './src/vendor/react/react-with-addons.js',
  './src/vendor/traceur-runtime/traceur-runtime.js'
];

gulp.task('vendor-scripts', function() {
  gulp.src(vendorScripts)
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('./public/js'));
});

gulp.task('less', function() {

  // this will release the floodgates and compile all old tweetbeat styles
  // gulp.src('./src/less/**/*.less')

  gulp.src('./src/less/*.less')
    .pipe(less())
    .pipe(concat('main.css'))
    .pipe(gulp.dest('./public/css'));
});

gulp.task('views', function() {
  gulp.src('./src/views/**/*.jsx')
    .pipe(react())
    .pipe(concat('views.js'))
    .pipe(gulp.dest('./public/js'));
});

gulp.task('html', function() {
  gulp.src('./src/**/*.html')
    .pipe(gulp.dest('./public'));
});

gulp.task('clean', function() {
  var compiledFiles = [
    './public/**/*.html',
    './public/js',
    './public/less',
  ];

  gulp.src(compiledFiles, {
    read: false
  }).pipe(clean());
});

gulp.task('compile', ['scripts', 'vendor-scripts', 'less', 'views', 'html']);

gulp.task('watch', function(){
  gulp.watch('./src/js/**/*.js', ['scripts']);
  gulp.watch('./src/less/**/*.html', ['less']);
  gulp.watch('./src/views/**/*.js', ['views']);
  gulp.watch('./src/**/*.html', ['html']);
});

gulp.task('server', function() {
  nodemon({script: './server/server.js'}).on('restart', function(){
    console.log('Server restarted.');
  });
});

gulp.task('server-stream', function() {
  nodemon({
    script: './server/server.js',
    env: {STREAM: true}
  }).on('restart', function(){
    console.log('Server restarted.');
  });
});

gulp.task('default', ['compile', 'watch', 'server']);
gulp.task('stream', ['compile', 'watch', 'server-stream']);


