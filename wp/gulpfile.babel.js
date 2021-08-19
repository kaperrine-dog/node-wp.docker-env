const themeName = 'theme_name';
//
var gulp = require('gulp');
var plumber = require('gulp-plumber');
/* var rename = require('gulp-rename'); */
var sass = require('gulp-sass');
/* var csslint = require('gulp-csslint'); */
var autoPrefixer = require('gulp-autoprefixer');
//if node version is lower than v.0.1.2
require('es6-promise').polyfill();
/* var cssComb = require('gulp-csscomb'); */
var cmq = require('gulp-merge-media-queries');
/* var cleanCss = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat'); */
var merge = require('merge-stream');

//webpack
var webpack = require('webpack');
var webpackStream = require('webpack-stream');
var webpackConfig = require('./webpack.config.js');
var sourcemaps = require('gulp-sourcemaps');

const paths = {
  //input
  scss: {
    root:`./wp-content/themes/${themeName}/assets/css/*/*.scss`,
    main:`./wp-content/themes/${themeName}/assets/css/style.scss`,
    pages:`./wp-content/themes/${themeName}/assets/css/pages/*.scss`,
  },
  //output
  css:{
    main:`./wp-content/themes/${themeName}/assets/css`,
    pages:`./wp-content/themes/${themeName}/assets/css/pages`
  },
  js:{
    rootDir:`./wp-content/themes/${themeName}/assets/js`,
    index:`./wp-content/themes/${themeName}/assets/js/index.js`,
  }
}
gulp.task('sass',function(done){
    // main.scss
    var main = gulp.src([paths.scss.main])
        .pipe(sourcemaps.init())
        .pipe(plumber({
          handleError: function (err) {
            console.log(err);
            this.emit('end');
          }
        }))
        .pipe(sass())
        .pipe(autoPrefixer())
        //.pipe(cssComb())
        .pipe(cmq({log:true}))
        //.pipe(csslint())
        //.pipe(csslint.formatter())
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest(paths.css.main))
        /*
        .pipe(rename({
            suffix: '.min'
        }))
        */
        //minify
        //.pipe(cleanCss())
        //.pipe(gulp.dest(`wp-content/themes/${themeName}/assets/css/*.min.css`))

    //pages scss compile
    var pages = gulp.src([paths.scss.pages])
        .pipe(sourcemaps.init())
        .pipe(plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(sass())
        .pipe(autoPrefixer())
        //.pipe(cssComb())
        .pipe(cmq({log:true}))
        //.pipe(csslint())
        //.pipe(csslint.formatter())
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest(paths.css.pages))
        /*
        .pipe(rename({
            suffix: '.min'
        }))
        */
        //minify
        //.pipe(cleanCss())
        //.pipe(gulp.dest(`wp-content/themes/${themeName}/assets/css/*.min.css`))
    merge(main, pages);
    done();
});

gulp.task("webpack", function(done){
  webpackStream(webpackConfig, webpack)
    .pipe(gulp.dest( paths.js.rootDir ));
  done();
});

/*
gulp.task('js',function(){
    gulp.src([`wp-content/themes/${themeName}/assets/js/*.js`])
        .pipe(plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(concat('main.js'))
        .pipe(gulp.dest(`wp-content/themes/${themeName}/assets/js`))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(gulp.dest(`wp-content/themes/${themeName}/assets/js`))
});
*/

//gulp.task('html',function(){
//    gulp.src(['html/**/*.html'])
//        .pipe(plumber({
//            handleError: function (err) {
//                console.log(err);
//                this.emit('end');
//            }
//        }))
//        .pipe(gulp.dest('./'))
//});

gulp.task('watch:sass',function(done){
    //gulp.watch(`wp-content//themes/${themeName}/assets/js/*/*.js`,['js']);
    gulp.watch(`wp-content/themes/${themeName}/assets/css/*.scss`, gulp.task('sass'));
    gulp.watch(`wp-content/themes/${themeName}/assets/css/*/*.scss`, gulp.task('sass'));
    //gulp.watch('html/**/*.html',['html']);
    done();
});
gulp.task('watch:webpack', function(done){
  gulp.watch(`wp-content/themes/${themeName}/assets/js/*.js`, gulp.task('webpack'));
  gulp.watch(`wp-content/themes/${themeName}/assets/js/*/*.js`, gulp.task('webpack'));
    //gulp.watch('html/**/*.html',['html']);
  done();
})

gulp.task('watch',function(done){
  //gulp.watch(`wp-content/themes/${themeName}/assets/js/*/*.js`,['js']);
  gulp.watch(`wp-content/themes/${themeName}/assets/css/*.scss`, gulp.task('sass'));
  gulp.watch(`wp-content/themes/${themeName}/assets/css/*/*.scss`, gulp.task('sass'));
  gulp.watch(`wp-content/themes/${themeName}/assets/js/*.js`, gulp.task('webpack'));
  gulp.watch(`wp-content/themes/${themeName}/assets/js/*/*.js`, gulp.task('webpack'));
  done();
})