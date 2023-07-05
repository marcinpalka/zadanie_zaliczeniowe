const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const fileInclude = require('gulp-file-include');
const htmlmin = require('gulp-htmlmin');
const browserSync = require('browser-sync').create();
const webpack = require('webpack-stream');
const webpackConfig = require('./webpack.config');

const path = {
    root: "./dist/",
    cssSrc: "./src/scss/**/*.scss",
    cssDist: "./dist/css/",
    jsSrc: "./src/js/app.js",
    jsSrcAll: "./src/js/**/*.js",
    jsDist: "./dist/js/",
    imageSrc: "./src/images/**/*",
    imageDist: "./dist/images/",
    htmlSrc: "./src/html/index.html"
};

const css = function() {
    return gulp.src(path.cssSrc)
        .pipe(sass().on("error", sass.logError))
        .pipe(autoprefixer())
        .pipe(gulp.dest(path.cssDist))
};

const cssProduction = function() {
    return gulp.src(path.cssSrc)
        .pipe(sass({outputStyle: 'compressed'}).on("error", sass.logError))
        .pipe(autoprefixer())
        .pipe(gulp.dest(path.cssDist))
};

const imageMin = function() {
    return gulp.src(path.imageSrc)
        .pipe(imagemin())
        .pipe(gulp.dest(path.imageDist))
};

const html = function() {
    return gulp.src(path.htmlSrc)
        .pipe(fileInclude({
            prefix: "@@",
            basepath: "@file"
        }))
        .pipe(gulp.dest(path.root))
}

const htmlMinify = function() {
    return gulp.src(path.htmlSrc)
      .pipe(htmlmin({ collapseWhitespace: true }))
      .pipe(gulp.dest(path.root));
}

const server = function(cb) { 
    browserSync.init({
        server: {
            baseDir: path.root
        } 
    });

    cb();
}

const serverReload = function(cb) { 
    browserSync.reload();
    cb();
}

const javascript = function() {
    return gulp.src(path.jsSrc)
        .pipe(webpack(webpackConfig))
        .pipe(gulp.dest(path.jsDist))
};

const watch = function() {
    gulp.watch(path.cssSrc, gulp.series(css, serverReload));
    gulp.watch(path.jsSrcAll, gulp.series(javascript, serverReload));
    gulp.watch(path.htmlSrc, gulp.series(html, serverReload));
}

// DODAĆ TASK O NAZWIE NP "CLEAR" KTORY BEDZIE CZYSCIC CALA ZAWARTOSC FOLDERU /DIST, I ODPALAC TO NA POCZATKU TASKU DEFAULT

exports.default = gulp.series( html, css, javascript, server, watch );
// exports.production = gulp.series( imageMin, html, htmlMinify, cssProduction );
