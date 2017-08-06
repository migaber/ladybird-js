/* eslint-disable import/no-extraneous-dependencies */

import gulp from 'gulp';
import uglify from 'gulp-uglify';
import rename from 'gulp-rename';
import babel from 'gulp-babel';
import eslint from 'gulp-eslint';
import webpack from 'webpack-stream';
import browserSync from 'browser-sync';
import del from 'del';
import { Server } from 'karma';
import webpackConfig from './webpack.config.babel';

const reload = browserSync.reload;
const paths = {
  allSrc: 'src/**/*.js',
  destDir: 'new-dist',
  gulpFile: 'gulpfile.babel.js',
  webpackFile: 'webpack.config.babel.js',
  buildFolder: 'build',
  sdkMain: 'src/index.js',
  allTests: 'test/**/*Specs.js',
  karmaConfig: 'karma.config.babel.js',
};

gulp.task('test', (done) => {
  new Server({
    configFile: `${__dirname}/${paths.karmaConfig}`,
    singleRun: true,
    autoWatch: false,
  }, done).start();
});

gulp.task('lint', () =>
  gulp.src([
    paths.allSrc,
    paths.gulpFile,
    paths.webpackFile,
    paths.karmaConfig,
  ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError()),
);

gulp.task('clean', () => {
  del('build/*');
});

gulp.task('main', ['lint'], () => {
  gulp.src(paths.sdkMain)
    .pipe(babel())
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest(paths.buildFolder))
    .pipe(reload({ stream: true }));
});

gulp.task('watch', () => {
  gulp.watch(paths.allSrc, ['main']);
  gulp.watch('src/views/*.*', ['main']);
});

gulp.task('sync', () => {
  browserSync({
    startPath: './example',
    server: {
      baseDir: './',
    },
  });
});

gulp.task('dist', ['clean', 'main', 'test'], () => {
  gulp.src(`${paths.buildFolder}/main.js`)
  .pipe(uglify())
  .pipe(rename({ suffix: '.min' }))
  .pipe(gulp.dest(paths.buildFolder));
});

gulp.task('default', ['sync', 'watch', 'main']);
