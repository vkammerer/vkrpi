'use strict';

angular.module('vksetupApp')
  .controller('GpioShowCtrl', [
    'Gpio',
    '$scope',
    '$rootScope',
    '$routeParams',
    function(
      Gpio,
      $scope,
      $rootScope,
      $routeParams
    ){

      var gpioId = $routeParams.gpioId || "";
      var gpioSocket;

    	if (gpioId) {
        $rootScope.spinner = 'Loading gpio';
    		Gpio.get({gpioId:gpioId}, function(gpio){
          delete $rootScope.spinner;

    			$scope.gpio = gpio;
          gpioSocket = (gpio.rpi.mode == 'client') ? window.VK_APP.sockets[gpio.rpi.user] : window.VK_APP.sockets[gpio.rpi._id];

          $rootScope.navigationpath = ['home','rpis',{
              ref : 'show',
              name : gpio.rpi.name,
              url: '/#/rpi/' + gpio.rpi._id + '/show'
            },{
              ref : 'show',
              name : gpio.name,
              url: ''
            }];
    		})
    	}
      $scope.initGpioInput = function(gpio){
        $scope.gpio.value = '...';
        gpioSocket.emit('initGpioInput', {
          rpi:gpio.rpi._id,
          pin:gpio.pin
        })
        gpioSocket.on('gpioInput', function(data){
          $scope.gpio.value = data.value;
          $scope.$apply()
        })
      };
  		$scope.gpioOutput = function(gpio){
        gpioSocket.emit('gpioOutput', {
          rpi:gpio.rpi._id,
          value:gpio.value,
          pin:gpio.pin
        })
  		};
  }]);
