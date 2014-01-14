'use strict';

angular.module('vksetupApp')
	.controller('RpiListCtrl', [
		'Rpi',
		'$scope',
		'$rootScope',
		'$injector',
		function (
			Rpi,
			$scope,
			$rootScope,
			$injector
		){

			$rootScope.navigationpath = ['home','rpis'];

			var queryRpis = function(){
				$rootScope.spinner = 'Loading devices';
				Rpi.query(function(data){
					$scope.rpis = data;
					delete $rootScope.spinner;
				});
			}
			$scope.deleteRpi = function(rpi){
				if (window.confirm('Delete device?')) {
					Rpi.delete({rpiId: rpi._id}, function(){
						queryRpis();
					});
				}
			}
			queryRpis();

	}]);
