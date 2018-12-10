var gulp = require('gulp');
var uglify = require('gulp-uglify');
var livereload = require('gulp-livereload');
var concat = require('gulp-concat');
var autoprefixer = require('gulp-autoprefixer');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var babel = require('gulp-babel');
var del = require('del');
var zip  = require('gulp-zip');

// Image compression
var imagemin = require('gulp-imagemin');
var imageminPngquant = require('imagemin-pngquant');
var imageminJpegRecompress = require('imagemin-jpeg-recompress');

// File path
var DIST_PATH = 'public/dist';
var SCRIPTS_PATH = 'public/js/**/*.js';
var IMAGES_PATH = 'public/img/**/*.{png,jpeg,jpg,svg,gif}';

// styles For SCSS
gulp.task('styles', function() {
    console.log('Starting styles task');
    return gulp.src('public/scss/styles.scss')
        .pipe(plumber(function(err){
            console.log('Styles Task Error');
            console.log(err);
            this.emit('end');
        }))
        .pipe(sourcemaps.init())
        .pipe(autoprefixer())
        .pipe(sass({
            outputStyle: 'compressed'
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(DIST_PATH + '/css'))
        .pipe(livereload());
});

// Scripts
gulp.task('scripts',function() {
    console.log('Starting scripts task');
    return gulp.src(SCRIPTS_PATH)
        .pipe(plumber(function(err){
            console.log('Scripts Task Error');
            console.log(err);
            this.emit('end');
        }))
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(concat('script.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(DIST_PATH + '/js'))
        .pipe(livereload());
});

// Images
gulp.task('images',function() {
    console.log('Starting images task');
    return gulp.src(IMAGES_PATH)
        .pipe(imagemin(
            [
                imagemin.gifsicle(),
                imagemin.jpegtran(),
                imagemin.optipng(),
                imagemin.svgo(),
                imageminPngquant(),
                imageminJpegRecompress()
            ]
        ))
        .pipe(gulp.dest(DIST_PATH + '/img'))
});

gulp.task('clean', function() {
    console.log('Starting clean task');
    return del.sync([
        DIST_PATH
    ]);
});

// Default
gulp.task('default', ['clean','images', 'styles', 'scripts'], function() {
    console.log('Starting default task');
});

gulp.task('export', function() {
    console.log('Starting export task');
    return gulp.src('public/**/*')
        .pipe(zip('website.zip'))
        .pipe(gulp.dest('./'))
});

gulp.task('watch', ['default'] , function(){
    console.log('Starting watch task');
    require('./server.js');
    livereload.listen();
    gulp.watch(SCRIPTS_PATH, ['scripts']);
    gulp.watch('public/scss/**/*.scss', ['styles']);
});