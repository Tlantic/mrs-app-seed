// Includes
var settings_project = require('./package.json');

// Components
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    runSequence = require('run-sequence'),
    argv = require('yargs').argv;

var fs = require('fs'),
    path = require('path'),
    sh = require('shelljs'),
    bower = require('bower');

var gulpIf = require('gulp-if'),
    gulpFilter = require('gulp-filter'),
    watch = require('gulp-watch'),
    batch = require('gulp-batch'),
    merge = require('merge-stream'),
    foreach = require('gulp-foreach'),
    printer = require('gulp-print');

var del = require('del'),
    rename = require('gulp-rename'),
    replace = require('gulp-replace-task'),
    sass = require('gulp-sass'),
    cssMinify = require('gulp-minify-css'),
    inject = require("gulp-inject"),
    concat = require('gulp-concat'),
    jsuglify = require('gulp-uglify'),
    changed = require('gulp-changed'),
    imagemin = require('gulp-imagemin'),
    templateCache = require('gulp-angular-templatecache');


// Params
var params = {
    brand: argv['brand'] || 'tlantic',
    env: argv['env'] || 'dev'
}

var settings_build = {};
try {
    console.log("Arguments", argv);
    settings_build = require('./config/' + params.brand + '/build.json')[params.env];
    settings_build = settings_build || {};
} catch (e) {
    console.error("Using default build settings");
}

gutil.log("Using build settings", settings_build);

// Options
var options = {
    brand: params.brand,
    env: params.env,
    replaces: {
        files: ['index.html', 'js/app.js', 'config.xml'],
        patterns: [{
            match: 'appVersion',
            replacement: settings_project.version || '0.0.0'
        }, {
                match: 'ngCordovaScript',
                replacement: 'ng-cordova'
            }, {
                match: 'ngCordovaModule',
                replacement: 'ngCordova'
            }]
    },
    clean: [
        '**/*.md', 
        '**/package.json', 
        '**/bower.json', 
        '**/.bower.json', 
        'lib/mrs-app-*/**/*.js', 
        '!lib/mrs-app-*/**/*.min.js', 
        '**/Thumbs.db',
        '**/.DS_Store'],
    processChangedOnly: false,
    js: settings_build['js'] || {
        uglify: false
    },
    style: settings_build['style'] || {
        uglify: false
    },
    img: settings_build['img'] || {
        uglify: false
    },

};

// Paths
var paths = {
    src: 'src/',
    config: 'config/',
    env: 'config/' + options.brand + '/',
    resources: 'resources/',
    merge: {
        root: 'merge/',
        files: 'merge/www/'
    },
    www: {
        root: 'www/',
        files: 'www/'
    },
    watch: {
        config: ['config/' + options.brand + '/*'],
        style: [
            'src/scss/**',
            'src/css/**',
            'config/' + options.brand + '/www/scss/**',
            'config/' + options.brand + '/www/css/**'],
        js: [
            'src/js/**',
            'config/' + options.brand + '/www/js/**'],
        img: [
            'src/img/**',
            'config/' + options.brand + '/www/img/**'],
        other: [
            'src/i18n/**',
            'config/' + options.brand + '/www/i18n/**',
            'src/templates/**',
            'config/' + options.brand + '/www/templates/**'],
        index: [
            'src/index.html',
            'config/' + options.brand + '/www/index.html'
        ]
    }
}

// Tasks: default
gulp.task('default', function (done) {
    runSequence('clean', 'build', done);
});

// Tasks: installation
gulp.task('install', ['install:git-check'], function () {
    return bower.commands.install()
        .on('log', function (data) {
            gutil.log('bower', gutil.colors.cyan(data.id), data.message);
        });
});

gulp.task('install:git-check', function (done) {
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

// Tasks: clean, build and link
gulp.task('clean', function () {
    return del([
        paths.resources,
        paths.merge.root,
        paths.www.root
    ]);
});

gulp.task('build', function (done) {
    runSequence('build:config', 'build:files', 'build:style', 'build:js', 'build:img', 'build:templates', 'build:resources', 'build:index', 'build:clean', done);
});

gulp.task('build:config', function () {
    var xml = gulp.src(path.join(paths.env, 'config.xml'))
        .pipe(changed(paths.merge.root))
        .pipe(replace({
            patterns: options.replaces.patterns
        }))
        .pipe(gulp.dest(paths.merge.root))
        .pipe(gulp.dest(paths.www.root))
        .pipe(gulp.dest('./'));

    var conf = gulp.src(path.join(paths.env, 'conf.' + options.env + '.json'))
        .pipe(changed(paths.merge.files))
        .pipe(gulp.dest(paths.merge.files))
        .pipe(rename({ basename: 'app.conf' }))
        .pipe(gulp.dest(paths.www.files));

    return merge(xml, conf);
});

gulp.task('build:style', function () {
    var scssFilesFilter = gulpFilter(['[^_]*.scss']);

    var scss = gulp.src([
        path.join(paths.env, 'www', 'scss', '**', '*.scss'),
        path.join(paths.src, 'scss', '**', '*.scss')
    ])
        .pipe(changed(path.join(paths.merge.files, 'scss')))
        .pipe(gulp.dest(path.join(paths.merge.files, 'scss')))
        .pipe(scssFilesFilter)
        .pipe(sass({ errLogToConsole: true }))
        .pipe(gulp.dest(path.join(paths.www.files, 'css')))
        .pipe(gulpIf(options.style.uglify, cssMinify()))
        //.pipe(gulpIf(options.style.uglify, rename({ extname: '.min.css' })))
        .pipe(gulpIf(options.style.uglify, gulp.dest(path.join(paths.www.files, 'css'))));

    var css = gulp.src([
        path.join(paths.env, 'www', 'css', '**', '*.css'),
        path.join(paths.src, 'css', '**', '*.ccss')
    ])
        .pipe(changed(path.join(paths.merge.files, 'css')))
        .pipe(gulp.dest(path.join(paths.merge.files, 'css')))
        .pipe(gulp.dest(path.join(paths.www.files, 'css')));

    return merge(scss, css);
});

gulp.task('build:js', function(done) {
    runSequence('build:js:copy', 'build:js:process', done);
})

gulp.task('build:js:copy', function () {
    return gulp.src([
        path.join(paths.env, 'www', 'js', '**', '*.js'),
        path.join(paths.src, 'js', '**', '*.js')
    ])
        .pipe(changed(path.join(paths.merge.files, 'js')))
        .pipe(gulp.dest(path.join(paths.merge.files, 'js')));
});

gulp.task('build:js:process', function() {
    return gulp.src(path.join(paths.merge.files, 'js/*'))
        .pipe(foreach(function(stream, file) {
            if (fs.statSync(file.path).isDirectory()) {
                return gulp.src(path.join(file.path, '**', '*.js'))
                    .pipe(concat(path.basename(file.path) + '.js'));
            }
            return stream;
        }))
        .pipe(replace({
            patterns: options.replaces.patterns
        }))
        .pipe(gulpIf(options.js.uglify, jsuglify()))
        //.pipe(gulpIf(options.js.uglify, rename({ extname: '.min.js' })))
        .pipe(gulp.dest(path.join(paths.www.files, 'js')));
})

gulp.task('build:img', function () {
    return gulp.src([
        path.join(paths.env, 'www', 'img', '**'),
        path.join(paths.src, 'img', '**')
    ])
        .pipe(changed(paths.merge.files + '/img/'))
        .pipe(gulp.dest(paths.merge.files + '/img/'))
        .pipe(gulpIf(options.img.uglify, imagemin({
            progressive: true
        })))
        .pipe(gulp.dest(paths.www.files + '/img/'));
});

gulp.task('build:templates', function() {
    return gulp.src(
            path.join(paths.merge.files, 'templates', '**', '*.html'))
        .pipe(templateCache('templates.js', {
            module: 'App',
            root: 'templates/'
        }))
        .pipe(gulp.dest(path.join(paths.www.files, 'js')));
});

gulp.task('build:files', function () {
    var stream = merge();
    var folders = ['i18n', 'lib', 'templates'];
    
    folders.forEach(function(folder) {
        stream.add(
            gulp.src([
                path.join(paths.env, 'www', folder, '**'),
                path.join(paths.src, folder, '**')
            ])
                .pipe(changed(path.join(paths.merge.files, folder)))
                .pipe(gulp.dest(path.join(paths.merge.files, folder)))
                .pipe(gulp.dest(path.join(paths.www.files, folder)))    
        );
    });
    
    return stream;
});

gulp.task('build:resources', function() {
    return gulp.src(path.join(paths.env, paths.resources, '**'))
        .pipe(changed(path.join(paths.merge.files, 'resources')))
        .pipe(gulp.dest(path.join(paths.merge.files, 'resources')))
        .pipe(gulpIf(options.img.uglify, imagemin({
            progressive: true
        })))
        .pipe(gulp.dest(paths.resources));
});

gulp.task('build:index', function () {
    return gulp.src([
        paths.env + '/www/index.html',
        paths.src + '/index.html'
    ])
        .pipe(gulp.dest(paths.merge.files + '/'))
        .pipe(replace({
            patterns: options.replaces.patterns
        }))
        .pipe(inject(
            gulp.src([
                path.join(paths.www.files, 'js', '**', '_*.js'),
                path.join(paths.www.files, 'js', '**', '*.js'),
                path.join(paths.www.files, 'css', '*.css')],
                { read: false }),
            {
                ignorePath: paths.www.files,
                addRootSlash: false
            }
            ))
        .pipe(changed(paths.www.files + '/', { hasChanged: changed.compareSha1Digest }))
        .pipe(gulp.dest(paths.www.files + '/'));
});

gulp.task('build:clean', function(done) {
    if (!options.js.uglify)
        return done();

    return del(options.clean, {cwd: paths.www.files, read: false});
});

gulp.task('watch', function (done) {
    runSequence('clean', 'build', 'watch:start', done);
});

gulp.task('watch:start', function () {
    options.processChangedOnly = true;

    watch(paths.watch.config, batch(function (events, done) { runSequence('build:config', done); }));
    watch(paths.watch.style, batch(function (events, done) { runSequence('build:style', 'build:index', done); }));
    watch(paths.watch.js, batch(function (events, done) { runSequence('build:js', 'build:index', done); }));
    watch(paths.watch.img, batch(function (events, done) { runSequence('build:img', done); }));
    watch(paths.watch.other, batch(function (events, done) { runSequence('build:files', done); }));
    watch(paths.watch.index, batch(function (events, done) { runSequence('build:index', done); }));

});

// Tasks: optimization
function getFolders(dir) {
    return fs.readdirSync(dir)
        .filter(function (file) {
            return fs.statSync(path.join(dir, file)).isDirectory();
        });
}