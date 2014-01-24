'use strict';

angular.module('vksetupApp')
	.controller('RfcdEditCtrl', [
		'Rfcd',
		'Rpi',
		'$scope',
		'$rootScope',
		'$routeParams',
		'$q',
		'utils',
		function (
			Rfcd,
			Rpi,
			$scope,
			$rootScope,
			$routeParams,
			$q,
			utils
		){

			var rfcdId = $routeParams.rfcdId || "";
			$rootScope.navigationpath = ['home','rfcds'];

			$rootScope.spinner = 'Loading pins and RF receiver';

			var rpisDefer = $q.defer();

			Rpi.query(function(data){
				rpisDefer.resolve(data);
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

			$q.all([rpisDefer.promise, rfcdDefer.promise]).then(function(results){
				$scope.rfcd = results[1];
				$scope.rpis = results[0];
				delete $rootScope.spinner;
			})

			$scope.updateRfcd = function(rfcd){
				$rootScope.spinner = 'Updating RF receiver';
				if (typeof(rfcd.rpi) === 'object') {
					rfcd.rpi = rfcd.rpi._id
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
