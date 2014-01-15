'use strict';

angular.module('vksetupApp')
	.controller('GpioEditCtrl', [
		'Gpio',
		'$scope',
		'$rootScope',
		'$routeParams',
		'utils',
		function (
			Gpio,
			$scope,
			$rootScope,
			$routeParams,
			utils
		){

			var gpioId = $routeParams.gpioId || "";

			if (gpioId) {
				$rootScope.spinner = 'Loading pin';
				Gpio.get({gpioId:gpioId}, function(gpio){
					delete $rootScope.spinner;
					$scope.gpio = gpio;

					$rootScope.navigationpath = ['home','rpis',{
							ref : 'show',
							name : gpio.rpi.name,
							url: '/#/rpi/' + gpio.rpi._id + '/show'
						},{
							ref : 'show',
							name : gpio.name,
							url: '/#/gpio/' + gpio._id + '/show'
						},'edit'];

				})
			}
			$scope.updateGpio = function(gpio){
				$rootScope.spinner = 'Updating pin';
				var thisGpio = new Gpio(gpio);
				thisGpio.$update({gpioId:gpio._id}, function(data){
						delete $rootScope.spinner;
						var alertData = { type: 'success', msg: 'Update successfull' };
						$rootScope.alerts.push(alertData);
					},
					function(response){
						var data = response.data;
						delete $rootScope.spinner;
						if (data.errors) {
							utils.onApiError(data.errors);
						}
						else {
							var alertData = { type: 'danger', msg: 'Cannot update' };
							$rootScope.alerts.push(alertData);
						}
					}
				);
			};
	}]);
