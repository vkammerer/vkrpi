'use strict';

angular.module('vksetupApp')
  .config([
  '$routeProvider',
  function (
    $routeProvider
  ){
    var isUserSignedinLocal = function($injector){
      return $injector.get('UserStatus').isUserSignedinLocal();
    }
    var isUserSignedoutLocal = function($injector){
      return $injector.get('UserStatus').isUserSignedoutLocal();
    }
    $routeProvider
      .when('/gpios', {
        templateUrl: 'views/gpio/all.html',
        controller: 'GpioListCtrl',
        resolve : {
          condition : isUserSignedinLocal
        }
      })
      .when('/gpio/create', {
        templateUrl: 'views/gpio/create.html',
        controller: 'GpioCreateCtrl',
        resolve : {
          condition : isUserSignedinLocal
        }
      })
      .when('/gpio/:gpioId/show', {
        templateUrl: 'views/gpio/show.html',
        controller: 'GpioShowCtrl',
        resolve : {
          condition : isUserSignedinLocal
        }
      })
      .when('/gpio/:gpioId/edit', {
        templateUrl: 'views/gpio/edit.html',
        controller: 'GpioEditCtrl',
        resolve : {
          condition : isUserSignedinLocal
        }
      })
  }]);
