'use strict';

angular.module('bvio2014App')
  .directive('socialFeed', function() {
    return {
      templateUrl:"views/socialFeed.html",

      link: function($scope, $element, $attrs) {
        window.fm_ready = function(fx) {
          if (typeof $FM !== 'undefined' && typeof $FM.ready === 'function') {
            $FM.ready(fx);
          } else {
            window.setTimeout(function() { fm_ready.call(null, fx); }, 50);
          }
        };

        // load FeedMagnet SDK
        var fm_server = 'bvio.feedmagnet.com';
        var fmjs = document.createElement('script');
        var p = ('https:' === document.location.protocol ? 'https://' : 'http://');
        fmjs.src = p + fm_server + '/embed.js';
        fmjs.setAttribute('async', 'true');
        $element.append(fmjs);

        // do stuff once it is loaded
        fm_ready(function($, _) {
          console.log("feed magnet loaded");

          var feed = $FM.Feed('social-content')

          $scope.messages = [];
          feed.connect('new_update', updateFmData);

          feed.get();
        });

        function updateFmData(self, data) {
          $scope.messages.push(data.update.data); // todo fix the order
          $scope.$apply();
        }
      }
    };
  });