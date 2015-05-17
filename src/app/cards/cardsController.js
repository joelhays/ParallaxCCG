(function (angular) {
  'use strict';

  angular.module('app')
    .controller('cards', [
      '$scope',
      '$routeParams',
      '$location',
      '$filter',
      'cardsService',
      function ($scope, $routeParams, $location, $filter, cardsService) {
        var active_card = null;

        $scope.vm = {
          data: cardsService.data,
          state: cardsService.state,
          filteredCards: [],
          activeCard: function () {
            if ($routeParams.id) {
              var card = cardsService.getCard($routeParams.id);
              if (card) {
                active_card = active_card || angular.extend({}, card);
              }
            }
            return active_card;
          },
          deleteActiveCard: function () {
            cardsService.deleteCard($routeParams.id).then(function () {
              $location.url('/cards');
            });
          },
          confirmActiveCardEdits: function () {
            cardsService.updateCard(active_card).then(function () {
              $scope.editForm.$setPristine();
            });
          },
          revertActiveCardEdits: function () {
            active_card = null;
            $scope.editForm.$setPristine();
          },
          newCard: function () {
            cardsService.createNew().then(function (card) {
              $location.url('/cards/details/' + card.id);
            });
          },
          insertText: function (text) {
            $scope.vm.activeCard().text += text;
          },

          numFilteredPages: function () {
            return Math.ceil($scope.vm.filteredCards.length / $scope.vm.state.paging.pageSize);
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

        cardsService.load();
      }
    ]);

}(window.angular));