var gulp = require('gulp');
var ts = require('gulp-typescript');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var tsify = require('tsify');
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');
var watchify = require("watchify");
var tsify = require("tsify");
var gutil = require("gulp-util");
var uglify = require('gulp-uglify');
var babelify = require('babelify');
var merge = require('merge2');  // Requires separate installation 
//const babel = require('gulp-babel');
//const concat = require('gulp-concat');
var connect = require('gulp-connect');

var paths = {
    pages: ['src/browser/**/*.html'],
    serverTS: ['src/server/**/*.ts'],
    browserifyEntries: ['src/browser/main.ts'],
    distBrowser:['dist/browser/**/*.*']
};


//https://www.typescriptlang.org/docs/handbook/gulp.html
function browser() {
    var watchedBrowserify = watchify(browserify({
        basedir: '.',
        debug: true,
        entries:paths.browserifyEntries,
        cache: {},
        packageCache: {},
    }).plugin(tsify));//tsify 根据 tsconfig.json 将typescript转换为es2015

    function bundle() {
        return watchedBrowserify
            .transform('babelify', { //将es2015转换为es5
                presets: ['es2015'],
                extensions: ['.ts'],
                plugins: ['transform-runtime']
            })
            .bundle()
            .on('error', function (err) {
                console.error('bundle error:', err);
                this.emit('end');
            })
            .pipe(source('bundle.js'))//打包为bundle.js
            .pipe(buffer())
            .pipe(sourcemaps.init({ loadMaps: true })) // 添加sourcemaps
            //.pipe(uglify())
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('dist/browser'));
    }

    gulp.task('copy-html', function () {
        return gulp.src(paths.pages)
            .pipe(gulp.dest('dist/browser'));
    });

    gulp.task('watch-browser', ['copy-html'], bundle);
    watchedBrowserify.on("update", bundle);
    watchedBrowserify.on("log", gutil.log);
}

function server() {
    
    var tsProject = ts.createProject("tsconfig.json", {
        "target": "es6",
        "module": "commonjs",
        "sourceMap": true,
        // noImplicitAny: true //覆盖tsconfig.json的定义
    });
    gulp.task("server", function () {
        var tsResult = gulp.src(paths.serverTS)
            .pipe(sourcemaps.init()) // This means sourcemaps will be generated 
            .pipe(tsProject());
        //var tsResult = tsProject.src().pipe(tsProject());//You can replace gulp.src(...) with tsProject.src() to load files based on the tsconfig file (based on files, excludes and includes).
        return merge([ // Merge the two output streams, so this task is finished when the IO of both operations is done. 
            //tsResult.dts.pipe(gulp.dest('dist')),
            tsResult.js
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('dist/server'))
        ]);
    });
    

 


    gulp.task('watch-server', ['server'], function () {
        gulp.watch(paths.serverTS, ['server']);
    });
}

function liveReload(){
    gulp.task('connect', function() {
        connect.server({
             port: 8001,
            //root: 'dist',
            livereload: true
        });
    });
    
    gulp.task('static-file', function () {
        gulp.src(paths.distBrowser)
            .pipe(connect.reload());
    });
    
    gulp.task('watch-dist-browser', function () {
        gulp.watch(paths.distBrowser, ['static-file']);
    });
    gulp.task('liveReload', ['connect', 'watch-dist-browser']);
}

browser();
server();
liveReload();

gulp.task('default', ['watch-server', 'watch-browser','liveReload']);