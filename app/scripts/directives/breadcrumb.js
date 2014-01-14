'use strict';

angular.module('vksetupApp')
	.directive('breadcrumb', [
		'$rootScope',
		'architecture',
		function (
			$rootScope,
			architecture
		){
			return {
				templateUrl: 'views/breadcrumb.html',
				restrict: 'E',
				controller : function($scope){
					$rootScope.breadcrumb = [];
					$rootScope.$watch('navigationpath', function(){
						generateBreadcrumb(architecture);
					});

					var generateBreadcrumb = function(navpath) {

						var thisBreadcrumb = [];

						for (var i in $rootScope.navigationpath) {
							if (typeof($rootScope.navigationpath[i]) === 'string') {
								thisBreadcrumb.push({
									name: navpath[$rootScope.navigationpath[i]].name,
									url: navpath[$rootScope.navigationpath[i]].url
								});
								navpath = navpath[$rootScope.navigationpath[i]].children;
							}
							else {
								thisBreadcrumb.push({
									name: $rootScope.navigationpath[i].name,
									url: $rootScope.navigationpath[i].url
								});
								navpath = navpath[$rootScope.navigationpath[i].ref].children;
							}
						}
						$rootScope.breadcrumb = thisBreadcrumb;
					};
				},
				link: function(scope, element, attrs) {}
			};
		}
	]);
