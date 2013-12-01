'use strict';

angular.module('vksetupApp')
  .controller('UserEditCtrl', [
    'User',
    '$scope',
    '$rootScope',
    '$routeParams',
    'utils',
    function (
      User,
      $scope,
      $rootScope,
      $routeParams,
      utils
    ){

      $rootScope.navigationpath = ['home','useredit'];

      var userId = $rootScope.user._id;
      if (userId) {
        $rootScope.spinner = 'Loading user';
        User.get({userId:userId}, function(user){
          delete $rootScope.spinner;
          $scope.signer = user;
        })
      }
      $scope.updateUser = function(user){
        var thisUser = new User(user);
        $rootScope.spinner = 'Updating user';
        thisUser.$update({userId:user._id}, function(data){
            delete $rootScope.spinner;
            $rootScope.user = thisUser;
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