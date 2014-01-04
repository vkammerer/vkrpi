'use strict';

angular.module('vksetupApp')
	.directive('navigationdesktop', [
		'$rootScope',
		'$http',
		'$location',
		function (
			$rootScope,
			$http,
			$location
		){
			return {
				templateUrl: 'views/navigation/desktop.html',
				restrict: 'E',
				controller : function($scope){
				},
				link: function(scope, element, attrs) {
					$rootScope.$watch('user', function(){
					});
					$rootScope.$on("$routeChangeSuccess", function (event, nextLocation, currentLocation, rejection) {
					});
					scope.logout = function () {
						$http.get($rootScope.constants.API_URL + '/users/signout')
							.success(function(data){
								delete $rootScope.user;
								$location.path('/user/signin')
							})
							.error(function(data){
								alert(data.message)
							})
					}
				}
			};
	}]);
