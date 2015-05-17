(function (angular, chance) {
  'use strict';

  angular.module('app')
    .controller('info', [
      '$scope',
      'dataService',
      function ($scope, data) {
        $scope.vm = {
          factions: [],
          cardTypes: []
        };

        data.getTypes().then(function (types) {
          $scope.vm.cardTypes = types;
        });
        data.getFactions().then(function (factions) {
          $scope.vm.factions = factions;
        });
      }
    ]);

}(window.angular, window.chance));