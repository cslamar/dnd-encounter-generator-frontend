var encounterApp = angular.module('encounterApp', ['ngStorage', 'ngFileSaver']);

encounterApp.controller('EncounterCtrl', function ($scope, $http, $location, $sessionStorage, FileSaver, Blob) {
  var name_array = [];
  $scope.$storage = $sessionStorage;
  $scope.$storage = $sessionStorage.$default({
    monsterCount: 0,
    encounter: []
  });

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

  $scope.addMonster = function(name, monster) {
    console.log(name, monster);
    $sessionStorage.monsterCount = $sessionStorage.monsterCount + 1;
    var newMonster = {"label": name, "monster": monster};
    $sessionStorage.encounter.push(newMonster);
  }

  $scope.generateXML = function() {
    var monsterManifest = {"monsters": $scope.$storage.encounter, "name": "sample-battle"};
    console.log(monsterManifest);

    $location.url('/api/v1/encounter/sample-battle.xml').search(monsterManifest);

    // $http.post('http://e.slamar.com/api/v1/generate-encounter/', monsterManifest)
    // .success(function(data){
    //   console.log("Battle Created!!");
    //   console.log(data);
    // })
    // .error(function(data){
    //   console.log("Something went wrong...");
    // });

  }

});
