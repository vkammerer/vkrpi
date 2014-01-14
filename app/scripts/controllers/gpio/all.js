'use strict';

angular.module('vksetupApp')
	.controller('GpioListCtrl', [
		'Gpio',
		'$scope',
		'$rootScope',
		'$injector',
		function (
			Gpio,
			$scope,
			$rootScope,
			$injector
		){

			$rootScope.navigationpath = ['home','gpios'];

			var queryGpios = function(){
				$rootScope.spinner = 'Loading pins';
				Gpio.query(function(data){
					delete $rootScope.spinner;
					$scope.gpios = data;
				});
			}
			$scope.deleteGpio = function(gpio){
				if (window.confirm('Delete pin?')) {
					Gpio.delete({gpioId: gpio._id}, function(){
						queryGpios();
					});
				}
			}
			queryGpios();

	}]);
