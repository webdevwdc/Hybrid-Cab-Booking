var app = angular.module('kingo');

app.run(function ($ionicPlatform) {



    $ionicPlatform.ready(function () {

        //setTimeout(function () {
        //    navigator.splashscreen.hide();
        //}, 300);

        if (window.cordova && window.cordova.plugins.Keyboard) {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);

            // Don't remove this line unless you know what you are doing. It stops the viewport
            // from snapping when text inputs are focused. Ionic handles this internally for
            // a much nicer keyboard experience.
            cordova.plugins.Keyboard.disableScroll(false);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });


});






app.run(['$rootScope', '$state', '$stateParams', '$ionicPlatform', '$ionicPopup', '$state', '$window', '$cordovaPushV5',
    function ($rootScope, $state, $stateParams, $ionicPlatform, $ionicPopup, $state, $window, $cordovaPushV5) {
        // Attach Fastclick for eliminating the 300ms delay between a physical tap and the firing of a click event on mobile browsers
        // FastClick.attach(document.body);

        // Set some reference to access them from any scopead
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;

        // GLOBAL APP SCOPE

        var options = {
            android: {
                senderID: "418386852395"
            },
            ios: {
                alert: "true",
                badge: "true",
                sound: "true"
            }
        };

        $ionicPlatform.ready(function () {
            // initialize
            $cordovaPushV5.initialize(options).then(function () {
                // start listening for new notifications
                $cordovaPushV5.onNotification();
                // start listening for errors
                $cordovaPushV5.onError();

                // register to get registrationId
                $cordovaPushV5.register().then(function (registrationId) {
                    debugger;
                    console.log(registrationId);
                    // save `registrationId` somewhere;
                })
            });
            $rootScope.$on('$cordovaPushV5:notificationReceived', function (event, data) {
                // data.message,
                // data.title,
                // data.count,
                // data.sound,
                // data.image,
                // data.additionalData
                alert('notification recieved');
            });

            // triggered every time error occurs
            $rootScope.$on('$cordovaPushV5:errorOcurred', function (event, e) {
                // e.message
            });
            // listen for Online event
            var isOnline = true;
            $rootScope.$on('$cordovaNetwork:online', function (event, networkState) {
                if (isOnline) return;

                isOnline = true;

                console.log('We Are Online');
            });

            $rootScope.$on('$cordovaNetwork:offline', function (event, networkState) {
                if (!isOnline) return;

                isOnline = false;
                var alertconnectivityPopup = $ionicPopup.alert({
                    title: "Internet Disconnected",
                    content: "The internet is disconnected on your device."
                });

                alertconnectivityPopup.then(function (res) {
                    ionic.Platform.exitApp(); // stops the app
                });
            });
            if ($window.localStorage["userInfo"]) {
                $window.localStorage["activeFooter"] = "user";
                $state.go('signin', {}, { reload: true });
            }
            else {
                $state.go('signin', {}, { reload: true });
            }

        });

        //disabling the back button of the phone.

        $ionicPlatform.registerBackButtonAction(function (event) {
            event.preventDefault();
        }, 100);





    }]);

app.filter('htmlToPlaintext', function () {
    return function (text) {
        return text ? String(text).replace(/<[^>]+>/gm, '') : '';
    };
}
);

app.
    filter('removecharacter', function () {
        return function (text) {
            return text ? String(text).replace(/\(([^)]+)\)/g, '') : '';
        };
    }
    );

app.filter('ampersand', function () {
    return function (input) {
        return input ? input.replace(/&amp;/, '&') : '';
    }
});

app.filter('cut', function () {
    return function (value, wordwise, max, tail) {
        if (!value) return '';

        max = parseInt(max, 10);
        if (!max) return value;
        if (value.length <= max) return value;

        value = value.substr(0, max);
        if (wordwise) {
            var lastspace = value.lastIndexOf(' ');
            if (lastspace != -1) {
                //Also remove . and , so its gives a cleaner result.
                if (value.charAt(lastspace - 1) == '.' || value.charAt(lastspace - 1) == ',') {
                    lastspace = lastspace - 1;
                }
                value = value.substr(0, lastspace);
            }
        }

        return value + (tail || ' �');
    };
});
app.directive('onLongPress', function ($timeout) {
    return {
        restrict: 'A',
        link: function ($scope, $elm, $attrs) {
            $elm.bind('touchstart', function (evt) {
                // Locally scoped variable that will keep track of the long press
                $scope.longPress = true;

                // We'll set a timeout for 600 ms for a long press
                $timeout(function () {
                    if ($scope.longPress) {
                        // If the touchend event hasn't fired,
                        // apply the function given in on the element's on-long-press attribute
                        $scope.$apply(function () {
                            $scope.$eval($attrs.onLongPress)
                        });
                    }
                }, 600);
            });

            $elm.bind('touchend', function (evt) {
                // Prevent the onLongPress event from firing
                $scope.longPress = false;
                // If there is an on-touch-end function attached to this element, apply it
                if ($attrs.onTouchEnd) {
                    $scope.$apply(function () {
                        $scope.$eval($attrs.onTouchEnd)
                    });
                }
            });
        }
    };
})


app.factory('AuthFactory', function($firebaseAuth,Firebase) {
    var endPoint = 'https://kingo-cab.firebaseio.com/' ;
    var usersRef = new Firebase(endPoint);
    return $firebaseAuth(usersRef);
  })

