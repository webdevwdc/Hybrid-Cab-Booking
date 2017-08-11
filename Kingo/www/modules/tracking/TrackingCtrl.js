app.controller('TrackingCtrl', function ($scope, $stateParams, ionicMaterialInk, $ionicPopup, $timeout, $state, $q) {
    //ionic.material.ink.displayEffect();
    ionicMaterialInk.displayEffect();

    // Toggle Code Wrapper
    var code = document.getElementsByClassName('code-wrapper');
    for (var i = 0; i < code.length; i++) {
        code[i].addEventListener('click', function () {
            this.classList.toggle('active');
        });
    }
    function onSuccess(position) {
        debugger;
        // var element = document.getElementById('geolocation');
        // element.innerHTML = 'Latitude: ' + position.coords.latitude + '<br />' +
        //     'Longitude: ' + position.coords.longitude + '<br />' +
        //     '<hr />' + element.innerHTML;
        if ($scope.currentLat && $scope.currentLng) {
            $scope.currentLat = $scope.currentLat + 0.0001;
            $scope.currentLng = $scope.currentLng + 0.0001;
            var latLng = new google.maps.LatLng($scope.currentLat, $scope.currentLng);
            $scope.marker.animateTo(latLng);
        }
        else {
            $scope.currentLat = 22.576355;
            $scope.currentLng = 88.429027;
            var latLng = new google.maps.LatLng($scope.currentLat, $scope.currentLng);
            $scope.marker.animateTo(latLng);
        }

    }

    // onError Callback receives a PositionError object
    //
    function onError(error) {
        debugger;
        alert('code: ' + error.code + '\n' +
            'message: ' + error.message + '\n');
    }

    function addMarkers() {
        var newPosition
        for (var i = 0; i <= 10; i++) {
            if (i == 0) {
                var lat = 22.5735 + 0.01;
                var lng = 88.4331 + 0.01;
                newPosition = new google.maps.LatLng(lat, lng);
                $scope.marker.animateTo(newPosition);
            }
            else {
                $timeout(function () {
                    var lat = 22.5735 + 0.01;
                    var lng = 88.4331 + 0.01;
                    newPosition = new google.maps.LatLng(lat, lng);
                    $scope.marker.animateTo(newPosition);
                }, 2000);
            }

        }
    }

    function tracking() {
        $scope.map = new google.maps.Map(document.getElementById('map1'), {
            mapTypeControl: true,
            zoom: 17,
            center: { lat: 22.576256, lng: 88.428351 },
            mapTypeId: 'hybrid'
        });

        var latLng = { lat: 22.576256, lng: 88.428351 };
        $scope.marker = new SlidingMarker({
            position: latLng,
            map: $scope.map,
            title: 'Hello World!'
        });
        var watchID = navigator.geolocation.watchPosition(onSuccess, onError, { timeout: 30000 });
        // $timeout(function () {
        //     addMarkers();
        // }, 5000);






    }



    function initMap() {

        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.onload = function () {
            script = document.createElement('script');
            script.type = 'text/javascript';
            script.onload = function () {
                //test();
                tracking();
            }
            script.src = 'js/SlidingMarker.min.js';
            head.appendChild(script);
        }
        script.src = 'js/markerAnimate.js';
        head.appendChild(script);


    }
    $timeout(function () {
        initMap();
    }, 2000);




    function test() {
        $scope.map = new google.maps.Map(document.getElementById('map1'), {
            mapTypeControl: false,
            center: { lat: 22.5735, lng: 88.4331 },
            zoom: 13
        });
        var latLng = { lat: 22.5735, lng: 88.4331 };
        var marker = new SlidingMarker({
            position: latLng,
            map: $scope.map,
            title: 'Hello World!'
        });
        var newPosition = new google.maps.LatLng(22.5765, 88.4796);
        marker.animateTo(newPosition);
        newPosition = new google.maps.LatLng(22.5865, 88.4896);
        marker.animateTo(newPosition);
    }

});