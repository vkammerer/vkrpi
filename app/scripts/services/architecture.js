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
                    url : '/#/rpi/edit'
                  },
                  show : {
                    name : 'Pin',
                    url : '',
                    children : {
                      edit : {
                        name : 'Edit',
                        url : '/#/rpi/edit'
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
