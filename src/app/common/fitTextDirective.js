(function (angular, $) {

  'use strict';

  angular.module('app')
    .directive('fitText', [
      '$window',
      '$timeout',
      function ($window, $timeout) {
        return {
          restrict: 'A',
          //          scope: true,
          link: function (scope, element, attrs) {
            var parent = element.parent(),
              compressor = attrs.fittext || 1,
              minFontSize = 1,
              elementFontSize = parseInt(element.css('font-size'), 10),
              elementWidth = element.width(),
              elementHeight = element.height(),
              resize = function () {
                $timeout(function () {
                  var temp = element.clone(),
                    newFontSize = elementFontSize;

                  temp.css({
                    'width': 'auto',
                    'font-size': newFontSize + 'px'
                  }).hide();
                  element.parent().append(temp);

                  if (temp.width() > elementWidth) {
                    while (temp.width() > elementWidth && newFontSize > minFontSize) {
                      newFontSize -= 1;
                      temp.css('font-size', newFontSize + 'px');
                    }
                  } else if (temp.width() < elementWidth) {
                    while (temp.width() < elementWidth && newFontSize < elementFontSize) {
                      newFontSize += 1;
                      temp.css('font-size', newFontSize + 'px');
                    }
                  }

                  element.css('font-size', newFontSize + 'px');

                  temp.remove();

                }, 50);
              };

            element.css({
              'white-space': 'nowrap',
              'overflow': 'hidden',
              'line-height': elementHeight + 'px'
            });

            scope.$watch(attrs.ngModel, function (modelValue) {
              if (modelValue) {
                resize();
              }
            });

            resize();
          }
        };
      }
    ]);

}(window.angular, window.jQuery));