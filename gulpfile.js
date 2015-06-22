var gulp = require('gulp'),
    gutil = require('gulp-util'),
    bower = require('bower'),
    concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    minifyCss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    sh = require('shelljs'),
    argv = require('yargs').argv,
    runSequence = require('run-sequence'),
    del = require('del'),
    newer = require('gulp-newer');

var paths = {
  src: 'src/',
  www: 'www/',
  sass: 'scss/',
  watch: ['scss/**/*.scss', 'src/**/*'],
  config: 'config/'
};

var defaults = {
  brand: argv.brand || 'tlantic',
  env: argv.env || 'dev'
};

gulp.task('build', function(done) {
  runSequence(
    'build:src',
    ['build:brand', 'build:env'],
    done
    );
});

/**
 * Copy /src -> /www
 * @method build:env
 */
gulp.task('build:src', function(done) {
  gulp
    .src(paths.src + '**/*')
    .pipe(newer(paths.www))
    .pipe(gulp.dest(paths.www))
    .on('end', done);
});

/**
 * Copy /config/<brand>/www -> /www
 * @method build:brand
 */
gulp.task('build:brand', function(done) {
  gulp
    .src(paths.config + defaults.brand + '/www/**/*')
    .pipe(newer(paths.www))
    .pipe(gulp.dest(paths.www))
    .on('end', done);
});

/**
 * Copy /config/<brand>/conf.<env>.json -> /www/app.conf.json
 * @method build:env
 */
gulp.task('build:env', function(done) {
  gulp
    .src(paths.config + defaults.brand + '/conf.' + defaults.env + '.json')
    .pipe(rename({basename: 'app.conf', extname: '.json'}))
    .pipe(newer(paths.www))
    .pipe(gulp.dest(paths.www))
    .on('end', done);
});

gulp.task('clean', ['clean:src', 'clean:sass'], function(done) {
  del([
    paths.www + '/**/*'
  ], done);
});

gulp.task('clean:src', function(done) {
  del([
    paths.www + '/**/*',
    '!' + paths.www + '/css/**/*'
  ], done);
});

gulp.task('clean:sass', function(done) {
  del([
    paths.www + '/css'
  ], done);
});

/**
 * Sass task, includes other tasks
 */
gulp.task('sass', function(done) {
  runSequence(
    ['sass:core', 'sass:env'],
    done
    );
});

/**
 * Generate /scss/app.scss -> /www/css/app.css
 * @method sass:env
 */
gulp.task('sass:core', function(done) {
  gulp
    .src(paths.sass + '/app.scss')
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(gulp.dest(paths.www + '/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest(paths.www + '/css/'))
    .on('end', done);
});

/**
 * Generate /config/<brand>/sass/brand.scss -> /www/css/brand.css
 * @method sass:env
 */
gulp.task('sass:env', function(done) {
  gulp
    .src(paths.config + defaults.brand + '/scss/brand.scss')
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(gulp.dest(paths.www + '/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest(paths.www + '/css/'))
    .on('end', done);
});

gulp.task('watch', ['default', 'watch:src', 'watch:sass'], function() {
  
});

gulp.task('watch:sass', function() {
  gulp.watch(
    [
      paths.sass + '/**/*.scss',
      paths.config + defaults.brand + '/scss/**/*'
    ], 
    ['sass']);
});

gulp.task('watch:src', function() {
  gulp.watch(
    [
      paths.src + '/**/*',
      paths.config + defaults.brand + '/conf.' + defaults.env + '.json', 
      paths.config + defaults.brand + '/www/**/*'
    ],
    ['build']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});

gulp.task('default', function(done) {
  runSequence(
    'clean',
    'build',
    'sass',
    done
    );
});