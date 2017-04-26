var gulp = require('gulp'),
    handlebars = require('gulp-compile-handlebars'),
    rename = require('gulp-rename'),
    attorneyGenerals = require('./public/attorney-general/_attorney-general-config.json');
    usAttorneys = require('./public/us-attorney/_us-attorney-config.json');

gulp.task('handlebars', function() {
  for(var i=0; i<attorneyGenerals.length; i++) {
    var attorneyGeneral = attorneyGenerals[i],
        fileName = attorneyGeneral.name.replace(/ +/g, '-').toLowerCase();

    gulp.src('templates/*.handlebars')
      .pipe(handlebars(attorneyGeneral))
      .pipe(rename(fileName + ".html"))
      .pipe(gulp.dest('public/attorney-general'));
  }

  for(var i=0; i<usAttorneys.length; i++) {
    var usAttorney = usAttorneys[i],
        fileName = usAttorney.name.replace(/ +/g, '-').toLowerCase();

    gulp.src('templates/*.handlebars')
      .pipe(handlebars(usAttorney))
      .pipe(rename(fileName + ".html"))
      .pipe(gulp.dest('public/us-attorney'));
  }
});

gulp.task('default', ['handlebars']);
