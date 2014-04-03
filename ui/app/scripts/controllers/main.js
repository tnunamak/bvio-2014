'use strict';

angular.module('bvio2014App')
  .controller('MainCtrl', function($scope, $resource, $http) {

    function checkGooglePlusUser(fx) {
      if (typeof googlePlusUser !== 'undefined') {
        $scope.googlePlusUser = googlePlusUser;
        fx();
      } else {
        window.setTimeout(function() { checkGooglePlusUser.call(null, fx); }, 50);
      }
    }

    checkGooglePlusUser(function() {

    });

    $scope.friends = ['Bourdoisea','zssofi','elle7373','Irmooc'];

    var Reviews = $resource('http://10.247.2.132:9000/data/reviews.json?userId=rich&productId=:productId&friends=:friends');
    Reviews.get({productId: 342649, friends: $scope.friends}).$promise.then(function(data) {
      $scope.reviews = data.Results;
    });

    /*$http.get('/someUrl').success(function(data) {
      $scope.friends = data;
    });*/

    $scope.getNumber = function(num) {
      return new Array(num);
    };
  });
