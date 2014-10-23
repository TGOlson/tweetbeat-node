var gulp = require('gulp'),
    concat = require('gulp-concat'),
    traceur = require('gulp-traceur'),
    less = require('gulp-less'),
    clean = require('gulp-clean');

gulp.task('scripts', function() {
  gulp.src('./src/js/**/*.js')
    .pipe(traceur())
    .pipe(concat('main.js'))
    .pipe(gulp.dest('./public/js'));
});

gulp.task('less', function() {
  gulp.src('./src/less/**/*.less')
    .pipe(less())
    .pipe(concat('main.css'))
    .pipe(gulp.dest('./public/css'));
});

gulp.task('views', function() {
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

gulp.task('watch', function(){
  gulp.watch('./src/js/**/*.js', ['scripts']);
  gulp.watch('./src/less/**/*.html', ['less']);
  gulp.watch('./src/**/*.html', ['views']);
});


gulp.task('default', ['scripts', 'less', 'views']);


