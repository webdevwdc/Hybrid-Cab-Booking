app.controller('LiveTrackingCtrl', function ($scope, $stateParams, ionicMaterialInk, $ionicPopup, $timeout, $state, $q) {
    //ionic.material.ink.displayEffect();
    ionicMaterialInk.displayEffect();

    // Toggle Code Wrapper
    var code = document.getElementsByClassName('code-wrapper');
    for (var i = 0; i < code.length; i++) {
        code[i].addEventListener('click', function () {
            this.classList.toggle('active');
        });
    }


    var map;
    var directionDisplay;
    var directionsService;
    var stepDisplay;
    var markerArray = [];
    var position;
    var marker = null;
    var polyline = null;
    var poly2 = null;
    var speed = 0.000005,
        wait = 1;
    var infowindow = null;
    var timerHandle = null;
    $scope.time = 0;
    $scope.stopped = false;
    $scope.isAnimate = false;
    $scope.isInitialize = true;

    function onDisSuccess(position) {
        debugger;
        console.log(position);
    }
    function onDisError(error) {

    }
    function createMarker(latlng, label, html) {
        var contentString = '<b>' + label + '</b><br>' + html;
        var marker = new google.maps.Marker({
            position: latlng,
            map: map,
            title: label,
            zIndex: Math.round(latlng.lat() * -100000) << 5
        });
        marker.myname = label;
        google.maps.event.addListener(marker, 'click', function () {
            infowindow.setContent(contentString);
            infowindow.open(map, marker);
        });
        return marker;
    }
    setupPlaceChangedListener = function (autocomplete, mode) {
        var me = this;
        autocomplete.bindTo('bounds', map);
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
            route();
        });

    };

    route = function () {
        if (!this.originPlaceId || !this.destinationPlaceId) {
            return;
        }
        var me = this;

        if (timerHandle) {
            clearTimeout(timerHandle);
        }
        if (marker) {
            marker.setMap(null);
        }
        polyline.setMap(null);
        poly2.setMap(null);
        directionsDisplay.setMap(null);
        polyline = new google.maps.Polyline({
            path: [],
            strokeColor: '#FF0000',
            strokeWeight: 3
        });
        poly2 = new google.maps.Polyline({
            path: [],
            strokeColor: '#FF0000',
            strokeWeight: 3
        });
        // Create a renderer for directions and bind it to the map.
        var rendererOptions = {
            map: map
        };
        directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);

        var start = document.getElementById("start").value;
        var end = document.getElementById("end").value;
        var travelMode = google.maps.DirectionsTravelMode.DRIVING;

        var request = {
            origin: start,
            destination: end,
            travelMode: travelMode
        };

        // Route the directions and pass the response to a
        // function to create markers for each step.
        directionsService.route(request, function (response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                var estimatedTimeDuration = response.routes[0].legs[0].duration.value;
                var d = new Date();
                d.setSeconds(d.getSeconds() + estimatedTimeDuration);
                var time = d.toLocaleTimeString();
                TTS.speak('You will reach approximately to your destination by ' + time, function () {
                }, function (reason) {
                    alert(reason);
                });
                directionsDisplay.setDirections(response);

                var bounds = new google.maps.LatLngBounds();
                var route = response.routes[0];
                startLocation = new Object();
                endLocation = new Object();

                // For each route, display summary information.
                var path = response.routes[0].overview_path;
                var legs = response.routes[0].legs;
                for (i = 0; i < legs.length; i++) {
                    if (i === 0) {
                        startLocation.latlng = legs[i].start_location;
                        startLocation.address = legs[i].start_address;

                        //   marker = createMarker(legs[i].start_location, "start", legs[i].start_address, "green");
                    }
                    endLocation.latlng = legs[i].end_location;
                    endLocation.address = legs[i].end_address;
                    var steps = legs[i].steps;
                    for (j = 0; j < steps.length; j++) {
                        var nextSegment = steps[j].path;
                        for (k = 0; k < nextSegment.length; k++) {
                            polyline.getPath().push(nextSegment[k]);
                            bounds.extend(nextSegment[k]);
                        }
                    }
                }
                $scope.isInitialize = false;
                polyline.setMap(map);
                map.fitBounds(bounds);
                // map.setZoom(18);
                // startAnimation();
            }
        });
    };
    function initialize() {
        infowindow = new google.maps.InfoWindow({
            size: new google.maps.Size(150, 50)
        });
        // Instantiate a directions service.
        directionsService = new google.maps.DirectionsService();

        // Create a map and center it on Manhattan.
        var myOptions = {
            zoom: 13,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            center: { lat: 22.5726, lng: 88.3639 },
            mapTypeControl: false
        };
        map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
        // var trafficLayer = new google.maps.TrafficLayer();
        // trafficLayer.setMap(map);
        // boundListener = google.maps.event.addListener(map, 'bounds_changed', function (event) {
        //     if ($scope.isInitialize == false) {
        //         if (map.getZoom() >= 18) {
        //             debugger;
        //             google.maps.event.removeListener(boundListener);
        //         }
        //         else {
        //             map.setZoom(16);
        //         }
        //     }


        // });


        var rendererOptions = {
            map: map
        };
        directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);

        // Instantiate an info window to hold step text.
        stepDisplay = new google.maps.InfoWindow();

        polyline = new google.maps.Polyline({
            path: [],
            strokeColor: '#FF0000',
            strokeWeight: 3
        });
        poly2 = new google.maps.Polyline({
            path: [],
            strokeColor: '#FF0000',
            strokeWeight: 3
        });
        var originInput = document.getElementById('start');
        var destinationInput = document.getElementById('end');
        var originAutocomplete = new google.maps.places.Autocomplete(
            originInput, { placeIdOnly: true });
        var destinationAutocomplete = new google.maps.places.Autocomplete(
            destinationInput, { placeIdOnly: true });
        setupPlaceChangedListener(originAutocomplete, 'ORIG');
        setupPlaceChangedListener(destinationAutocomplete, 'DEST');


    }

    var steps = [];





    var step = 50; // 5; // metres
    var tick = 1000; // milliseconds
    var eol;
    var k = 0;
    var stepnum = 0;
    var speed = "";
    var lastVertex = 1;
    var globalTimer;

    //=============== animation functions ======================
    function updatePoly(d) {
        // Spawn a new polyline every 20 vertices, because updating a 100-vertex poly is too slow
        if (poly2.getPath().getLength() > 20) {
            poly2 = new google.maps.Polyline([polyline.getPath().getAt(lastVertex - 1)]);
            // map.addOverlay(poly2)
        }

        if (polyline.GetIndexAtDistance(d) < lastVertex + 2) {
            if (poly2.getPath().getLength() > 1) {
                poly2.getPath().removeAt(poly2.getPath().getLength() - 1);
            }
            poly2.getPath().insertAt(poly2.getPath().getLength(), polyline.GetPointAtDistance(d));
        } else {
            poly2.getPath().insertAt(poly2.getPath().getLength(), endLocation.latlng);
        }
    }

    function animate(d) {
        if ($scope.isAnimate) {
            $scope.time = $scope.time + 1;
            if (d > eol) {
                map.panTo(endLocation.latlng);
                marker.setPosition(endLocation.latlng);
                return;
            }
            var p = polyline.GetPointAtDistance(d);
            var heading;
            if (p != null) {
                map.panTo(p);
                var lastPosn = marker.getPosition();
                marker.setPosition(p);
                var heading = google.maps.geometry.spherical.computeHeading(lastPosn, p);
                icon.rotation = heading;
                marker.setIcon(icon);
            }

            updatePoly(d);
            $scope.d = d;
            globalTimer = $timeout(function () {
                animate($scope.d + step)
            }, tick);
        }

        // $timeout(function () {
        //     animate(d + step)
        // }, tick);
        //timerHandle = setTimeout(animate(d+step), tick);
    }

    function onSuccess(position) {
        debugger;
        var startLat = startLocation.latlng.lat().toFixed(4);
        var startLng = startLocation.latlng.lng().toFixed(4);
        var posLat = position.coords.latitude.toFixed(4);
        var posLng = position.coords.longitude.toFixed(4);
        // navigator.geolocation.getCurrentPosition(onDisSuccess, onDisError);
        if (startLat == posLat && startLng == posLng) {
            $scope.stopTracking();
            $scope.isAnimate = false;
        }
        else {
            if ($scope.currentLat == posLat && $scope.currentLng == posLng) {
                $scope.stopTracking();
                $scope.isAnimate = false;
            }
            else {
                $scope.currentLat = posLat;
                $scope.currentLng = posLng;
                $scope.isAnimate = true;
                $scope.resumeTracking();
            }
        }
        // var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        // $scope.marker.animateTo(latLng);


    }
    function onError(error) {
        alert('code: ' + error.code + '\n' +
            'message: ' + error.message + '\n');
    }

    $scope.startTracking = function () {
        startAnimation();
    }


    $scope.stopTracking = function () {
        $scope.stopped = true;
        $timeout.cancel(globalTimer);
    }


    $scope.resumeTracking = function () {
        $scope.stopped = false;
        globalTimer = $timeout(animate($scope.d + step), 1000);
    }
    function startAnimation() {
        eol = polyline.Distance();
        map.setCenter(polyline.getPath().getAt(0));
        //map.setCenter(startLocation.latlng);
        marker = new google.maps.Marker({
            position: polyline.getPath().getAt(0),
            map: map,
            icon: icon
        });

        poly2 = new google.maps.Polyline({
            path: [polyline.getPath().getAt(0)],
            strokeColor: "#0000FF",
            strokeWeight: 10
        });
        var watchID = navigator.geolocation.watchPosition(onSuccess, onError, { timeout: 30000 });
        setTimeout(animate(50), 2000); // Allow time for the initial map display
    }
    // google.maps.event.addDomListener(window, 'load', initialize);

    //=============== ~animation funcitons =====================

    var car = "M17.402,0H5.643C2.526,0,0,3.467,0,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759c3.116,0,5.644-2.527,5.644-5.644 V6.584C23.044,3.467,20.518,0,17.402,0z M22.057,14.188v11.665l-2.729,0.351v-4.806L22.057,14.188z M20.625,10.773 c-1.016,3.9-2.219,8.51-2.219,8.51H4.638l-2.222-8.51C2.417,10.773,11.3,7.755,20.625,10.773z M3.748,21.713v4.492l-2.73-0.349 V14.502L3.748,21.713z M1.018,37.938V27.579l2.73,0.343v8.196L1.018,37.938z M2.575,40.882l2.218-3.336h13.771l2.219,3.336H2.575z M19.328,35.805v-7.872l2.729-0.355v10.048L19.328,35.805z";
    var icon = {
        path: car,
        scale: .7,
        strokeColor: 'white',
        strokeWeight: .10,
        fillOpacity: 1,
        fillColor: '#404040',
        offset: '5%',
        // rotation: parseInt(heading[i]),
        anchor: new google.maps.Point(10, 25) // orig 10,50 back of car, 10,0 front of car, 10,25 center of car
    };


    // === first support methods that don't (yet) exist in v3
    google.maps.LatLng.prototype.distanceFrom = function (newLatLng) {
        var EarthRadiusMeters = 6378137.0; // meters
        var lat1 = this.lat();
        var lon1 = this.lng();
        var lat2 = newLatLng.lat();
        var lon2 = newLatLng.lng();
        var dLat = (lat2 - lat1) * Math.PI / 180;
        var dLon = (lon2 - lon1) * Math.PI / 180;
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = EarthRadiusMeters * c;
        return d;
    }

    google.maps.LatLng.prototype.latRadians = function () {
        return this.lat() * Math.PI / 180;
    }

    google.maps.LatLng.prototype.lngRadians = function () {
        return this.lng() * Math.PI / 180;
    }

    // === A method which returns the length of a path in metres ===
    google.maps.Polygon.prototype.Distance = function () {
        var dist = 0;
        for (var i = 1; i < this.getPath().getLength(); i++) {
            dist += this.getPath().getAt(i).distanceFrom(this.getPath().getAt(i - 1));
        }
        return dist;
    }

    // === A method which returns a GLatLng of a point a given distance along the path ===
    // === Returns null if the path is shorter than the specified distance ===
    google.maps.Polygon.prototype.GetPointAtDistance = function (metres) {
        // some awkward special cases
        if (metres == 0) return this.getPath().getAt(0);
        if (metres < 0) return null;
        if (this.getPath().getLength() < 2) return null;
        var dist = 0;
        var olddist = 0;
        for (var i = 1;
            (i < this.getPath().getLength() && dist < metres); i++) {
            olddist = dist;
            dist += this.getPath().getAt(i).distanceFrom(this.getPath().getAt(i - 1));
        }
        if (dist < metres) {
            return null;
        }
        var p1;
        if (i >= 2) {
            p1 = this.getPath().getAt(i - 2);
        }
        var p2 = this.getPath().getAt(i - 1);
        var m = (metres - olddist) / (dist - olddist);
        if (p1)
            return new google.maps.LatLng(p1.lat() + (p2.lat() - p1.lat()) * m, p1.lng() + (p2.lng() - p1.lng()) * m);
        else
            return null;
    }

    // === A method which returns an array of GLatLngs of points a given interval along the path ===
    google.maps.Polygon.prototype.GetPointsAtDistance = function (metres) {
        var next = metres;
        var points = [];
        // some awkward special cases
        if (metres <= 0) return points;
        var dist = 0;
        var olddist = 0;
        for (var i = 1;
            (i < this.getPath().getLength()); i++) {
            olddist = dist;
            dist += this.getPath().getAt(i).distanceFrom(this.getPath().getAt(i - 1));
            while (dist > next) {
                var p1 = this.getPath().getAt(i - 1);
                var p2 = this.getPath().getAt(i);
                var m = (next - olddist) / (dist - olddist);
                points.push(new google.maps.LatLng(p1.lat() + (p2.lat() - p1.lat()) * m, p1.lng() + (p2.lng() - p1.lng()) * m));
                next += metres;
            }
        }
        return points;
    }

    // === A method which returns the Vertex number at a given distance along the path ===
    // === Returns null if the path is shorter than the specified distance ===
    google.maps.Polygon.prototype.GetIndexAtDistance = function (metres) {
        // some awkward special cases
        if (metres == 0) return this.getPath().getAt(0);
        if (metres < 0) return null;
        var dist = 0;
        var olddist = 0;
        for (var i = 1;
            (i < this.getPath().getLength() && dist < metres); i++) {
            olddist = dist;
            dist += this.getPath().getAt(i).distanceFrom(this.getPath().getAt(i - 1));
        }
        if (dist < metres) {
            return null;
        }
        return i;
    }
    // === Copy all the above functions to GPolyline ===
    google.maps.Polyline.prototype.Distance = google.maps.Polygon.prototype.Distance;
    google.maps.Polyline.prototype.GetPointAtDistance = google.maps.Polygon.prototype.GetPointAtDistance;
    google.maps.Polyline.prototype.GetPointsAtDistance = google.maps.Polygon.prototype.GetPointsAtDistance;
    google.maps.Polyline.prototype.GetIndexAtDistance = google.maps.Polygon.prototype.GetIndexAtDistance;



    initialize();



    $scope.doRefresh = function () {
        initialize();
        $scope.$broadcast('scroll.refreshComplete');
    }
});