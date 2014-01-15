'use strict';

angular.module('vksetupApp')
	.controller('RfcdListCtrl', [
		'Rfcd',
		'$scope',
		'$rootScope',
		'$injector',
		function (
			Rfcd,
			$scope,
			$rootScope,
			$injector
		){

			$rootScope.navigationpath = ['home','rfcds'];

			var queryRfcds = function(){
				$rootScope.spinner = 'Loading RF receivers';
				Rfcd.query(function(data){
					$scope.rfcds = data;
					delete $rootScope.spinner;
				});
			}
			$scope.deleteRfcd = function(rfcd){
				if (window.confirm('Delete RF receiver?')) {
					Rfcd.delete({rfcdId: rfcd._id}, function(){
						queryRfcds();
					});
				}
			}
			queryRfcds();

	}]);
