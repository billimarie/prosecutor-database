var gulp = require('gulp'),
    handlebars = require('gulp-compile-handlebars'),
    rename = require('gulp-rename'),
    attorneyGenerals = require('./public/attorney-general/_attorney-general-config.json'),
    usAttorneys = require('./public/us-attorney/_us-attorney-config.json'),
    districtAttorneys = require('./public/district-attorney/_district-attorney-config.json');

gulp.task('handlebars', function() {
  for(var i=0; i<attorneyGenerals.length; i++) {
    var attorneyGeneral = attorneyGenerals[i],
        fileName = attorneyGeneral.name.replace(/ +/g, '-').toLowerCase();

    gulp.src('templates/attorney-general-profile.handlebars')
      .pipe(handlebars(attorneyGeneral))
      .pipe(rename(fileName + ".html"))
      .pipe(gulp.dest('public/attorney-general'));
  }

  for(var i=0; i<usAttorneys.length; i++) {
    var usAttorney = usAttorneys[i],
        fileName = usAttorney.name.replace(/ +/g, '-').toLowerCase();

    gulp.src('templates/us-attorney-profile.handlebars')
      .pipe(handlebars(usAttorney))
      .pipe(rename(fileName + ".html"))
      .pipe(gulp.dest('public/us-attorney'));
  }

  for(var i=0; i<districtAttorneys.length; i++) {
    var districtAttorney = districtAttorneys[i],
        fileName = districtAttorney.name.replace(/ +/g, '-').toLowerCase();

    gulp.src('templates/district-attorney-profile.handlebars')
      .pipe(handlebars(districtAttorney))
      .pipe(rename(fileName + ".html"))
      .pipe(gulp.dest('public/district-attorney'));
  }
});

gulp.task('default', ['handlebars']);
