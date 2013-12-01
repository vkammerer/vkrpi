'use strict';

angular.module('vksetupApp')
  .controller('RpiEditCtrl', [
    'Rpi',
    '$scope',
    '$rootScope',
    '$routeParams',
    'utils',
    function (
      Rpi,
      $scope,
      $rootScope,
      $routeParams,
      utils
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
            url: '/#/rpi/' + rpi._id + '/show'
          },'edit'];
    		})
    	}
  		$scope.updateRpi = function(rpi){
        $rootScope.spinner = 'Updating rpi';
  			var thisRpi = new Rpi(rpi);
  			thisRpi.$update({rpiId:rpi._id}, function(data){
            delete $rootScope.spinner;
            var alertData = { type: 'success', msg: 'Update successfull' };
            $rootScope.alerts.push(alertData);
          },
          function(response){
            var data = response.data;
            delete $rootScope.spinner;
            if (data.errors) {
              utils.onApiError(data.errors);
            }
            else {
              var alertData = { type: 'danger', msg: 'Cannot update' };
              $rootScope.alerts.push(alertData);                        
            }
          }
        );
  		};
  }]);
