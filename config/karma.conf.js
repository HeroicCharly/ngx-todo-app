const webpackConfig = require('./webpack.test');

const cwd = process.cwd();

module.exports = function (config) {
    var _config = {
        browserNoActivityTimeout: 20000,

        basePath: '',

        frameworks: ['jasmine'],

        files: [
            { pattern: './config/karma-test-shim.js', watched: false }
        ],

        preprocessors: {
            './config/karma-test-shim.js': ['webpack', 'sourcemap']
        },

        webpack: webpackConfig,

        webpackMiddleware: {
            stats: 'errors-only'
        },

        webpackServer: {
            noInfo: true
        },

        reporters: ['progress', 'junit'],
        junitReporter: {
            outputDir: cwd,
            useBrowserName: false,
            outputFile: 'test-results.xml'
        },
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        browsers: ['jsdom'],
        jsdomLauncher: {
            jsdom: {
                userAgent: 'jsdom'
            }
        }
    };

    config.set(_config);
};
