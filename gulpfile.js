var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat'); 
var minifycss = require('gulp-minify-css');
var cleanCSS = require('gulp-clean-css');
var notify = require('gulp-notify');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
// var livereload = require('gulp-livereload');

var paths = {
    styles: ['./scss/styles.scss']
}

gulp.task('styles', function () {
    return gulp.src('./scss/style.scss')
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions','safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'],
            cascade: true
        }))
        .pipe(gulp.dest('./css')) //save as styles.css 
        .pipe(minifycss()) //minify
        .pipe(rename('style.min.css')) //rename it
        .pipe(gulp.dest('./css')) //destination dir
        .pipe(notify("SCSS compiled!"));
});

gulp.task('js', function () {

    gulp.src('./js/*.js')
        .pipe(plumber())
        .pipe(concat('styles.js'))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('js/min'))
        .pipe(notify({message: 'JS Compiled!'}))
        // .pipe(livereload());
});

gulp.task('watch', function () {
    // livereload.listen();
    gulp.watch('./scss/partials/*.scss', ['styles']); // watch main styles.scss  
    gulp.watch('./scss/vendor/*.scss', ['styles']); // watch partials and vendor dirs
    gulp.watch('./js/*.js', ['js']);
});


gulp.task('default', function() {
  gulp.start('watch','styles', 'js');
});