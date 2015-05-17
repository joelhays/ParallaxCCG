(function (angular) {
  'use strict';

  angular.module('app', ['ngRoute', 'ngAnimate'])
    .config([
      '$routeProvider',
      function ($routeProvider) {
        $routeProvider
          .when('/', {
            templateUrl: 'app/overview/overview.html',
            controller: 'overview'
          })

          .when('/sets', {
            templateUrl: 'app/sets/sets.html',
            controller: 'sets'
          })

          .when('/sets/details/:id', {
            templateUrl: 'app/sets/setDetails.html',
            controller: 'sets'
          })

          .when('/cards', {
            templateUrl: 'app/cards/cards.html',
            controller: 'cards'
          })

          .when('/cards/details/:id', {
            templateUrl: 'app/cards/cardDetails.html',
            controller: 'cards'
          })

          .when('/cardTypes', {
            templateUrl: 'app/info/cardTypes.html',
            controller: 'info'
          })

          .when('/factions', {
            templateUrl: 'app/info/factions.html',
            controller: 'info'
          })

          .otherwise('/');
      }
    ]);
}(window.angular));