'use strict';

angular.module('vksetupApp')
	.directive('alerts', [
		'$rootScope',
		'$timeout',
		function (
			$rootScope,
			$timeout
		){
			return {
				templateUrl: 'views/alerts.html',
				restrict: 'E',
				controller : function($scope){},
				link: function(scope, element, attrs) {
					scope.alertLength = 0;

					var updateAlerts = function(){
						var isAlertsNotEmpty = ($rootScope.alerts.length === 0) ? false : true;
						scope.extended = isAlertsNotEmpty;
						var difference = $rootScope.alerts.length - scope.alertLength;
						if (isAlertsNotEmpty) {
							window.scrollTo(0,0);
							document.querySelector('.snap-content > div').scrollTop = 0;
							$timeout(function(){
								$rootScope.alerts.splice(0,difference);
							}, 5000);
						}
						scope.alertLength = $rootScope.alerts.length;
					};

					$rootScope.$watch(function() { return $rootScope.alerts.length; }, function() {
						updateAlerts();
					});
					updateAlerts();
				}
			};
		}
	]);
