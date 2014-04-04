'use strict';

angular.module('bvio2014App')
  .directive('holderFix', function() {
    return {
      link: function(scope, element, attrs) {
        Holder.run({ images: element[0], nocss: true });
      }
    };
  });