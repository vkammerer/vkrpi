'use strict';

angular.module('vksetupApp')
	.controller('GpioShowCtrl', [
		'Gpio',
		'$scope',
		'$rootScope',
		'$location',
		'$routeParams',
		function(
			Gpio,
			$scope,
			$rootScope,
			$location,
			$routeParams
		){

			var gpioId = $routeParams.gpioId || "";
			var gpioSocket;

			var queryGpio = function(gpioId){
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
			if (gpioId) {
				queryGpio(gpioId)
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
/*
				gpioSocket.emit('powerSwitchOutput', {
					rpi:gpio.rpi._id,
					value:gpio.value,
					pin:gpio.pin,
					powerSwitchMessage : "323 969 323 969 323 969 969 323 323 969 969 323 323 969 969 323 323 969 323 969 323 969 969 323 323 969 969 323 323 969 969 323 323 969 969 323 323 969 969 323 323 969 969 323 323 969 969 323 323 10982"
				})
*/

				gpioSocket.emit('gpioOutput', {
					rpi:gpio.rpi._id,
					value:gpio.value,
					pin:gpio.pin
				})
			};

			$scope.deleteGpio = function(gpio){
				if (window.confirm('Delete pin?')) {
					Gpio.delete({gpioId: gpio._id}, function(){
						$location.path('/rpi/' + gpio.rpi._id + '/show');
					});
				}
			}

	}]);
