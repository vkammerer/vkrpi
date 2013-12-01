'use strict';

angular.module('vksetupApp')
  .factory('constants', function () {

    var toReturn = {};

    if (window.location.protocol == 'file:') {
      toReturn.ROOT_URL = 'http://vksetup.herokuapp.com';
//      toReturn.API_URL_NGRESOURCE = toReturn.ROOT_URL + ':' + window.location.port;
      toReturn.API_URL = toReturn.ROOT_URL + '/api';
    }
    else {
      // Fixing IE
      if (!window.location.origin) {
        window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
      }
      toReturn.ROOT_URL = window.location.origin;
//      toReturn.API_URL_NGRESOURCE = toReturn.ROOT_URL + ':' + window.location.port;
      toReturn.API_URL = toReturn.ROOT_URL + '/api';
    }
    toReturn.snapOpts = {
      transitionSpeed: 0.3
    }

    toReturn.MIN_TIME_DISPLAY_SPINNER = 200;
    toReturn.DESKTOP_MIN_WIDTH = 768;

    return toReturn;

  });
