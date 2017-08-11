// Ionic Starter App
var app = angular.module('kingo');
app.constant('JS_REQUIRES', {
    //*** Scripts
    scripts: {
        //******frontend style******//
        'frontend': ['css/style.css'],
        //*** Controllers
        'login': ['modules/login/SigninCtrl.js', 'js/services/authService.js'],
        'register':['modules/registration/RegistrationCtrl.js'],
        'direction': ['modules/direction/DirectionCtrl.js','modules/tracking/TrackingCtrl.js','modules/direction_tracking/DirectionTrackingCtrl.js','modules/live_tracking/LiveTrackingCtrl.js'],
        //*** Services

    },
    modules: [
        {
            name: 'ds.clock',
            files: ['js/dependency/angular-clock.js']
        },
        {
            name: 'ngFileUpload',
            files: ['js/dependency/ng-file-upload-shim.min.js', 'js/dependency/ng-file-upload.min.js']
        },
        {
            name: 'angularUtils.directives.dirPagination',
            files: ['lib/pagination/dirPagination.js']
        },
        {
            name: '720kb.datepicker',
            files: ['js/datepicker/angular-datepicker.min.css', 'js/datepicker/angular-datepicker.min.js']
        },
        {
            name: 'angularjs-dropdown-multiselect',
            files: ['js/angularjs-dropdown-multiselect.min.js']
        }
    ]
});



