var gulp = require('gulp'),
  plumber = require('gulp-plumber'),
  sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  cssnano = require('gulp-cssnano'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  connect = require('gulp-connect'),
  del = require('del');

var config = {
  port: 9001,
  dir: {
    app: 'src',
    out: 'dist',
    siteAssets: 'site/assets'
  },
  jquery: "node_modules"
};

/* Scripts */
gulp.task('scripts', ['clean:scripts'], function () {
  return gulp.src(config.dir.app + '/bootstrap.bundle.js')
    .pipe(plumber())
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(config.dir.out))
    .pipe(gulp.dest(config.dir.siteAssets));
});

/* Styles */
gulp.task('styles', ['clean:styles'], function () {
  return gulp.src(config.dir.app + '/scss/bootstrap.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(autoprefixer('last 10 versions'))
    .pipe(cssnano())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(config.dir.out))
    .pipe(gulp.dest(config.dir.siteAssets));;
});

/* Clean */
gulp.task('clean:scripts', function () {
  del.sync(config.dir.out + '/bootstrap.bundle.js');
  del.sync(config.dir.siteAssets + '/bootstrap.bundle.js');
});

gulp.task('clean:styles', function () {
  del.sync(config.dir.out + '/*.css');
  del.sync(config.dir.siteAssets + '/*.css');
});

gulp.task('clean', function () {
  del.sync(config.dir.out);
  del.sync(config.dir.siteAssets);
});

/* Build */
gulp.task('build', ['scripts', 'styles'], function () { });

/* Watch */
gulp.task('watch', ['build'], function () {
  gulp.watch(config.dir.app + '/bootstrap.bundle.js', ['scripts']);
  gulp.watch(config.dir.app + '/scss/*.{scss,sass}', ['styles']);
});

/* Server */
gulp.task('connect', function () {
  connect.server({
    port: config.port,
    root: 'site',
    livereload: true
  });
});

/* Default */
gulp.task('default', ['connect', 'watch']);
