'use strict';

angular.module('vksetupApp')
	.controller('RfcdEditCtrl', [
		'Rfcd',
		'Gpio',
		'$scope',
		'$rootScope',
		'$routeParams',
		'$q',
		'utils',
		function (
			Rfcd,
			Gpio,
			$scope,
			$rootScope,
			$routeParams,
			$q,
			utils
		){

			var rfcdId = $routeParams.rfcdId || "";
			$rootScope.navigationpath = ['home','rfcds'];

			$rootScope.spinner = 'Loading pins and RF receiver';

			var gpiosDefer = $q.defer();

			Gpio.query(function(data){
				gpiosDefer.resolve(data);
			});

			var rfcdDefer = $q.defer();

			if (rfcdId) {
				$rootScope.spinner = 'Loading RF receiver';
				Rfcd.get({rfcdId:rfcdId}, function(rfcd){
					$rootScope.navigationpath = ['home','rfcds',{
						ref : 'show',
						name : rfcd.name,
						url: '/#/rfcd/' + rfcd._id + '/show'
					},'edit'];
					rfcdDefer.resolve(rfcd);
				})
			}

			$q.all([gpiosDefer.promise, rfcdDefer.promise]).then(function(results){
				$scope.rfcd = results[1];
				$scope.gpios = results[0];
				delete $rootScope.spinner;
			})

			$scope.updateRfcd = function(rfcd){
				$rootScope.spinner = 'Updating RF receiver';
				if (typeof(rfcd.gpio) === 'object') {
					rfcd.gpio = rfcd.gpio._id
				}
				var thisRfcd = new Rfcd(rfcd);
				thisRfcd.$update({rfcdId:rfcd._id}, function(data){
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
