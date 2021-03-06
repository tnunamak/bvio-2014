'use strict';

angular.module('bvio2014App')
  .controller('MainCtrl', function($scope, $resource, $http) {

    var loadPlus = $.Deferred();
    var SERVER_HOST = '10.247.2.132:9000';

    function checkGooglePlusUser() {
      if(window.googlePlusLoaded !== undefined && window.googlePlusLoaded) {
        gapi.client.load('plus', 'v1', function() {
          $scope.plusLoaded = true;
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
        $scope.friends = (friends.result && friends.result.items) || [];
        $scope.$apply();
        loadReviews();
      });
    });

    var friendMap = {
      '112797171718824861677': 'Bourdoisea',
      '100021025784352405813': 'zssofi',
      '106386498627889393658': 'elle7373',
      '113784330842650449575': 'Irmooc'
    };

    var Reviews = $resource('http://'+SERVER_HOST+'/data/reviews.json?productId=:productId&friends=:friends');

    loadReviews();

    var FriendsOtherReviews = $resource('http://'+SERVER_HOST+'/data/author_reviews.json?userId=rich&productId=:productId&friends=:friends');

    FriendsOtherReviews.get({productId: 342649, friends: mapFriends($scope.friends)}).$promise.then(function(data) {
      $scope.friendReviews = data.Results;
      console.log("loaded friend reviews");
    });

    function loadReviews() {
      Reviews.get({productId: 342649, friends: mapFriends($scope.friends)}).$promise.then(function(data) {
        $scope.reviews = data.Results;

        _.each($scope.reviews, function(review) {
          review.friend = _.find($scope.friends, function(friend){
            return friendMap[friend.id] === review.UserNickname;
          });
        });
      });
    }

    $scope.getNumber = function(num) {
      return new Array(num);
    };

    function mapFriendsToIds(friends) {
      return _.map(friends, function(friend) {
        return friend.id;
      });
    }

    function mapFriends(friends) {
      return _.compact(_.map(mapFriendsToIds(friends), function(friend) {
        return friendMap[friend];
      }));
    }
  });
