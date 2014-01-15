'use strict';

angular.module('vksetupApp')
	.controller('RfcdEditCtrl', [
		'Rfcd',
		'$scope',
		'$rootScope',
		'$routeParams',
		'utils',
		function (
			Rfcd,
			$scope,
			$rootScope,
			$routeParams,
			utils
		){

			var rfcdId = $routeParams.rfcdId || "";
			$rootScope.navigationpath = ['home','rfcds'];

			if (rfcdId) {
				$rootScope.spinner = 'Loading RF receiver';
				Rfcd.get({rfcdId:rfcdId}, function(rfcd){
					delete $rootScope.spinner;
					$scope.rfcd = rfcd;
					$rootScope.navigationpath = ['home','rfcds',{
						ref : 'show',
						name : rfcd.name,
						url: '/#/rfcd/' + rfcd._id + '/show'
					},'edit'];
				})
			}

			$scope.updateRfcd = function(rfcd){
				$rootScope.spinner = 'Updating RF receiver';
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
