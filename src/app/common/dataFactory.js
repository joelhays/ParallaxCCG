(function (angular, chance) {
  'use strict';

  angular.module('app')
    .factory('dataFactory', [
      '$q',
      'dataService',
      function ($q, data) {
        var self = this,
          intOptions = {
            min: 1,
            max: 9
          },
          datasources = {};
        
        chance.mixin({
          'card': function () {
            return {
              id: chance.guid(),
              setId: chance.pick(datasources.sets).id,
              typeId: chance.pick(datasources.types).id,
              factionId: chance.pick(datasources.factions).id,
              rarityId: chance.pick(datasources.rarities).id,
              name: chance.sentence({
                words: 2
              }),
              cost: chance.integer(intOptions),
              speed: chance.integer(intOptions),
              power: chance.integer(intOptions),
              defense: chance.integer(intOptions),
              text: chance.sentence(),
              _artImageUrl: './content/images/art/' + chance.integer({
                min: 1,
                max: 41
              }) + '.jpg'
            };
          },
          'set': function () {
            return {
              id: chance.guid(),
              name: chance.sentence({
                words: 2
              }),
              description: chance.sentence(),
              iconUrl: './content/images/sets/' + chance.integer({
                min: 1,
                max: 7
              }) + '.png'
            };
          }
        });

        function prime_data() {
          return $q.all([data.getFactions(), data.getRarities(),
                        data.getTypes(), data.getSets()])
            .then(function (data) {
              datasources.factions = data[0];
              datasources.rarities = data[1];
              datasources.types = data[2];
              datasources.sets = data[3];
            
              if (datasources.sets.length === 0) {
                return createSet().then(function (set) {
                  datasources.sets = [set];
                });
              }
            });
        }

        function createSet() {
          return $q(function (resolve, reject) {
            resolve(chance.set());
          });
        }

        function createCard() {
          return prime_data().then(function () {
            return chance.card();
          });
        }

        return {
          createSet: createSet,
          createCard: createCard
        };
      }]);

}(window.angular, window.chance));