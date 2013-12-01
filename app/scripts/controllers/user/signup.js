'use strict';

angular.module('vksetupApp')
	.controller('UserSignupCtrl',[
		'$scope',
		'$rootScope',
		'$http',
		'$location',
		'utils',
		function (
			$scope,
			$rootScope,
			$http,
			$location,
			utils
		){

			$rootScope.navigationpath = ['home','usersignup'];

			$scope.signUp = function(user){

			  $rootScope.spinner = 'Signin up';

			  $http.post($rootScope.constants.API_URL + '/users', user)
					.success(function(data){
						delete $rootScope.spinner;
						$rootScope.user = user;
						var alertData = { type: 'success', msg: 'User successfully created' };
						$rootScope.alerts.push(alertData);
						$location.path('/')
					})
					.error(function(data){
						delete $rootScope.spinner;
						if (data.errors) {
							utils.onApiError(data.errors);
						}
						else {
							var alertData = { type: 'danger', msg: 'Signup failure' };
							$rootScope.alerts.push(alertData);                        
						}
					})
			}
  }]);
