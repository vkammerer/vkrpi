'use strict';

angular.module('vksetupApp')
  .factory('state', function () {

    var toReturn = {
      isMobile : null,
      isUserSignedinServer : null
    };

    return toReturn;

  });
