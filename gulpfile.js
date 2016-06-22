// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var react = require('gulp-react');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var browserSync = require('browser-sync').create();
var cleanCSS = require('gulp-clean-css');

gulp.task('browser-sync', function() {
    browserSync.init({
        server: "./dist"
    });
});

gulp.task('sass', function () {
    gulp.src('./sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('style.css'))
        .pipe(gulp.dest('dist/css'))
        .pipe(rename('style.min.css'))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('html', function() {
    gulp.src('./index.html')
        .pipe(concat('index.html'))
        .pipe(gulp.dest('dist'));
});

// Concatenate & Minify JS
// gulp.task('sw', function() {
//     return gulp.src('sw.js')
//         .pipe(concat('sw.js'))
//         .pipe(gulp.dest('dist'));
// });

gulp.task('scripts', function () {
    return browserify({entries: './js/index.js', extensions: ['.js'], debug: true})
        .transform('babelify', {presets: ['es2015', 'react']})
        .bundle()
        .pipe(source('all.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(rename('all.min.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

// Watch Files For Changes
gulp.task('watch', function() {
    // gulp.watch('sw.js', ['sw']).on('change', browserSync.reload);
    gulp.watch(['js/*.js', 'js/**/*.js'], ['scripts']).on('change', browserSync.reload);
    gulp.watch('sass/*.scss', ['sass']).on('change', browserSync.reload);
    gulp.watch("*.html", ['html']).on('change', browserSync.reload);
});

// Default Task
gulp.task('default', ['watch', 'browser-sync']);
