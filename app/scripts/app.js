'use strict';

angular.module('vksetupApp', [
	'ngRoute',
	'ngResource',
	'ui.bootstrap',
	'angular-gestures',
	'ngAnimate'
])
.config([
	'$routeProvider',
	'$httpProvider',
	function(
		$routeProvider,
		$httpProvider
	){

		$httpProvider.interceptors.push('UserStatusInterceptor');
		$httpProvider.interceptors.push('ClientSpeedInterceptor');

		var isUserSignedinLocal = function($injector){
			return $injector.get('UserStatus').isUserSignedinLocal();
		};
		var isUserSignedoutLocal = function($injector){
			return $injector.get('UserStatus').isUserSignedoutLocal();
		};

		$routeProvider
			.when('/', {
				templateUrl: 'views/home.html',
				controller: 'HomeCtrl'
			})
			.when('/user/signin', {
				templateUrl: 'views/user/signin.html',
				controller: 'UserSigninCtrl',
				resolve : {
					condition : isUserSignedoutLocal
				}
			})
			.when('/user/signup', {
				templateUrl: 'views/user/signup.html',
				controller: 'UserSignupCtrl',
				resolve : {
					condition : isUserSignedoutLocal
				}
			})
			.when('/user/edit', {
				templateUrl: 'views/user/edit.html',
				controller: 'UserEditCtrl',
				resolve : {
					condition : isUserSignedinLocal
				}
			});
	}
])
.run([
	'$rootScope',
	'utils',
	'constants',
	'state',
	'initialisation',
	'UserStatus',
	function(
		$rootScope,
		utils,
		constants,
		state,
		initialisation,
		UserStatus
	){

		window.VK_APP = {
			sockets : {}
		};

		$rootScope.utils = utils.rootScope;
		$rootScope.constants = constants;
		$rootScope.state = state;
		$rootScope.alerts = [];

		initialisation.removeLoader();
		initialisation.initRedirectionListener();
		initialisation.initIsMobileReloadOnWindowResize();
		UserStatus.isUserSignedinLocal();

	}
]);
