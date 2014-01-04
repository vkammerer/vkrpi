'use strict';

angular.module('vksetupApp')
	.directive('layoutmobile', function () {
		return {
			templateUrl: 'views/layout/mobile.html',
			restrict: 'E',
			controller : function($scope){},
			link: function(scope, element, attrs) {}
		};
	});
