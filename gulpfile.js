'use strict';

var gulp = require('gulp'),
    git = require('gulp-git'),
    version = require('./gulp-next-version');
var jshint = require('gulp-jshint');
var mocha = require('gulp-spawn-mocha');
var coveralls = require('gulp-coveralls');
var plugins = require('gulp-load-plugins')();

var DEBUG = process.env.NODE_ENV === 'debug',
    CI = process.env.CI === 'true',
    branch = process.env.TRAVIS_BRANCH,
    buildTag = process.env.TRAVIS_TAG;

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
  if (!CI) return;
  return gulp.src('./coverage/lcov.info')
    .pipe(coveralls());
});

gulp.task('tagit', function(done) {
    if (CI && branch === 'master' && !buildTag) {
        version(function(err, info) {
            if (err) done(err);
            var next = info.next.patch;
            console.log('next patch', next);
            var opts = { };
            git.tag(next.tag, 'new version ' + next.version, opts, function(err) {
                if (err) done(err);
                git.push('origin', next.tag, done);
            });
        });
    }
});

gulp.task('test', ['lint', 'istanbul']);

gulp.task('default', ['test', 'coveralls']);
