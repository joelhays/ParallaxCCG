(function (angular) {
  'use strict';

  angular.module('app')
    .service('cardsService', [
      '$q',
      '$sce',
      'dataService',
      'dataFactory',
      function ($q, $sce, dataService, dataFactory) {
        var service = this;

        function extend_card(card) {
          card.type = function () {
            var self = this;
            return service.data.types.filter(function (o) {
              return o.id === self.typeId;
            })[0];
          };
          card.faction = function () {
            var self = this;
            return service.data.factions.filter(function (o) {
              return o.id === self.factionId;
            })[0];
          };
          card.rarity = function () {
            var self = this;
            return service.data.rarities.filter(function (o) {
              return o.id === self.rarityId;
            })[0];
          };
          card.set = function () {
            var self = this;
            return service.data.sets.filter(function (o) {
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
            var replacements = [
                {
                  name: 'Tap/Exhaust',
                  find: "[{][tT][}]",
                  replaceWith: function (val) {
                    return "<div class='stat stat-rotate'></div>";
                  }
                },
                {
                  name: 'CostNoValue',
                  find: "[{][cC][}]",
                  replaceWith: function (val) {
                    return "<div class='stat stat-cost'></div>";
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

        service.data = {
          cards: [],
          sets: [],
          factions: [],
          types: [],
          rarities: []
        };
        service.state = {
          filters: {
            setId: '',
            typeId: '',
            factionId: '',
            rarityId: '',
            name: '',
            cost: '',
            speed: '',
            power: '',
            defense: '',
            text: ''
          },
          paging: {
            currentPage: 0,
            pageSize: 6
          }
        };

        service.getCard = function getCard(cardId) {
          var i;
          for (i = 0; i < service.data.cards.length; i += 1) {
            if (service.data.cards[i].id === cardId) {
              return service.data.cards[i];
            }
          }
          return undefined;
        };

        service.save = function save() {
          return dataService.saveCards(service.data.cards);
        };

        service.createNew = function createNew() {
          return dataFactory.createCard().then(function (card) {
            extend_card(card);
            service.data.cards.push(card);

            return service.save().then(function () {
              return card;
            });
          });
        };

        service.deleteCard = function deleteCard(cardId) {
          var deleted = null;

          service.data.cards.forEach(function (card, index) {
            if (card.id === cardId) {
              deleted = service.data.cards.splice(index, 1);
              return false;
            }
          });

          return service.save().then(function () {
            return deleted;
          });
        };

        service.updateCard = function updateCard(card) {
          var i;
          for (i = 0; i < service.data.cards.length; i += 1) {
            if (service.data.cards[i].id === card.id) {
              service.data.cards[i] = card;
              break;
            }
          }

          return service.save().then(function () {
            return card;
          });
        };

        service.load = function () {
          return $q.all([dataService.getFactions(), dataService.getRarities(),
                 dataService.getSets(), dataService.getTypes(),
                 dataService.getCards()])
            .then(function (data) {
              service.data.factions = data[0];
              service.data.rarities = data[1];
              service.data.sets = data[2];
              service.data.types = data[3];
              service.data.cards = data[4];

              service.data.cards.forEach(function (card) {
                extend_card(card);
              });
            });
        };

        
      }]);

}(window.angular));