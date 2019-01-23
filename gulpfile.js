"use strict"

const gulp = require('gulp'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    plugins = gulpLoadPlugins(),
    pug = require('gulp-pug'),
    sass = require('gulp-sass'),
    fs = require('fs'),
    url = require('url'),
    del = require('del'),
    zopfli = require('imagemin-zopfli'),
    svgo = require('imagemin-svgo'),
    webp = require('imagemin-webp'),
    mozjpeg = require('imagemin-mozjpeg'),
    proxy = require('proxy-middleware'),
    browserSync = require('browser-sync').create(),
    browserSyncOptions = require('./bs-config.js');

// add Compiller
sass.compiler = require('node-sass');

// create proxy params for for https://samples.openweathermap.org/data/2.5/weather
const weatherProxyOptions = url.parse('https://samples.openweathermap.org/data/2.5/weather');

// add route for https://samples.openweathermap.org/data/2.5/weather
weatherProxyOptions.route = '/weather';

// add proxy
if (!browserSyncOptions.server.middleware) {
    browserSyncOptions.server.middleware = [];
}

browserSyncOptions.server.middleware.push(proxy(weatherProxyOptions));

gulp.task('server', function() {
    browserSync.init(browserSyncOptions);
});

gulp.task('pug', function() {
    return gulp.src('src/pages/*.pug')
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('build'));
});

gulp.task('sass:all', function () {
  return gulp.src('src/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('build/css'));
});

gulp.task('sass:concat', function () {
  return gulp.src('src/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(plugins.concat('concat.css'))
    .pipe(gulp.dest('build/css'));
});

gulp.task('sass:csso', function () {
  return gulp.src('src/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(plugins.concat('concat.css'))
    .pipe(gulp.dest('build/css'))
    .pipe(plugins.autoprefixer({
        browsers: ['last 2 versions']
    }))
    .pipe(plugins.rename('concat.fix.css'))
    .pipe(gulp.dest('build/css'))
    .pipe(plugins.csso())
    .pipe(plugins.rename('concat.min.css'))
    .pipe(gulp.dest('build/css'));
});

gulp.task('sass:one', function () {
  return gulp.src('src/style.sass')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('build/css'));
});

gulp.task('clean', function () {
  return del('build');
});

gulp.task('build', gulp.series('clean', 'pug', 'sass:csso'));

gulp.task('watch', function() {
    gulp.watch('src/**/*.pug', gulp.series('pug'));
    gulp.watch('src/**/*.scss', gulp.series('sass:csso'));
});

gulp.task('images:create', function() {
    return gulp.src(['public/images/**/*.png', 'public/images/**/*.jpg'])
        .pipe(plugins.srcset([{
            match:  '(min-width: 100px)',
            width:  [1920, 1280, 720, 560, 320],
            format: ['png', 'jpg', 'webp'],
            processing: {
                webp: {
                    quality: 100
                },
                jpg: {
                    quality: 80
                },
                png: {}
            },
            optimization: {
                webp: webp({
                    quality: 100
                }),
                jpg:  mozjpeg({
                    quality: 80
                }),
                png:  zopfli(),
                svg:  svgo()
            }
        }]))
        .pipe(gulp.dest('build/images'));
});

gulp.task('default', gulp.series('build', gulp.parallel('server', 'watch')));
