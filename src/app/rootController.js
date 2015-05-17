(function (angular) {
  'use strict';

  angular.module('app')
    .controller('root', [
      '$scope',
      '$q',
      '$http',
      '$templateCache',
      'preloaderService',
      'dataService',
      function ($scope, $q, $http, $templateCache, preloader, data) {
        $scope.range = function (n) {
          return Array.apply(null, {
            length: n
          }).map(function (element, index) {
            return index;
          });
        };


        $scope.isLoading = true;

        var imgRoot = "./content/images/",
          imageUrls = [
            imgRoot + 'common/cost.png',
            imgRoot + 'common/cost-small.png',
            imgRoot + 'common/defense.png',
            imgRoot + 'common/power.png',
            imgRoot + 'common/speed.png',
            imgRoot + 'common/rarity-common.png',
            imgRoot + 'common/rarity-uncommon.png',
            imgRoot + 'common/rarity-rare.png',
            imgRoot + 'common/stats-Character.png',
            imgRoot + 'common/stats-Starship.png',
            imgRoot + 'common/rotate.png',
            imgRoot + 'neutral/frame.png',
            imgRoot + 'thraxian-empire/frame.png',
            imgRoot + 'vela-nova/frame.png'
          ],
          i;

        for (i = 1; i <= 7; i += 1) {
          imageUrls.push(imgRoot + 'sets/' + i + '.png');
        }

        function cacheTemplates() {
          return $http.get('./app/cards/_cardPreview.html', {
            cache: $templateCache
          });
        }
        
        function preloadImages(images) {
          for (i = 0; i < images.length; i += 1) {
            imageUrls.push(images[i]._artImageUrl);
          }
          return preloader.load(imageUrls);
        }

        $q.all([data.getCards(), data.getFactions(),
               data.getRarities(), data.getSets(),
               data.getTypes(),
               cacheTemplates()])
          .then(function (data) {
            preloadImages(data[0]).then(function () {
              $scope.isLoading = false;
            });
          });
      }
    ]);

}(window.angular));