'use strict';

angular.module('vksetupApp')
  .directive('social', function () {
    return {
      templateUrl: 'views/user/social.html',
      restrict: 'E',
      controller : function($scope){},
      link: function(scope, element, attrs) {}
    };
  });
