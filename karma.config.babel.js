
/* eslint-disable import/no-extraneous-dependencies */
// http://www.tjcafferkey.me/setting-up-karma-and-mocha-with-gulp-and-webpack

const karmaWebpack = require('karma-webpack');
const karmaPhantomLuncher = require('karma-phantomjs-launcher');
const karmaJasmine = require('karma-jasmine');
const karmaSpecReporter = require('karma-spec-reporter');
const karmaCovarage = require('karma-coverage');
const karmaJasmineAjax = require('karma-jasmine-ajax');
// require('karma-chrome-launcher'),
// require('karma-ie-launcher'),

module.exports = (config) => {
  config.set({
    basePath: '',
    frameworks: ['jasmine-ajax', 'jasmine'],
    files: [
      'test/**/*.js',
    ],
    preprocessors: {
      'test/**/*.js': ['webpack'],
      'src/*.js': ['coverage'],
    },

    webpack: {
      resolve: {
        extensions: ['', '.js'],
      },
      module: {
        loaders: [{
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        }],
        postLoaders: [{
          // delays coverage til after tests are run, fixing transpiled source coverage error
          test: /\.js$/,
          exclude: /(test|node_modules)\//,
          loader: 'istanbul-instrumenter',
        }],
      },
    },

    webpackMiddleware: {
      noInfo: true,
    },

    plugins: [
      karmaWebpack,
      karmaPhantomLuncher,
      karmaJasmine,
      karmaSpecReporter,
      karmaCovarage,
      karmaJasmineAjax,
    ],

    reporters: ['spec', 'coverage'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: [
      'PhantomJS',
      // 'Chrome',
      // 'Firefox',
      // 'IE',
      // 'IE9',
      // 'Safari'
    ],
    // customLaunchers: {
    //   IE9: {
    //     base: 'IE',
    //     'x-ua-compatible': 'IE=EmulateIE9'
    //   }
    // },
    singleRun: true,
    concurrency: Infinity,
    coverageReporter: {
      dir: 'coverage/',
      reporters: [
       { type: 'html', subdir: 'report-html' },
       { type: 'text' },
      ],
    },
    client: {
      captureConsole: false,
    },
  });
};
