(function (angular, chance) {
  'use strict';

  angular.module('app')
    .factory('cardsService', [
      '$q',
      '$sce',
      'dataService',
      'dataFactory',
      function ($q, $sce, data, factory) {
        var cards = [],
          sets = [],
          factions = [],
          types = [],
          rarities = [],
          promise;

        function extend_card(card) {
          card.type = function () {
            var self = this;
            return types.filter(function (o) {
              return o.id === self.typeId;
            })[0];
          };
          card.faction = function () {
            var self = this;
            return factions.filter(function (o) {
              return o.id === self.factionId;
            })[0];
          };
          card.rarity = function () {
            var self = this;
            return rarities.filter(function (o) {
              return o.id === self.rarityId;
            })[0];
          };
          card.set = function () {
            var self = this;
            return sets.filter(function (o) {
              return o.id === self.setId;
            })[0];
          };

          card.artUrl = function () {
            return this._artImageUrl || 'default';
          };
          card.frameUrl = function () {
            return './content/images/' +
              (this.faction().folder || 'common/') +
              (this.type().image || 'frame.png');
          };
          card.rarityUrl = function () {
            return './content/images/common/' + this.rarity().image;
          };
          card.hasStats = function () {
            return (this.type().hasStats === true);
          };
          card.rulesText = function () {
            //TODO: make this functionality a directive

            var replacements = [
                {
                  name: 'CostNoValue',
                  find: "[{][cC][}]",
                  replaceWith: function (val) {
                    return "<div fit-text class='stat stat-cost'></div>";
                  }
                },
                {
                  name: 'Cost',
                  find: "[{][+-]?[0-9]+?[}]",
                  replaceWith: function (val) {
                    return "<div fit-text class='stat stat-cost'><small>" + val.slice(1, -1) + "</small></div>";
                  }
                },
                {
                  name: 'Speed',
                  find: "[{][sS](:[+-]?[0-9]+?)?[}]",
                  replaceWith: function (val) {
                    return "<div fit-text class='stat stat-speed'><small>" + val.slice(3, -1) + "</small></div>";
                  }
                },
                {
                  name: 'Power',
                  find: "[{][pP](:[+-]?[0-9]+?)?[}]",
                  replaceWith: function (val) {
                    return "<div fit-text class='stat stat-power'><small>" + val.slice(3, -1) + "</small></div>";
                  }
                },
                {
                  name: 'Defense',
                  find: "[{][dD](:[+-]?[0-9]+?)?[}]",
                  replaceWith: function (val) {
                    return "<div fit-text class='stat stat-defense'><small>" + val.slice(3, -1) + "</small></div>";
                  }
                }
              ],
              newText = this.text,
              regex = null,
              i,
              match;

            for (i = 0; i < replacements.length; i += 1) {
              regex = new RegExp(replacements[i].find);
              while ((match = regex.exec(newText)) !== null) {
                newText = newText.replace(regex, replacements[i].replaceWith(match[0]));
              }
            }

            newText = newText.replace(/\n/g, '<br/>');
            newText = $sce.trustAsHtml(newText);

            return newText;
          };
        }

        promise = $q.all([data.getFactions(), data.getRarities(),
               data.getSets(), data.getTypes(),
               data.getCards()])
          .then(function (data) {
            factions = data[0];
            rarities = data[1];
            sets = data[2];
            types = data[3];
            cards = data[4];

            cards.forEach(function (card) {
              extend_card(card);
            });
          });

        function getCard(cardId) {
          var i;
          for (i = 0; i < cards.length; i += 1) {
            if (cards[i].id === cardId) {
              return cards[i];
            }
          }
          return undefined;
        }

        function save() {
          return data.saveCards(cards);
        }

        function getCards() {
          return cards;
        }

        function getSets() {
          return sets;
        }

        function getFactions() {
          return factions;
        }

        function getTypes() {
          return types;
        }

        function getRarities() {
          return rarities;
        }

        function createNew() {
          return factory.createCard().then(function (card) {
            extend_card(card);
            cards.push(card);

            return save().then(function () {
              return card;
            });
          });
        }

        function deleteCard(cardId) {
          var deleted = null;

          cards.forEach(function (card, index) {
            if (card.id === cardId) {
              deleted = cards.splice(index, 1);
              return false;
            }
          });

          return save().then(function () {
            return deleted;
          });
        }

        function updateCard(card) {
          var i;
          for (i = 0; i < cards.length; i += 1) {
            if (cards[i].id === card.id) {
              cards[i] = card;
              break;
            }
          }

          return save().then(function () {
            return card;
          });
        }

        return {
          promise: promise,
          getCard: getCard,
          getCards: getCards,
          getSets: getSets,
          getFactions: getFactions,
          getTypes: getTypes,
          getRarities: getRarities,
          createNew: createNew,
          deleteCard: deleteCard,
          updateCard: updateCard,
          save: save
        };
      }]);

}(window.angular, window.chance));