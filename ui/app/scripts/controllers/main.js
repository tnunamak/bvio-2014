'use strict';

angular.module('bvio2014App')
  .controller('MainCtrl', function($scope, $resource, $http) {

    var loadPlus = $.Deferred();

    function checkGooglePlusUser() {
      if(window.googlePlusLoaded !== undefined && window.googlePlusLoaded) {
        gapi.client.load('plus', 'v1', function() {
          loadPlus.resolve();
        });
      } else {
        window.setTimeout(function() { checkGooglePlusUser(); }, 150);
      }
    }

    checkGooglePlusUser();

    loadPlus.then(function() {
      var friendsReq = gapi.client.plus.people.list({userId: 'me', collection: 'visible'}); //todo connected??
      friendsReq.execute(function(friends) {
        var friends = (friends.result && friends.result.items) || [];
        $scope.friends = _.map(friends, function(friend) {
          return friend.id;
        });
        $scope.$apply();
      });
    });

    var friendMap = {
      112797171718824861677: 'Bourdoisea',
      114302105620839523772: 'zssofi',
      106386498627889393658: 'elle7373',
      113784330842650449575: 'Irmooc'
    };

    var Reviews = $resource('http://10.247.2.132:9000/data/reviews.json?productId=:productId&friends=:friends');

    Reviews.get({productId: 342649, friends: mapFriends($scope.friends)}).$promise.then(function(data) {
      $scope.reviews = data.Results;
    });

    $scope.getNumber = function(num) {
      return new Array(num);
    };

    function mapFriends(friends) {
      return _.compact(_.map(friends, function(friend) {
        return friendMap[friend];
      }));
    }
  });
