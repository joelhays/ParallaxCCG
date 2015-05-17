(function (angular, $) {
  'use strict';

  angular.module('app')
    .factory('preloaderService', [
      '$http',
      '$q',
      function ($http, $q) {
        var deferred = null,
          imagesLoaded = 0,
          numImages = 0;

        function onLoadComplete(e) {
          imagesLoaded += 1;
          if (imagesLoaded === numImages) {
            deferred.resolve();
          }
        }

        function loadResource(resourceUrl) {
          $(new Image()).load(onLoadComplete).error(onLoadComplete)
            .prop("src", resourceUrl);
        }

        function load(resourceUrls) {
          deferred = $q.defer();

          resourceUrls = [].concat(resourceUrls);

          numImages = resourceUrls.length;

          for (var i = 0; i < numImages; i += 1) {
            loadResource(resourceUrls[i]);
          }

          return deferred.promise;
        }

        return {
          load: load
        };

      }]);

}(window.angular, window.jQuery));