app.controller('AppCtrl', function ($scope, $stateParams, ionicMaterialInk, $ionicPopup, $timeout, $state, $rootScope, $ionicLoading) {
    //ionic.material.ink.displayEffect();
    ionicMaterialInk.displayEffect();

    // Toggle Code Wrapper
    var code = document.getElementsByClassName('code-wrapper');
    for (var i = 0; i < code.length; i++) {
        code[i].addEventListener('click', function () {
            this.classList.toggle('active');
        });
    }



    $scope.goToSignUp = function () {
        $state.go('signup', {}, { reload: true });
    }

    $scope.goToSignIn = function () {
        $state.go('signin', {}, { reload: true });
    }


    $rootScope.showLoading = function () {
        $ionicLoading.show({
            template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>'
        });
    }

    $rootScope.hideLoading = function () {
        $ionicLoading.hide();
    }

    $rootScope.showAlert = function () {
        var alertPopup = $ionicPopup.alert({
            title: 'You are now my subscribed to Cat Facts',
            template: 'You will meow receive fun daily facts about CATS!'
        });

        $timeout(function () {
            ionicMaterialInk.displayEffect();
        }, 0);
    };
});