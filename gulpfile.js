'use strict';

//var async = require('async');
var base64 = require('gulp-base64');
var concat = require('gulp-concat');
var deploy = require('gulp-gh-pages');
var ejs = require('gulp-ejs');
var fs = require('fs');
var gulp = require('gulp');
var inlinesource = require('gulp-inline-source');
var lint = require('gulp-jshint');
var less = require('gulp-less');
var minifyCSS = require('gulp-clean-css');
var minifyHTML = require('gulp-htmlmin');
var path = require('path');
var uglify = require('gulp-uglify');

var pages = [
    'index'
];
var base64Opts = {
    extensions: ['png']
};
var outputPath = '../azaitw.github.io';

gulp.task('images', function () {
    return gulp.src('./src/images/**/*')
    .pipe(gulp.dest(path.join(outputPath, '/images')));
});

// Concat and compress CSS files in src/data/css, and generate build/production.css
gulp.task('css', function() {
    var opts = {
        keepBreaks: false,
        compatibility: 'ie8',
        keepSpecialComments: 0
    };

    return gulp.src('./src/less/style.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(concat('production.css'))
    .pipe(base64(base64Opts))
    .pipe(minifyCSS(opts))
    .pipe(gulp.dest('./temp'));
});

// Concat and compress CSS files in src/data/css, and generate build/production.css
gulp.task('css-dev', ['images'], function() {
    var opts = {
        keepBreaks: false,
        compatibility: 'ie8',
        keepSpecialComments: 0
    };

    return gulp.src('./src/less/style.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(concat('production.css'))
    .pipe(base64(base64Opts))
    .pipe(gulp.dest(outputPath));
});

gulp.task('build-dev', ['css-dev'], function () {
    var optsHtml = {
      conditionals: true,
      spare: true
    };
    return gulp.src('./src/*.html')
//    .pipe(base64(base64Opts))
//    .pipe(inlinesource(optsInline))
    .pipe(minifyHTML(optsHtml))
    .pipe(gulp.dest(outputPath));
});

gulp.task('build', ['css', 'images'], function () {
    var optsHtml = {
      caseSensitive: true,
      collapseWhitespace: true,
      keepClosingSlash: true
    };
    var optsInline = {
        swallowErrors: true
    };
    return gulp.src('./src/*.html')
    .pipe(gulp.dest('./dist'))
    .pipe(inlinesource(optsInline))
    .pipe(minifyHTML(optsHtml))
    .pipe(gulp.dest(outputPath));
});

// Validate all JS files
gulp.task('lint', function () {
    return gulp.src('./src/js/*.js')
    .pipe(lint())
    .pipe(lint.reporter('default', { verbose: true }));
});

gulp.task('deploy', ['build'], function () {
    return gulp.src('./dist/**/*')
    .pipe(deploy())
})
