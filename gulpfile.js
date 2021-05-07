const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const browsersync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const fileinclude = require('gulp-file-include');
const pug = require('gulp-pug');

// Sass Task
function scssTask(){
    return src(['app/scss/style.scss', 'app/**/*.scss', 'app/**/**/*.scss', 'app/**/**/**/*.scss'])
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(concat('style.css'))
        .pipe(autoprefixer({
            overrideBrowserslist:['last 10 version']
        }))
        .pipe(dest('dest/css'));
}

//Pug Task
function pugTask(){
    return  src(['app/pages/*.pug'])
        .pipe(pug({pretty: true}))
        .pipe(dest('dest/'));
}

// Browsersync Tasks
function browsersyncServe(cb){
    browsersync.init({
        server: {
            baseDir: 'dest'
        }
    });
    cb();
}

function browsersyncReload(cb){
    browsersync.reload();
    cb();
}

// Watch Task
function watchTask(){
    watch('dest/*.html', browsersyncReload);
    watch(['app/scss/style.scss', 'app/**/*.scss', 'app/**/**/*.scss', 'app/**/**/**/*.scss', 'app/blocks/**/*.pug', 'app/blocks/**/**/*.pug'], series(scssTask, pugTask, browsersyncReload));
}

// Default Gulp task
exports.default = series(
    pugTask,
    scssTask,
    browsersyncServe,
    watchTask
);