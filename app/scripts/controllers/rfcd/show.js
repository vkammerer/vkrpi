'use strict';

angular.module('vksetupApp')
	.controller('RfcdShowCtrl', [
		'Rfcd',
		'$scope',
		'$rootScope',
		'$location',
		'$routeParams',
		function (
			Rfcd,
			$scope,
			$rootScope,
			$location,
			$routeParams
		){

			$rootScope.navigationpath = ['home','rfcds'];

			var rfcdId = $routeParams.rfcdId || "";
			var rfcdSocket;

			var queryRfcd = function(rfcdId){
				$rootScope.spinner = 'Loading rfcd';
				Rfcd.get({rfcdId:rfcdId}, function(rfcd){
					delete $rootScope.spinner;
					$scope.rfcd = rfcd;

					rfcdSocket = (rfcd.gpio.rpi.mode == 'client') ? window.VK_APP.sockets[rfcd.gpio.rpi.user] : window.VK_APP.sockets[rfcd.gpio.rpi._id];

					$rootScope.navigationpath = ['home','rfcds',{
						ref : 'show',
						name : rfcd.name,
						url: ''
					}];
				})
			}
			if (rfcdId) {
				queryRfcd(rfcdId);
			}

			$scope.deleteRfcd = function(rfcd){
				if (window.confirm('Delete device?')) {
					Rfcd.delete({rfcdId: rfcd._id}, function(){
						$location.path('/rfcds');
					});
				}
			}

			$scope.rfcdOutput = function(rfcd, status){
				rfcdSocket.emit('rfcdOutput', {
					rfcd:rfcd,
					status:status
				})
			};

			$scope.disConnectRfcd = function(rfcd){
				setTimeout(function(){window.VK_APP.sockets[rfcd._id].disconnect()}, 0);
			};
	}]);
