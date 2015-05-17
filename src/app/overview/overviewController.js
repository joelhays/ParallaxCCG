(function (angular) {
  'use strict';

  angular.module('app')
    .controller('overview', [
      '$scope',
      function ($scope) {
        $scope.myval = 1;
      }
    ]);

}(window.angular));