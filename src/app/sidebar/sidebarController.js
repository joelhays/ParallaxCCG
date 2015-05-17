(function (angular) {
  'use strict';

  angular.module('app')
    .controller('sidebar', [
      '$scope', '$location',
      function ($scope, $location) {
        $scope.isActive = function (routePath) {
          return routePath === $location.path();
        };
        $scope.pathContains = function (routePath) {
          return ($location.path().indexOf(routePath) != -1);
        }
      }
    ]);

}(window.angular));