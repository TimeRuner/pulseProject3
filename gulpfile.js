let source_folder = 'src';
let project_folder = 'dist';

let fs = require('fs');


let path = {
    build: {
        html: project_folder + '/',
        css: project_folder + '/css/',
        js: project_folder + '/js/',
        img: project_folder + '/img/',
        fonts: project_folder + '/fonts/',
        icons: project_folder + '/icons/',
    },
    src: {
        html:[source_folder + '/*.html', '!' + source_folder + '/_*.html'],
        css: source_folder + '/sass/style.scss',
        js: source_folder + '/js/script.js',
        img: source_folder + '/img/**/*.{png,jpg,svg,gif,ico,webp}',
        fonts: source_folder + '/fonts/*.{woff,woff2,eot,ttf}',
        icons: source_folder + '/icons/**/*.{png,jpg,svg,gif,ico,webp}',
    },
   
    watch: {
        html: source_folder + '/**/*.html', 
        css: source_folder + '/sass/**/*.scss',
        js: source_folder + '/js/**/*.js',
        img: source_folder + '/img/**/*.{png,jpg,svg,gif,ico,webp}',
        icons: source_folder + '/icons/**/*.{png,jpg,svg,gif,ico,webp}',
    },
    
    clean: './' + project_folder + '/'
}

let { src, dest } = require('gulp'),
gulp = require('gulp'),
browsersync = require('browser-sync').create(),
fileinclude = require('gulp-file-include'),
del = require('del'),
scss = require('gulp-sass'),
autoprefixer = require('gulp-autoprefixer'),
group_media = require('gulp-group-css-media-queries'),
clean_css = require('gulp-clean-css'),
rename = require('gulp-rename'),
uglify = require('gulp-uglify'),
imagemin = require('gulp-imagemin'),
webp = require('gulp-webp'),
webphtml = require('gulp-webp-html'),
webpcss = require('gulp-webpcss'),
htmlmin = require('gulp-htmlmin'),
cache = require('gulp-cache')







function browserSync(params) {
    browsersync.init({
        server: {
            baseDir: './' + project_folder + '/' 
        },
        port: 3000,
        notify: false 
    });
}

function html() {
    return src(path.src.html)
        .pipe(fileinclude())
        .pipe(webphtml()) 
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(dest(path.build.html))
        .pipe(browsersync.reload({stream: true}));
}

function css() {
    return src(path.src.css)
        .pipe(
            scss({
                outputStyle: 'expanded'
            }).on('error', scss.logError)
        )
        .pipe(
            group_media()
        )
        .pipe(
            autoprefixer({
                overrideBrowserslist: ['last 5 versions', '>1%', 'ie 8', 'ie 7'],
                cascade: true
            }))
        .pipe(webpcss()) 
        .pipe(dest(path.build.css))
        .pipe(clean_css())
        .pipe(
            rename({
                extname: '.min.css'
            })
        )
        .pipe(dest(path.build.css)) 
        .pipe(browsersync.reload({stream: true}));
}


function js() {
    return src(path.src.js)
        .pipe(fileinclude())
        .pipe(dest(path.build.js))
        .pipe(browsersync.reload({stream: true}));
}
function icons() {
    return src(path.src.icons)
    .pipe( 
        webp({
            quality: 70,
            method: 3,
            autoFilter: true,
            lossless: true
        })
    )
    .pipe(dest(path.build.icons)) 
    .pipe(src(path.src.icons)) 
    .pipe(cache(imagemin({
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }],
            interlaced: true,
            optimizationLevel: 3
        })))
    .pipe(dest(path.build.icons))
    .pipe(browsersync.reload({stream: true}))
}
function images() {
    return src(path.src.img)
        .pipe( 
            webp({
                quality: 70,
                method: 3,
                autoFilter: true,
                lossless: true
            })
        )
        .pipe(dest(path.build.img)) 
        .pipe(src(path.src.img)) 
        .pipe(cache(imagemin({
                progressive: true,
                svgoPlugins: [{
                    removeViewBox: false
                }],
                interlaced: true,
                optimizationLevel: 3
            })))
        .pipe(dest(path.build.img))
        .pipe(browsersync.reload({stream: true}));
}

gulp.task('clear', function(){
    return cache.clearAll();
});


function fonts(params) {
    return src(path.src.fonts)
        .pipe(dest(path.build.fonts));
}

function fontsStyle(params) {
    let file_content = fs.readFileSync(source_folder + '/sass/fonts.scss');
    if (file_content == '') {
        fs.writeFile(source_folder + '/sass/fonts.scss', '', cb);
        return fs.readdir(path.build.fonts, function (err, items) {
            if (items) {
                let c_fontname;
                for (let i = 0; i < items.length; i++) {
                    let fontname = items[i].split('.');
                    fontname = fontname[0];
                    if (c_fontname != fontname) {
                        fs.appendFile(source_folder + '/sass/fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
                    }
                    c_fontname = fontname;
                }
            }
        })
    }
}

function cb() {

}

function watchFile() {
    gulp.watch(path.watch.html, html); 
    gulp.watch(path.watch.css, css);
    gulp.watch(path.watch.js, js);
    gulp.watch(path.watch.img, images);
    gulp.watch(path.watch.icons, icons);
};

function clean(params) {
    return del(path.clean);
}

let build = gulp.series(clean, gulp.parallel(html, css, images, icons, fonts), js, fontsStyle); 
let watch = gulp.parallel(build, watchFile, browserSync); 



exports.fontsStyle = fontsStyle;
exports.fonts = fonts;
exports.images = images;
exports.icons = icons;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;