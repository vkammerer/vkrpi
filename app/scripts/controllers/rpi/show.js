'use strict';

angular.module('vksetupApp')
  .controller('RpiShowCtrl', [
    'Rpi',
    'Gpio',
    '$scope',
    '$rootScope',
    '$routeParams',
    function (
      Rpi,
      Gpio,
      $scope,
      $rootScope,
      $routeParams
    ){

    	var rpiId = $routeParams.rpiId || "";
      $rootScope.navigationpath = ['home','rpis'];

    	if (rpiId) {
        $rootScope.spinner = 'Loading rpi';
    		Rpi.get({rpiId:rpiId}, function(rpi){
          delete $rootScope.spinner;
    			$scope.rpi = rpi;
          $rootScope.navigationpath = ['home','rpis',{
            ref : 'show',
            name : rpi.name,
            url: ''
          }];
    		})
    	}

  		$scope.connectRpi = function(rpi){
        if (window.VK_APP.sockets[rpi._id] && !window.VK_APP.sockets[rpi._id].socket.connected) {
          window.VK_APP.sockets[rpi._id].socket.reconnect();
        }
        else {
          window.VK_APP.sockets[rpi._id] = io.connect($rootScope.constants.ROOT_URL, {
            'resource' : 'rpisocket',
            'query': 'user=' + $rootScope.user._id + '&targetrpi=' + rpi._id,
            'force new connection': true
          });
          window.VK_APP.sockets[rpi._id].on('connect', function (socket, args){
            $scope.$apply()
          })
          window.VK_APP.sockets[rpi._id].on('disconnect', function (socket, args){
            $scope.$apply()
          })
        }
  		};
      $scope.deleteGpio = function(gpio){
        if (window.confirm('Delete pin?')) { 
          Gpio.delete({gpioId: gpio._id}, function(){
            queryGpios();
          });
        }
      }

      $scope.disConnectRpi = function(rpi){
        setTimeout(function(){window.VK_APP.sockets[rpi._id].disconnect()}, 0);
      };
  }]);
