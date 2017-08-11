app.controller('DirectionCtrl', function ($scope, $stateParams, ionicMaterialInk, $ionicPopup, $timeout, $state, $q) {
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

        this.directionsService.route({
            origin: { 'placeId': this.originPlaceId },
            destination: { 'placeId': this.destinationPlaceId },
            travelMode: this.travelMode
        }, function (response, status) {
            if (status === 'OK') {
                var estimatedTimeDuration = response.routes[0].legs[0].duration.value;
                var d = new Date();
                d.setSeconds(d.getSeconds() + estimatedTimeDuration);
                var time = d.toLocaleTimeString();
                TTS.speak('You will reach approximately to your destination by ' + time, function () {
                    alert('success');
                }, function (reason) {
                    alert(reason);
                });
                // var estimatedTime = response.routes[0].legs[0].duration.text;
                // if (estimatedTime.indexOf('hours') != -1 && estimatedTime.indexOf('mins') != -1) {


                // }
                // else if (estimatedTime.indexOf('hours') != -1) {
                //     estimatedTime = Number(estimatedTime);
                //     var d = new Date();
                //     d.setMinutes(d.getMinutes() + estimatedTime * 60);
                //     var time = d.toLocaleTimeString();
                //     TTS.speak('You will reach approximately by ' + time, function () {
                //         alert('success');
                //     }, function (reason) {
                //         alert(reason);
                //     });
                // }
                // else if (estimatedTime.indexOf('mins') != -1) {
                //     estimatedTime = estimatedTime.split(' ')[0];
                //     estimatedTime = Number(estimatedTime);
                //     var d = new Date();
                //     d.setMinutes(d.getMinutes() + estimatedTime);
                //     var time = d.toLocaleTimeString();
                //     TTS.speak('You will reach approximately by ' + time, function () {
                //         alert('success');
                //     }, function (reason) {
                //         alert(reason);
                //     });
                // }
                me.directionsDisplay.setDirections(response);
                me.directionsDisplay.setPanel(document.getElementById('right-panel'));

                // var steps = response.routes[0].legs[0].steps;
                // for (var i = 0; i < steps.length; i++) {
                //     var polylineDecoded = polyline.decode(steps[0].polyline.points);
                //     for (j = 0; j < polylineDecoded.length; j++) {
                //         var latLng = { lat: polylineDecoded[j][0], lng: polylineDecoded[j][1] };
                //         var marker = new google.maps.Marker({
                //             position: latLng,
                //             map: $scope.map,
                //             title: 'Hello World!'
                //         });
                //     }
                // }

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
        var map = new google.maps.Map(document.getElementById('map'), {
            mapTypeControl: false,
            center: { lat: -33.8688, lng: 151.2195 },
            zoom: 13,
            mapTypeId: 'hybrid'
        });

        new AutocompleteDirectionsHandler(map);
    }

    /**
     * @constructor
    */
    function AutocompleteDirectionsHandler(map) {
        this.map = map;
        $scope.map = map;
        this.originPlaceId = null;
        this.destinationPlaceId = null;
        this.travelMode = 'WALKING';
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


});