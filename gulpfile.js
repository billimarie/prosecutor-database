var gulp = require('gulp'),
    handlebars = require('gulp-compile-handlebars'),
    rename = require('gulp-rename'),
    attorneyGenerals = require('./public/attorney-general/_attorney-general-config.json');

gulp.task('handlebars', function() {
  for(var i=0; i<attorneyGenerals.length; i++) {
    var attorneyGeneral = attorneyGenerals[i],
        fileName = attorneyGeneral.name.replace(/ +/g, '-').toLowerCase();

    gulp.src('templates/*.handlebars')
      .pipe(handlebars(attorneyGeneral))
      .pipe(rename(fileName + ".html"))
      .pipe(gulp.dest('public/attorney-general'));
  }
});

gulp.task('default', ['handlebars']);
