'use strict';

angular.module('vksetupApp')
	.factory('architecture', function () {
		return {
			home : {
				name : 'Home',
				url : '/#',
				children : {
					usersignin : {
						name : 'Sign in',
						url : '/#/user/signin'
					},
					usersignup : {
						name : 'Sign up',
						url : '/#/user/signup'
					},
					useredit : {
						name : 'User settings',
						url : '/#/user/edit'
					},
					rfcds : {
						name : 'RF receivers',
						url : '/#/rfcds',
						children : {
							create : {
								name : 'Add RF receiver',
								url : '/#/rfcd/create'
							},
							show : {
								name : 'RF receiver',
								url : '',
								children : {
									edit : {
										name : 'Edit',
										url : ''
									}
								}
							}
						}
					},
					tasks : {
						name : 'Tasks',
						url : '/#/tasks',
						children : {
							create : {
								name : 'Add task',
								url : '/#/rfcd/create'
							},
							edit : {
								name : 'Task',
								url : ''
							}
						}
					},
					gpios : {
						name : 'Pins',
						url : '/#/gpios',
						children : {
							create : {
								name : 'Add pin',
								url : '/#/gpio/create'
							}
						}
					},
					rpis : {
						name : 'Devices',
						url : '/#/rpis',
						children : {
							create : {
								name : 'Add device',
								url : '/#/rpi/create'
							},
							show : {
								name : 'Device',
								url : '',
								children : {
									edit : {
										name : 'Edit',
										url : ''
									},
									show : {
										name : 'Pin',
										url : '',
										children : {
											edit : {
												name : 'Edit',
												url : ''
											}
										}
									}
								}
							}
						}
					}
				}
			}
		};
	});
