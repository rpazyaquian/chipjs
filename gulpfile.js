// using https://github.com/gulpjs/gulp/blob/master/docs/recipes/fast-browserify-builds-with-watchify.md
var gulp = require('gulp');

// browserify + watchify
var browserify = require('browserify');
var watchify = require('watchify');

// other stuff for watchify
var source = require('vinyl-source-stream');
var gutil = require('gulp-util');

// react
var reactify = require('reactify');



gulp.task('react-watch', function() {
  var bundler = watchify(browserify('./app/jsx/main.jsx', watchify.args)
    .transform(reactify));

  bundler.on('update', rebundle);

  function rebundle() {
    return bundler.bundle()
      // log errors if they happen
      .on('error', gutil.log.bind(gutil, 'Browserify Error'))
      .pipe(source('bundle.js'))
      .pipe(gulp.dest('./app/src'))
      .pipe(gulp.dest('./build/src'));
  }

  return rebundle();
});