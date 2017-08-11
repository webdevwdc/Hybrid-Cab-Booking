module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath : './',

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage'],

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'sinon-chai'],
    

    //  Files
    files : [
      'bower_components/ionic/release/js/ionic.bundle.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'dist/*.js',
      'tests/*.spec.js'
    ],
    
    coverageReporter: {
      dir: 'coverage/',
      reporters: [
        {type : 'html', subdir : 'report-html'},
        {type : 'lcovonly', subdir : 'report-lcov'}
      ]
    },

    preprocessors: {
      'dist/**/*.js': ['coverage']
    },
    
    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows
    browsers: ['PhantomJS'],

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_WARN,

    // Continuous Integration mode
    autoWatch: true,
    
    // if true, it capture browsers, run tests and exit
    singleRun: true
  });
};
