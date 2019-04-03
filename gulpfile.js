const gulp = require('gulp')
const rename = require('gulp-rename')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const preprocess = require('gulp-preprocess')

let env = 'ES5'

gulp.task('build', function () {
  return gulp
    .src('src/index.js')
    .pipe(preprocess({
      context: {
        env: env
      }
    }))
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(uglify({
      compress: {
        global_defs: {}
      },
      output: {
        ascii_only: true
      }
    }))
    .pipe(gulp.dest('dist/'));
})


gulp.task('build_es6', function () {
  env = 'ES6'
  gulp.start('build')
})
gulp.task('build_es5', function () {
  env = 'ES5'
  gulp.start('build')
})