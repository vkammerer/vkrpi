'use strict';

angular.module('vksetupApp')
	.directive('layoutdesktop', function () {
		return {
			templateUrl: 'views/layout/desktop.html',
			restrict: 'E',
			controller : function($scope){},
			link: function(scope, element, attrs) {}
		};
	});
