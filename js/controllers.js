var encounterApp = angular.module('encounterApp', []);

encounterApp.controller('EncounterCtrl', function ($scope, $http) {
  $http.get('http://e.slamar.com/api/v1/monsters/').success(function(data) {
    $scope.monsters = data.monsters;
    console.log(data);
  });

});
