const { series, src, dest, watch } = require('gulp');
const htmlClean = require('gulp-htmlclean');
const cssClean = require('gulp-clean-css');
const less = require('gulp-less');
const uglify = require('gulp-uglify');
const stripdebug = require('gulp-strip-debug');
const imageMin = require('gulp-imagemin');
const connect = require('gulp-connect');
const rename = require('gulp-rename');
const babel = require('gulp-babel');

const folder = {
    src: 'src/',
    dist: 'dist/'
}

function html() {
    return src(folder.src + 'html/*')
        .pipe(htmlClean())

    .pipe(dest(folder.dist + 'html/'))
        .pipe(connect.reload())
}

function css() {
    return src(folder.src + 'css/*')
        .pipe(less())
        .pipe(cssClean())

    .pipe(dest(folder.dist + 'css/'))
        .pipe(connect.reload())
}

function js() {
    return src(folder.src + 'js/*')
        // .pipe(babel())
        // .pipe(uglify())
        .pipe(dest(folder.dist + 'js/'))
        .pipe(connect.reload())
}

function image() {
    return src(folder.src + 'images/*')
        .pipe(imageMin())
        .pipe(dest(folder.dist + 'images/'))
}

function serve(cb) {
    connect.server({
        port: '12347',
        livereload: true
    })
    cb();
}

watch(folder.src + 'html/*', function(cb) {
    html();
    cb();
})

watch(folder.src + 'css/*', function(cb) {
    css();
    cb();
})
watch(folder.src + 'js/*', function(cb) {
    js();

    cb();
})
exports.default = series(html, css, js, image, serve);