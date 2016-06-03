'use strict';

var gulp = require('gulp'),
    bump = require('gulp-bump'),
    filter = require('gulp-filter'),
    tag_version = require('gulp-tag-version');
var jshint = require('gulp-jshint');
var mocha = require('gulp-spawn-mocha');
var coveralls = require('gulp-coveralls');
var plugins = require('gulp-load-plugins')();

var DEBUG = process.env.NODE_ENV === 'debug',
    CI = process.env.CI === 'true';

var paths = {
  tests: ['./test/**/*.js', '!test/{temp,temp/**}'],
  source: ['./lib/*.js', './bin/*']
};
paths.lint = paths.source.concat(paths.tests);
var plumberConf = {};

if (CI) {
  plumberConf.errorHandler = function(err) {
    throw err;
  };
}

gulp.task('lint', function () {
  return gulp.src(paths.lint)
    .pipe(jshint())
    .pipe(plugins.plumber(plumberConf))
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('istanbul', function () {
  return gulp.src(paths.tests, {read: false})
    .pipe(mocha({
      debugBrk: DEBUG,
      R: CI ? 'spec' : 'nyan',
      istanbul: !DEBUG
    }));
});

gulp.task('coveralls', ['istanbul'], function () {
  if (!process.env.CI) return;
  return gulp.src('./coverage/lcov.info')
    .pipe(coveralls());
});

gulp.task('bump', ['test'], function () {
  if (!CI)
    throw new Error('Bumping the version number is only allowed in continuous integration');

  var bumpType = 'minor'; // major or minor or patch

  return gulp.src(['./package.json'])
    .pipe(bump({ type: bumpType }))
    .pipe(gulp.dest('./'))
    .pipe(filter('package.json'))
    .pipe(tag_version());
});

gulp.task('test', ['lint', 'istanbul']);

gulp.task('release', ['bump', 'coveralls']);

gulp.task('default', ['test', 'coveralls']);
