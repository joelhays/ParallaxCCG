(function (angular) {
  'use strict';

  angular.module('app')
    .controller('sets', [
      '$scope',
      '$routeParams',
      '$location',
      '$filter',
      'setsService',
      function ($scope, $routeParams, $location, $filter, setsService) {
        var active_set = null;

        $scope.vm = {
          data: setsService.data,
          state: setsService.state,
          filteredSets: [],
          activeSet: function () {
            if ($routeParams.id) {
              var set = setsService.getSet($routeParams.id);
              if (set) {
                active_set = active_set || angular.extend({}, set);
              }
            }
            return active_set;
          },
          deleteActiveSet: function () {
            setsService.deleteSet($routeParams.id).then(function () {
              $location.url('/sets');
            });
          },
          confirmActiveSetEdits: function () {
            setsService.updateSet(active_set).then(function () {
              $scope.editForm.$setPristine();
            });
          },
          revertActiveSetEdits: function () {
            active_set = null;
            $scope.editForm.$setPristine();
          },
          newSet: function () {
            setsService.createNew().then(function (set) {
              $location.url('/sets/details/' + set.id);
            });
          },
          
          numFilteredPages: function () {
            return Math.ceil($scope.vm.filteredSets.length / $scope.vm.state.paging.pageSize);
          },
          searchFilter: function (value, index) {
            var match = $filter('filter')([value], $scope.vm.state.filters)[0];
            return match !== undefined;
          },
          pageFilter: function (value, index) {
            $scope.vm.state.paging.currentPage = Math.max($scope.vm.state.paging.currentPage, 0);
            $scope.vm.state.paging.currentPage = Math.min($scope.vm.state.paging.currentPage, $scope.vm.numFilteredPages() - 1);

            var pageOffsetStart = $scope.vm.state.paging.currentPage * $scope.vm.state.paging.pageSize,
              pageOffsetEnd = pageOffsetStart + $scope.vm.state.paging.pageSize;

            return index >= pageOffsetStart && index < pageOffsetEnd;
          }
        };
        
        setsService.load();
      }
    ]);

}(window.angular));