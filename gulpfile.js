process.env.ABRAIA_KEY = 'NWNjZWZhOWEzZDAwMDAwMDp3WGhMNE5vZUY2ZE5Ncm1aQzFrT3VDSlBYNm1sWndPVQ=='

const gulp = require('gulp')
const cache = require('gulp-cache')
const abraia = require('gulp-abraia')
const sass = require('gulp-sass')
const Fiber = require('fibers')
const autoprefixer = require('gulp-autoprefixer')
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat')
const uglify = require('gulp-uglify-es').default
const svgo = require('gulp-svgo')
const imagemin = require('gulp-imagemin')
const browserSync = require('browser-sync').create()



function compileSass() {
  return gulp.src('src/scss/**/*.scss')
  .pipe(sourcemaps.init())
  .pipe(sass({
    outputStyle: 'compressed'
  }))
  .pipe(autoprefixer({
    overrideBrowserslist: ['last 2 versions'],
    cascade: false
  }))
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest('dist/css'))
  .pipe(browserSync.stream())
}




function pluginsJS() {
  return gulp
  .src('src/js/plugins/*.js')
  .pipe(concat('bundle.js'))
  .pipe(uglify())
  .pipe(gulp.dest('dist/js/'))
  .pipe(browserSync.stream());
}


function compileJS() {
  return gulp
  .src('src/js/*.js')
  .pipe(concat('app.js'))
  .pipe(uglify())
  .pipe(gulp.dest('dist/js/'))
  .pipe(browserSync.stream());
}


function watchFiles() {
  gulp.watch('src/scss/**/*.scss', compileSass)
  gulp.watch('src/images/**/*.png', imageOptimize)
  gulp.watch('src/images/**/*.svg', svgOptimize)
  gulp.watch('src/images/**/*.jpg', imageOptimize)
  gulp.watch('src/js/plugins/*.js', pluginsJS)
  gulp.watch('src/js/*.js', compileJS)
  gulp.watch('src/js/*.js', compileJS)
  gulp.watch(['*.html','**/*.html']).on('change', browserSync.reload)
}

function svgOptimize() {
  return gulp
  .src('src/images/**/*.svg')
  .pipe(svgo())
  .pipe(gulp.dest('dist/images'))
  .pipe(browserSync.stream());
}

function imageOptimize() {
  return gulp
  .src(['src/images/**/*.png','src/images/**/*.jpg'])
  .pipe(imagemin())
  .pipe(gulp.dest('dist/images'))
  .pipe(browserSync.stream());
}

function videoOptimize() {
  return gulp.src('src/videos/*')
  .pipe(abraia([
    { height: 720, output: '{name}-720p.mp4' }
  ]))
  .pipe(gulp.dest('dist/videos'))
}

gulp.task('pluginsjs', pluginsJS)
gulp.task('compilejs', compileJS)
gulp.task('svgo', svgOptimize)
gulp.task('webp', imageOptimize)
gulp.task('video', compileSass)
gulp.task('watch', watchFiles)
gulp.task('sass', compileSass)
gulp.task('browser-sync', function() {
  browserSync.init({
    server: {
        baseDir: "./"
    }});
});
gulp.task('default', gulp.parallel('watch','pluginsjs','sass','compilejs','browser-sync','svgo','webp','video'))


