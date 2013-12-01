'use strict';

angular.module('vksetupApp')
  .controller('GpioCreateCtrl', [
  	'Rpi',
  	'Gpio',
  	'$scope',
  	'$rootScope',
  	'$location',
    'utils',
  	function (
  		Rpi,
  		Gpio,
  		$scope,
  		$rootScope,
  		$location,
      utils
  	){

      $rootScope.navigationpath = ['home','gpios','create'];

      $rootScope.spinner = 'Loading devices';
	  	Rpi.query(function(data){
        delete $rootScope.spinner;
	  		$scope.rpis = data;
	  	});

	    $scope.addGpio = function(gpio){
	    	var thisGpio = new Gpio(gpio);
	      $rootScope.spinner = 'Creating pin';
		  	thisGpio.$save(function(data) {
		        delete $rootScope.spinner;
						var alertData = { type: 'success', msg: 'Pin successfully created' };
						$rootScope.alerts.push(alertData);
						$scope.gpio = {};
          },
          function(response){
            var data = response.data;
            delete $rootScope.spinner;
            if (data.errors) {
              utils.onApiError(data.errors);
            }
            else {
              var alertData = { type: 'danger', msg: 'Cannot create' };
              $rootScope.alerts.push(alertData);                        
            }
          }
        );
	    };
	  }
  ]);
