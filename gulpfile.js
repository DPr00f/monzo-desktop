const gulp = require('gulp');
const babel = require('gulp-babel');
const istanbul = require('gulp-babel-istanbul');
const injectModules = require('gulp-inject-modules');
const mocha = require('gulp-mocha');
const eslint = require('gulp-eslint');

require('babel-core/register');

gulp.task('lint', () =>
  gulp.src(['**.js', './src/**', './test/**'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
);

gulp.task('pre-testCoverage', () => {
  return gulp.src(['src/**/*.js*', '!src/index.js', '!src/routes.js'])
    .pipe(istanbul({
      includeUntested: true,
    }))
    .pipe(istanbul.hookRequire());
});

gulp.task('cover', ['pre-testCoverage'], () => {
  return gulp.src(['test/**/*.test.js'])
    .pipe(babel())
    .pipe(injectModules())
    .pipe(mocha({ require: ['./test/testHelper.js'] }))
    .pipe(istanbul.writeReports());
});
