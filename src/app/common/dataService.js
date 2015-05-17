(function (angular) {
  'use strict';

  angular.module('app')
    .factory('dataService', [
      '$q',
      '$http',
      function ($q, $http) {

        function save_to_cache(resourceName, data) {
          localStorage[resourceName] = angular.toJson(data);
        }

        function get_from_cache(resourceName) {
          if (localStorage[resourceName]) {
            var data = angular.fromJson(localStorage[resourceName]);
            return data;
          }

          return null;
        }

        function get_data(resourceName) {
          return $q(function (resolve, reject) {
            var cached = get_from_cache(resourceName);

            if (cached) {
              resolve(cached);
            } else {
              $http.get('./app/json_data/' + resourceName + '.json')
                .success(function (data, status, headers, config) {
                  save_to_cache(resourceName, data);
                  resolve(data);
                })
                .error(function (data, status, headers, config) {
                  reject(data);
                });
            }
          });
        }

        function save_data(resourceName, data) {
          return $q(function (resolve, reject) {
            save_to_cache(resourceName, data);
            resolve();
          });
        }

        function getCards() {
          return get_data("cards");
        }

        function getSets() {
          return get_data("sets");
        }

        function getTypes() {
          return get_data("cardTypes");
        }

        function getFactions() {
          return get_data("factions");
        }

        function getRarities() {
          return get_data("rarities");
        }

        function saveCards(data) {
          return save_data("cards", data);
        }

        function saveSets(data) {
          return save_data("sets", data);
        }

        return {
          getCards: getCards,
          getSets: getSets,
          getTypes: getTypes,
          getFactions: getFactions,
          getRarities: getRarities,
          saveCards: saveCards,
          saveSets: saveSets
        };
      }]);

}(window.angular));