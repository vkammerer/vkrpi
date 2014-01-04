'use strict';

angular.module('vksetupApp')
	.controller('RpiCreateCtrl', [
		'Rpi',
		'$scope',
		'$rootScope',
		'$location',
		'utils',
		function (
			Rpi,
			$scope,
			$rootScope,
			$location,
			utils
		){

			$rootScope.navigationpath = ['home','rpis','create'];

			$scope.addRpi = function(rpi){
				$rootScope.spinner = 'Creating GPIO';
				var thisRpi = new Rpi(rpi);
				thisRpi.$save(
					function(data){
						delete $rootScope.spinner;
						var alertData = { type: 'success', msg: 'GPIO successfully created' };
						$rootScope.alerts.push(alertData);
						$scope.rpi = {};
					},
					function(response){
						var data = response.data;
						delete $rootScope.spinner;
						if (data.errors) {
							utils.onApiError(data.errors);
						}
						else {
							var alertData = { type: 'danger', msg: 'Cannot create' };
							$rootScope.alerts.push(alertData);
						}
					}
				);
			};
	}]);
