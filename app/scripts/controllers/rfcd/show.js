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
				$rootScope.spinner = 'Loading RF receiver';
				Rfcd.get({rfcdId:rfcdId}, function(rfcd){
					delete $rootScope.spinner;
					$scope.rfcd = rfcd;

					$rootScope.navigationpath = ['home','rfcds',{
						ref : 'show',
						name : rfcd.name,
						url: ''
					}];

					rfcdSocket = (rfcd.rpi.mode == 'client') ? window.VK_APP.sockets[rfcd.rpi.user] : window.VK_APP.sockets[rfcd.rpi._id];

				})
			}
			if (rfcdId) {
				queryRfcd(rfcdId);
			}

			$scope.deleteRfcd = function(rfcd){
				if (window.confirm('Delete RF receiver?')) {
					Rfcd.delete({rfcdId: rfcd._id}, function(){
						$location.path('/rfcds');
					});
				}
			}

			$scope.rfcdOutput = function(rfcd, status){
				rfcdSocket.emit('rfcdOutput', {
					rfcd:rfcd,
					status:status
				});
			};

			$scope.disConnectRfcd = function(rfcd){
				setTimeout(function(){window.VK_APP.sockets[rfcd._id].disconnect()}, 0);
			};
	}]);
