'use strict';

angular.module('vksetupApp')
	.controller('TaskListCtrl', [
		'Task',
		'Gpio',
		'Rfcd',
		'$scope',
		'$rootScope',
		'$q',
		'$filter',
		'$timeout',
		function (
			Task,
			Gpio,
			Rfcd,
			$scope,
			$rootScope,
			$q,
			$filter,
			$timeout
		){

			$rootScope.navigationpath = ['home','tasks'];

			$rootScope.spinner = 'Loading pins, RF receivers and tasks';

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
			Task.query(function(data){
				$scope.tasks = data;
				taskDefer.resolve();
			});

			$q.all([gpiosDefer.promise, rfcdsDefer.promise, taskDefer.promise]).then(function(results){
				$scope.gpios = results[0];
				$scope.rfcds = results[1];
				delete $rootScope.spinner;
			})

			$scope.deleteTask = function(task){
				if (window.confirm('Delete task?')) {
					Task.delete({taskId: task._id}, function(){
						Task.query(function(data){
							$scope.tasks = data;
						});
					});
				}
			}

			var runAction = function(actions, actionIndex) {
				var thisDefer = $q.defer();
				if (actions[actionIndex].delay) {
					$timeout(function() {
						thisDefer.resolve();
					}, actions[actionIndex].delay.length);
				}
				else if (actions[actionIndex].rfcd) {
					var thisRfcd = angular.extend({}, $filter('getById')($scope.rfcds, actions[actionIndex].rfcd.rfcd));
					var rfcdSocket = (thisRfcd.rpi.mode == 'client') ? window.VK_APP.sockets[thisRfcd.rpi.user] : window.VK_APP.sockets[thisRfcd.rpi._id];
					rfcdSocket.emit('rfcdOutput', {
						rfcd:thisRfcd,
						status:actions[actionIndex].rfcd.status
					});
					thisDefer.resolve();
				}
				thisDefer.promise.then(function(){
					if(actions[actionIndex + 1]) {
						runAction(actions, actionIndex + 1);
					}
				})
			}

			$scope.runTask = function(task){
				if (task.actions.length) {
					runAction(task.actions, 0);
				}
			}

	}]);
