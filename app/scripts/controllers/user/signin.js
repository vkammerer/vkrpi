'use strict';

angular.module('vksetupApp')
	.controller('UserSigninCtrl',[
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

	    $rootScope.navigationpath = ['home','usersignin'];

			$scope.signIn = function(user){

				$rootScope.spinner = 'Signin in';

				$http.post($rootScope.constants.API_URL + '/users/session', user)
					.success(function(data){
						var alertData = { type: 'success', msg: 'Login successfull' };
						$rootScope.alerts = [alertData];

		        $http.get($rootScope.constants.API_URL + '/users/me')
		          .success(function(user){
		            $rootScope.user = user;
		            $location.path('/')
								delete $rootScope.spinner;
		          })
		          .error(function(){
		            delete $rootScope.user;
								delete $rootScope.spinner;
		          });
					})
					.error(function(data){
            delete $rootScope.spinner;
            if (data.errors) {
              utils.onApiError(data.errors);
            }
            else {
              var alertData = { type: 'danger', msg: 'Cannot session' };
              $rootScope.alerts.push(alertData);                        
            }
					})
			};
	}]);