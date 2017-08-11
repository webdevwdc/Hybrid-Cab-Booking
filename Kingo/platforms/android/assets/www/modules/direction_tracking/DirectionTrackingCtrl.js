app.controller('DirectionTrackingCtrl', function ($scope, $stateParams, ionicMaterialInk, $ionicPopup, $timeout, $state, $q) {
    //ionic.material.ink.displayEffect();
    ionicMaterialInk.displayEffect();

    // Toggle Code Wrapper
    var code = document.getElementsByClassName('code-wrapper');
    for (var i = 0; i < code.length; i++) {
        code[i].addEventListener('click', function () {
            this.classList.toggle('active');
        });
    }
    // Sets a listener on a radio button to change the filter type on Places
    // Autocomplete.

    AutocompleteDirectionsHandler.prototype.route = function () {
        if (!this.originPlaceId || !this.destinationPlaceId) {
            return;
        }
        var me = this;
        $scope.destinationPLaceId = this.destinationPlaceId;
        this.directionsService.route({
            origin: { 'placeId': this.originPlaceId },
            destination: { 'placeId': this.destinationPlaceId },
            travelMode: this.travelMode
        }, function (response, status) {
            if (status === 'OK') {
                $scope.originLat = response.routes[0].legs[0].start_location.lat();
                $scope.originLng = response.routes[0].legs[0].start_location.lng();
                $scope.destinationLat = response.routes[0].legs[0].end_location.lat();
                $scope.destinationLng = response.routes[0].legs[0].start_location.lng();
                var estimatedTimeDuration = response.routes[0].legs[0].duration.value;
                var d = new Date();
                d.setSeconds(d.getSeconds() + estimatedTimeDuration);
                var time = d.toLocaleTimeString();
                TTS.speak('You will reach approximately to your destination by ' + time, function () {
                }, function (reason) {
                    alert(reason);
                });

                me.directionsDisplay.setDirections(response);
                me.directionsDisplay.setPanel(document.getElementById('right-panel'));

            } else {
                window.alert('Directions request failed due to ' + status);
            }
        });
    };
    // Sets a listener on a radio button to change the filter type on Places
    // Autocomplete.
    AutocompleteDirectionsHandler.prototype.setupClickListener = function (id, mode) {
        var radioButton = document.getElementById(id);
        var me = this;
        radioButton.addEventListener('click', function () {
            me.travelMode = mode;
            me.route();
        });
    };

    AutocompleteDirectionsHandler.prototype.setupPlaceChangedListener = function (autocomplete, mode) {
        var me = this;
        autocomplete.bindTo('bounds', this.map);
        autocomplete.addListener('place_changed', function () {
            var place = autocomplete.getPlace();
            if (!place.place_id) {
                window.alert("Please select an option from the dropdown list.");
                return;
            }
            if (mode === 'ORIG') {
                me.originPlaceId = place.place_id;
            } else {
                me.destinationPlaceId = place.place_id;
            }
            me.route();
        });

    };

    function initMap() {
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.onload = function () {
            script = document.createElement('script');
            script.type = 'text/javascript';
            script.onload = function () {
                var map = new google.maps.Map(document.getElementById('map'), {
                    mapTypeControl: false,
                    center: { lat: 22.5762, lng: 88.4283 },
                    zoom: 15,
                    mapTypeId: 'terrain'
                });
                var homer = {
                    url: 'img/car.png',
                    scaledSize: new google.maps.Size(20, 16),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(0, 0)
                }
                $scope.marker = new SlidingMarker({
                    map: map,
                    position: { lat: 22.5762, lng: 88.4283 },
                    icon: homer
                });
                $timeout(function () {
                    latLng = new google.maps.LatLng(22.5762 + 0.0001, 88.4283 + 0.0001);
                    map.setCenter(latLng);
                    $scope.marker.animateTo(latLng);
                }, 5000);
                // var homer = {
                //     url: 'img/car.png',
                //     scaledSize: new google.maps.Size(20, 16),
                //     origin: new google.maps.Point(0, 0),
                //     anchor: new google.maps.Point(0, 32)
                // }
                // var marker = new SlidingMarker({
                //     position: { lat: 22.5726, lng: 88.3639 },
                //     map: map,
                //     icon: homer,
                //     draggable: true
                // });

                new AutocompleteDirectionsHandler(map);
            }
            script.src = 'js/SlidingMarker.min.js';
            head.appendChild(script);
        }
        script.src = 'js/markerAnimate.js';
        head.appendChild(script);

    }

    /**
     * @constructor
    */
    function AutocompleteDirectionsHandler(map) {
        this.map = map;
        $scope.map = map;
        this.originPlaceId = null;
        this.destinationPlaceId = null;
        this.travelMode = 'DRIVING';
        var originInput = document.getElementById('origin-input');
        var destinationInput = document.getElementById('destination-input');
        //var modeSelector = document.getElementById('mode-selector');
        this.directionsService = new google.maps.DirectionsService;
        this.directionsDisplay = new google.maps.DirectionsRenderer;
        this.directionsDisplay.setMap(map);

        var originAutocomplete = new google.maps.places.Autocomplete(
            originInput, { placeIdOnly: true });
        var destinationAutocomplete = new google.maps.places.Autocomplete(
            destinationInput, { placeIdOnly: true });

        // this.setupClickListener('changemode-walking', 'WALKING');
        // this.setupClickListener('changemode-transit', 'TRANSIT');
        // this.setupClickListener('changemode-driving', 'DRIVING');

        this.setupPlaceChangedListener(originAutocomplete, 'ORIG');
        this.setupPlaceChangedListener(destinationAutocomplete, 'DEST');

        this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(originInput);
        this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(destinationInput);
        // this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(modeSelector);
    }



    initMap();
    function onSuccess(position) {
        // var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        // $scope.marker.animateTo(latLng);


    }
    function onError(error) {
        alert('code: ' + error.code + '\n' +
            'message: ' + error.message + '\n');
    }

    $scope.startTracking = function () {
        $scope.map.setZoom(17);
        var latLng = { lat: $scope.originLat, lng: $scope.originLng };
        $scope.map.setCenter(latLng);
        var homer = {
            url: 'img/car.png',
            scaledSize: new google.maps.Size(20, 16),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(0, 0)
        }
        $scope.marker = new SlidingMarker({
            map: $scope.map,
            position: latLng,
            icon: homer,
            rotation: 45
        });

        //var watchID = navigator.geolocation.watchPosition(onSuccess, onError, { timeout: 30000 });
        $timeout(function () {
            latLng = new google.maps.LatLng($scope.originLat + 0.0001, $scope.originLng + 0.0001);
            $scope.map.setCenter(latLng);
            $scope.marker.animateTo(latLng);
        }, 5000);

    }

});