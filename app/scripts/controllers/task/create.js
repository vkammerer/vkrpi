'use strict';

angular.module('vksetupApp')
	.controller('TaskCreateCtrl', [
		'Task',
		'Gpio',
		'Rfcd',
		'$scope',
		'$rootScope',
		'$q',
		'utils',
		function (
			Task,
			Gpio,
			Rfcd,
			$scope,
			$rootScope,
			$q,
			utils
		){

			$rootScope.navigationpath = ['home','tasks','create'];

			$rootScope.spinner = 'Loading pins and RF receivers';

			$scope.task = {
				actions : []
			}

			var gpiosDefer = $q.defer();

			Gpio.query(function(data){
				gpiosDefer.resolve(data);
			});

			var rfcdsDefer = $q.defer();

			Rfcd.query(function(data){
				rfcdsDefer.resolve(data);
			});

			$q.all([gpiosDefer.promise, rfcdsDefer.promise]).then(function(results){
				$scope.gpios = results[0];
				$scope.rfcds = results[1];
				delete $rootScope.spinner;
			})

			$scope.addTask = function(task){
				$rootScope.spinner = 'Creating task';
				var thisTask = new Task(task);
				thisTask.$save(
					function(data){
						delete $rootScope.spinner;
						var alertData = { type: 'success', msg: 'Task successfully created' };
						$rootScope.alerts.push(alertData);
						$scope.task = {
							actions : []
						}
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

			$scope.addAction = function(type){
				var action;
				if (type == 'gpio') {
					action = {gpio : {}}
				}
				else if (type == 'rfcd') {
					action = {rfcd : {}}
				}
				else if (type == 'delay') {
					action = {delay : {}}
				}
				$scope.task.actions.push(action);
			};
			$scope.deleteAction = function(idx){
				if (window.confirm('Delete action?')) {
					$scope.task.actions.splice(idx, 1);
				}
			};

	}]);
