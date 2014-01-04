'use strict';

angular.module('vksetupApp')
	.factory('initialisation', [
		'$rootScope',
		'$location',
		'$route',
		'utils',
		function(
			$rootScope,
			$location,
			$route,
			utils
		){

			var toReturn = {
				removeLoader : function (){
					angular.element(document.getElementById('siteloader')).remove();
				},
				initIsMobileReloadOnWindowResize : function (){
					var isMobile = function(){
						return window.innerWidth < $rootScope.constants.DESKTOP_MIN_WIDTH;
					};
					var reloadOnIsMobile = function(){
						var isLastMobile = isMobile();
						if ($rootScope.state.isMobile !== isLastMobile) {
							$rootScope.state.isMobile = isLastMobile;
							$route.reload();
						}
					}
					$rootScope.state.isMobile = isMobile();
					window.onresize = reloadOnIsMobile;
				},
				initRedirectionListener : function(){
					$rootScope.$on("$routeChangeError", function (event, nextLocation, currentLocation, rejection) {

						var errorMessage = !rejection ? 'No access to this page' : 'No access to this page: ' + rejection;
						var alertData = { type: 'danger', msg: errorMessage};
						$rootScope.alerts.push(alertData);

						if(currentLocation && currentLocation.$$route && currentLocation.$$route.originalPath) {
							$location.path(currentLocation.$$route.originalPath)
						}
					})
				}
			}

			return toReturn;

	}]);
