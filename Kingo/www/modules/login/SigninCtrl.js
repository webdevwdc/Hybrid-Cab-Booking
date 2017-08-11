
app.controller('SigninCtrl', function ($scope, $stateParams, ionicMaterialInk, $timeout, authService, $state, ionicMaterialMotion, $rootScope,AuthFactory) {
    //ionic.material.ink.displayEffect();
    ionicMaterialInk.displayEffect();
    ionicMaterialMotion.ripple();

    // Toggle Code Wrapper
    var code = document.getElementsByClassName('code-wrapper');
    for (var i = 0; i < code.length; i++) {
        code[i].addEventListener('click', function () {
            this.classList.toggle('active');
        });
    }

    $scope.emailFormat = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/;
   

$scope.facebookSignIn=function()
{
   Auth.$authWithOAuthRedirect('facebook').then(function(authData) {
    }).catch(function(error) {
      if (error.code === 'TRANSPORT_UNAVAILABLE') {
        Auth.$authWithOAuthPopup(facebook).then(function(authData) {
        });
      } else {
        console.log(error);
      }
    }); 
}
});