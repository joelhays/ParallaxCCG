(function (angular) {
  'use strict';

  angular.module('app')
    .service('setsService', [
      '$q',
      'dataService',
      'dataFactory',
      'cardsService',
      function ($q, dataService, dataFactory, cardsService) {
        var service = this;

        service.data = {
          sets: []
        };
        service.state = {
          filters: {
            name: '',
            description: ''
          },
          paging: {
            currentPage: 0,
            pageSize: 6
          }
        };

        service.getSet = function getSet(setId) {
          var i;
          for (i = 0; i < service.data.sets.length; i += 1) {
            if (service.data.sets[i].id === setId) {
              return service.data.sets[i];
            }
          }
          return undefined;
        };

        service.save = function save() {
          return dataService.saveSets(service.data.sets);
        };

        service.createNew = function createNew() {
          return dataFactory.createSet().then(function (set) {
            service.data.sets.push(set);

            return service.save().then(function () {
              return set;
            });
          });
        };

        service.deleteSet = function deleteSet(setId) {
          var deleted = null,
            cardDeletionPromises = [],
            i;
          for (i = cardsService.data.cards.length - 1; i >= 0; i -= 1) {
            if (cardsService.data.cards[i].setId === setId) {
              cardDeletionPromises.push(cardsService.deleteCard(cardsService.data.cards[i].id));
            }
          }

          return $q.all(cardDeletionPromises)
            .then(function (data) {
              service.data.sets.forEach(function (set, index) {
                if (set.id === setId) {
                  deleted = service.data.sets.splice(index, 1);
                  return false;
                }
              });

              return service.save().then(function () {
                return deleted;
              });
            });
        };

        service.updateSet = function updateSet(set) {
          var i;
          for (i = 0; i < service.data.sets.length; i += 1) {
            if (service.data.sets[i].id === set.id) {
              service.data.sets[i] = set;
              break;
            }
          }

          return service.save().then(function () {
            return set;
          });
        };
        
        service.load = function () {
          return $q.all([dataService.getSets()])
            .then(function (data) {
              service.data.sets = data[0];
            });
        };


        
      }]);

}(window.angular));