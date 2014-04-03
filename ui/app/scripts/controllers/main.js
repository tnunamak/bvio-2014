'use strict';

angular.module('bvio2014App')
  .controller('MainCtrl', function($scope, $resource) {
    var Reviews = $resource('http://10.247.2.132:9000/data/reviews.json?userId=rich&productId=:productId&friends=chris,stephen,tim');
    Reviews.get({productId: 342649}).$promise.then(function(data) {
      $scope.reviews = data.Results;
    });
  });
