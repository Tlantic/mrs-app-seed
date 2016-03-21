(function appController(angular) {
    'use strict';
    
    angular.module('App').controller('HomeController', ['$scope', HomeController]);
    
    function HomeController($scope) {
      	$scope.name = 'John';
    }
    
}(window.angular));