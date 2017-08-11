(function() {
  'use strict';

  angular
    .module('arnaudspanneut.ionicPushNotifications', [])
    .provider('pushNotification', pushNotificationProvider);

  function pushNotificationProvider() {
    var PUSH_CONFIG = null;

    /**
    * Set Config for push notification plugin.
    */
    this.setConfig = setConfig;

    function setConfig(config) {
      PUSH_CONFIG = config;
    }

    this.$get = pushNotificationService;
    
    pushNotificationService.$inject = ['$q', '$log', '$window'];
    function pushNotificationService($q, $log, $window) {
      var deviceDefer = $q.defer();
      var methods = {};

      methods.getDeviceToken = getDeviceTokenNotification;
      methods.register = registerNotification;

      /**
      * Get push token of device.
      * 
      * @returns {Object} Promise of notification device.
      */
      function getDeviceTokenNotification() {
        return deviceDefer.promise;
      }

      /**
      * Register phone to push notification service.
      * 
      * @returns {Object} Push instance.
      */
      function registerNotification() {
        var push = PushNotification.init(PUSH_CONFIG);

        // Listen push notification received.
        push.on('registration', listenerNotification);

        return push;

        function listenerNotification(data) {
          deviceDefer.resolve(data.registrationId);
          $log.debug('[Notification] Register SUCCESS :', data);
        }
      }

      return methods;
    };
  }
}());
