'use strict';

angular.module('vksetupApp')
	.controller('TaskEditCtrl', [
		'Task',
		'Gpio',
		'Rfcd',
		'$scope',
		'$rootScope',
		'$routeParams',
		'$q',
		'utils',
		function (
			Task,
			Gpio,
			Rfcd,
			$scope,
			$rootScope,
			$routeParams,
			$q,
			utils
		){

			var taskId = $routeParams.taskId || "";

			$rootScope.navigationpath = ['home','tasks'];

			$rootScope.spinner = 'Loading pins, RF receivers and task';

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

			var taskDefer = $q.defer();
			if (taskId) {
				Task.get({taskId:taskId}, function(task){
					taskDefer.resolve();
					$scope.task = task;
					$rootScope.navigationpath = ['home','tasks',{
						ref : 'edit',
						name : task.name,
						url: ''
					}];
				})
			}

			$q.all([gpiosDefer.promise, rfcdsDefer.promise, taskDefer.promise]).then(function(results){
				$scope.gpios = results[0];
				$scope.rfcds = results[1];
				delete $rootScope.spinner;
			})

			$scope.updateTask = function(task){
				$rootScope.spinner = 'Updating task';
				var thisTask = new Task(task);
				thisTask.$update({taskId:task._id}, function(data){
						delete $rootScope.spinner;
						$scope.task = data;
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
