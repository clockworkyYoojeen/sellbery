// paths
let project_folder = "dist" // папка с готовым проектом
let source_folder = "src" // источник файлов для сборки

let path = {
    build: { // пути для сборки (куда сливаем)
        html: project_folder + "/",
        css: project_folder + "/css/",
        parts_css: project_folder + "/css/parts/",
        js: project_folder + "/js/",
        img: project_folder + "/img/",
        fonts: project_folder + "/fonts"
    },
    src: { // пути для исходных файлов 
        // не включать в сборку html файлы, начинающиеся с символа подчёркивания (_header.html и т.п)
        html: [source_folder + "/*.html", "!" + source_folder + "/_*.html"],
        css: [source_folder + "/scss/reset.css", source_folder + "/scss/main.scss", source_folder + "/scss/media.scss", source_folder + "/scss/fonts.css", source_folder + "/scss/modal.css"], // можно писать пути к нескольким файлам (в массиве)
        // css: source_folder + "/scss/*.{scss,css}",
        parts_css: source_folder + "/scss/parts/*.{scss,css}",
        js: source_folder + "/js/common.js",
        // подключаем js библиотеки (jquery и waypoints)
        // jslibs: [source_folder + "/libs/jquery/jquery-1.11.2.min.js", source_folder + "/libs/waypoints/waypoints.min.js"],
        img: source_folder + "/img/**/*.{png,jpg,jpeg,ico,gif,webp}",
        fonts: source_folder + "/fonts/**"
    },
    watch: { // пути для наблюдения
        html: source_folder + "/**/*.html",
        css: source_folder + "/scss/**/*.scss",
        partsCss: source_folder + "/scss/parts/*.scss",
        js: source_folder + "/js/**/*.js",
        img: source_folder + "/img/**/*.{png,jpg,jpeg,ico,gif,webp}",
    },
    clean: "./" + project_folder + "/"
}
// переменные из установленных пакетов
let { src, dest } = require('gulp')
let gulp = require('gulp')
browsersync = require('browser-sync').create() // автообновление браузера
let fileinclude = require('gulp-file-include') // подключаемые файлы (например _header.html)
let del = require('del')
let scss = require('gulp-sass') // работа с sass
let autoprefixer = require('gulp-autoprefixer') // префиксы css для разных браузеров
let clean_css = require('gulp-clean-css') // минификация css
let concat_css = require('gulp-concat-css') // объединение файлов css в один
let gulp_rename = require('gulp-rename') // переименование файлов
let uglify_es = require('gulp-uglify-es').default // минификация js файлов
let imagemin = require('gulp-imagemin') // минификация изображений
let ttf2woff = require('gulp-ttf2woff') // работа со шрифтами
let ttf2woff2 = require('gulp-ttf2woff2') // работа со шрифтами
let modifyCssUrls = require('gulp-modify-css-urls') // пути к фоновым изображениям в css

// автообновление браузера
function browserSync() {
    browsersync.init({
        server: {
            baseDir: "./" + project_folder + "/"
        },
        port: 3000,
        notify: false
    })
}

// обработка html
function html() {
    return src(path.src.html)
        .pipe(fileinclude())
        .pipe(dest(path.build.html))
        .pipe(browsersync.stream())
}
// css
function css() {
    return src(path.src.css)
        .pipe(
            scss({
                outputStyle: 'expanded'
            })
        )
        .pipe(autoprefixer({
            overrideBrowserslist: ["last 5 versions"],
            cascade: true
        }))
        .pipe(modifyCssUrls({
            modify: function (url, filePath) {
                return '' + url; // url - например img/header_bg.jpg, то что в пути в css файле
            },
            prepend: 'https://sellbery.netlify.app/',//'https://fancycdn.com/',
            append: ''//'?cache-buster'        
        }))
        .pipe(dest(path.build.css))
        .pipe(clean_css())
        .pipe(gulp_rename({
            extname: ".min.css"
        }))
        .pipe(dest(path.build.css))
        .pipe(browsersync.stream())
}
// css для отдельных частей шаблона
function partsCss() {
    return src(path.src.parts_css)
        .pipe(
            scss({
                outputStyle: 'expanded'
            })
        )
        .pipe(autoprefixer({
            overrideBrowserslist: ["last 5 versions"],
            cascade: true
        }))
        .pipe(modifyCssUrls({
            modify: function (url, filePath) {
                return '' + url; // url - например img/header_bg.jpg, то что в пути в css файле
            },
            prepend: 'https://sellbery.netlify.app/',//'https://fancycdn.com/',
            append: ''//'?cache-buster'        
        }))
        .pipe(concat_css("/bundle.css")) // путь относительно той папки, куда будут сливаться файлы (css/parts/) 
        .pipe(dest(path.build.parts_css))
        .pipe(browsersync.stream())
}
// js
function js() {
    return src(path.src.js)
        .pipe(fileinclude())
        .pipe(dest(path.build.js))
        .pipe(
            uglify_es()
        )
        .pipe(
            gulp_rename({
                extname: ".min.js"
            })
        )
        .pipe(dest(path.build.js))
        .pipe(browsersync.stream())
}
// подключаем js библиотеки
// function jslibs(){
//     return src(path.src.jslibs)
//     .pipe(dest(path.build.js))
//     .pipe(browsersync.stream())
// }

function fonts() {
    return src(path.src.fonts)
        .pipe(ttf2woff())
        .pipe(dest(path.build.fonts));

    // return src(path.src.fonts)
    //     .pipe(ttf2woff2())
    //     .pipe(dest(path.build.fonts))
}
function images() {
    return src(path.src.img)
        .pipe(
            imagemin({
                progressive: true,
                interlaced: true,
                optimizationLevel: 3
            })
        )
        .pipe(dest(path.build.img))
        .pipe(browsersync.stream())
}
// следим за файлами
function watchFiles() {
    gulp.watch([path.watch.html], html)
    gulp.watch([path.watch.css], css)
    gulp.watch([path.watch.partsCss], partsCss)
    gulp.watch([path.watch.js], js)
    gulp.watch([path.watch.img], images)
}

function clean() {
    return del(path.clean)
}
// конечная сборка
let build = gulp.series(clean, gulp.parallel(js, /*jslibs, */ partsCss, css, html, fonts, images))
let watch = gulp.parallel(build, watchFiles, browserSync)

exports.images = images
exports.js = js
exports.css = css
exports.partsCss = partsCss
exports.build = build
exports.html = html
exports.fonts = fonts
// exports.jslibs = jslibs
exports.watch = watch
exports.default = watch