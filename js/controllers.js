var encounterApp = angular.module('encounterApp', []);

encounterApp.controller('EncounterCtrl', function ($scope, $http) {
  var name_array = [];
  $http.get('http://e.slamar.com/api/v1/monsters/').success(function(data) {
    $scope.monsters = data.monsters;
  });

  $http.get('data/names_set.json').success(function(data){
    $scope.random_names = data.names_set;
    name_array = data.names_set;
    var seed = Math.round((Math.random() * 1000) % data.names_set.length);

    $scope.random_name = data.names_set[seed];
  });

  $scope.addName = function(){
    var seed = Math.round((Math.random() * 1000) % name_array.length);
    $scope.some_name = name_array[seed];
  };

  $scope.getMonsterInfo = function(id) {
    console.log('Getting monster info...');
    $http.get('http://e.slamar.com/api/v1/monsters/' + id +'/').success(function(data){
      console.log(data);
      $scope.selectedMonster = data;
    });
  }

});
