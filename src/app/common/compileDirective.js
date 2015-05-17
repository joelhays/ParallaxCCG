(function (angular) {

  'use strict';

  angular.module('app')
    .directive('compileUnsafeHtml', function ($compile) {
      return {
        link: function (scope, element, attrs) {
          scope.$watch(function () {
            return element.html();
          }, function (newval) {
            $compile(element.contents())(scope);
          });
        }
      };
    });

}(window.angular));