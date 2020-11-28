var
  gulp = require('gulp'),
  autoprefixer = require('gulp-autoprefixer'),
  sass = require('gulp-sass'),
  browserSync = require('browser-sync'),
  cssnano = require('gulp-cssnano'),
  rename = require('gulp-rename'),
  del = require('del'),
  imagemin = require('gulp-imagemin'),
  pngquant = require('imagemin-pngquant'),
  cache = require('gulp-cache'),
  svgSprite = require("gulp-svg-sprites"),
  pug = require('gulp-pug'),
  gutil = require('gulp-util'),
  webpack = require('webpack'),
  webpackStream = require('webpack-stream'),
  UglifyJSPlugin = require('uglifyjs-webpack-plugin');

/*
 * - Задача: Обновление страницы
 * - Вызов: Компиляция + префиксы
 */
gulp.task('browser-sync', function () {
  browserSync({
    server: {
      baseDir: 'dev'
    },
    notify: false
  });
});

/*
 * - Задача: Обработка scss фалов
 * - Вызов: Компиляция + префиксы
 */
gulp.task('scss', function () {
  return gulp.src([
      '!app/assets/scss/**/*.scss',
      'app/assets/scss/main.scss',
      'app/assets/scss/ie.scss'
    ])
    .pipe(sass())
    .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {
      cascade: true
    }))
    .pipe(gulp.dest('dev/assets/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

/*
 * - Задача: Компиляция js файлов
 * - Выход: Файл main.js
 */

let jsInProccess = false;
gulp.task('js-scripts', function (callback) {
  if (!jsInProccess) {
    gulp.src('app/assets/js/main.js')
    .pipe(webpackStream({
      output: {
        filename: 'main.js',
      },
      plugins: [new UglifyJSPlugin()],
      module: {
        rules: [
          {
            test: /\.(js)$/,
            exclude: /(node_modules)/,
            loader: 'babel-loader',
            query: {
              presets: ['env']
            }
          }
        ]
      }
    }), webpack)
    .pipe(gulp.dest('dev/assets/js'));

    jsInProccess = false;
    callback();
  }
});

gulp.task('scripts', gulp.parallel('js-scripts'));

/*
 * - Задача: Компиляция css библиотек
 * - Выход: Файл libs.min.css
 */
gulp.task('css-libs', function () {
  return gulp.src('app/assets/scss/libs.scss')
    .pipe(sass())
    .pipe(cssnano())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('dev/assets/css'));
});

/*
 * - Задача: Инициализация PUG
 * - Выход: файлы html
 */
gulp.task("pug", function () {
  return gulp
    .src([
      'app/templates/**.pug',
      'app/templates/pages/*.pug'
    ])
    .pipe(
      pug({
        pretty: true
      })
    )
    .pipe(gulp.dest('dev'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

/*
 * - Задача: Отчистка папки dev
 * - Выход: Удаление файлов перед запуском DEV-сборки
 */
gulp.task('clean-dev', async function () {
  return del.sync('dev/*');
});

/*
 * - Задача: Перенос картинок
 * - Выход: Перенос картинок в dev-сборку
 */
gulp.task('img', function () {
  return gulp.src('app/assets/media/images/**/*')
    .pipe(cache(imagemin({
      interlaced: true,
      progressive: true,
      svgoPlugins: [{
        removeViewBox: false
      }],
      use: [pngquant()]
    })))
    .pipe(gulp.dest('dev/assets/media/images/'));
});

/*
 * - Задача: Перенос видео
 * - Выход: Перенос видео в dev-сборку
 */
gulp.task('video', function () {
  return gulp.src('app/assets/media/video/**/*').pipe(gulp.dest('dev/assets/media/video/'));
});

/*
 * - Задача: Сборка и перемещение спрайтов в dev
 * - Выход: sprite.svg в папке media
 */
gulp.task("svg-sprite", function() {
  return gulp.src('app/assets/media/svg/**/*')
    .pipe(
      svgSprite({
        selector: "ui-icon-%f",
        common: "ui-icon",
        cssFile: "../../app/assets/scss/sprite.scss",
        svg: {
          sprite: "media/sprite.svg"
        },
        preview: false
      }))
    .pipe(gulp.dest('dev/assets'));
});

/*
 * - Задача: Перемещение шрифтов в dev-сборку
 * - Выход: Папка fonts в dev
*/
gulp.task("fonts", function(){
  return gulp.src('app/assets/fonts/**/*')
    .pipe(gulp.dest('dev/assets/fonts/'));
});

/*
 * - Задача: Перемещение favicon в dev-сборку
 * - Выход: Папка favicon в dev
*/
gulp.task("favicons", function(){
  return gulp.src('app/assets/favicons/**/*')
    .pipe(gulp.dest('dev/assets/favicons/'));
});

/*
 * - Задача: Отчистка кеша
 */
gulp.task('clear', function (callback) {
  return cache.clearAll();
});

gulp.task('watch', function () {
  gulp.watch(['app/assets/scss/**/*.scss', 'app/assets/scss/*.scss'], gulp.parallel('scss'));
  gulp.watch(['app/templates/*/*.pug', 'app/templates/**.pug'], gulp.parallel("pug"));
  gulp.watch(['app/assets/js/**/*.js', 'app/assets/libs/**/*.js'], gulp.parallel('scripts'));
  gulp.watch('app/assets/media/images/**/*', gulp.parallel('img'));
  gulp.watch('app/assets/media/video/**/*', gulp.parallel('video'));
  gulp.watch('app/assets/media/svg/**/*', gulp.parallel('svg-sprite'));
  gulp.watch('app/assets/fonts/**/*', gulp.parallel('fonts'));
});

gulp.task('build', gulp.series('clean-dev', 'scripts', 'fonts', 'favicons', 'css-libs', 'scss', 'pug', 'img', 'video', 'svg-sprite'));
gulp.task('init', gulp.parallel('build', 'browser-sync', 'watch'));