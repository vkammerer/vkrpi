'use strict';

angular.module('vksetupApp')
	.controller('RfcdCreateCtrl', [
		'Rfcd',
		'Rpi',
		'$scope',
		'$rootScope',
		'$location',
		'utils',
		function (
			Rfcd,
			Rpi,
			$scope,
			$rootScope,
			$location,
			utils
		){

			$rootScope.navigationpath = ['home','rfcds','create'];

			$rootScope.spinner = 'Loading pins';
			Rpi.query(function(data){
				delete $rootScope.spinner;
				$scope.rpis = data;
			});

			$scope.addRfcd = function(rfcd){
				$rootScope.spinner = 'Creating RF receiver';
				var thisRfcd = new Rfcd(rfcd);
				thisRfcd.$save(
					function(data){
						delete $rootScope.spinner;
						var alertData = { type: 'success', msg: 'RF receiver successfully created' };
						$rootScope.alerts.push(alertData);
						$scope.rfcd = {};
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
