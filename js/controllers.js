var encounterApp = angular.module('encounterApp', ['ngStorage', 'ngFileSaver']);

encounterApp.controller('EncounterCtrl', function ($scope, $http, $location, $sessionStorage, FileSaver, Blob) {
  var name_array = [];

  $scope.$storage = $sessionStorage;
  $scope.$storage = $sessionStorage.$default({
    monsterCount: 0,
    encounter: []
  });

  $scope.encounter = $scope.$storage.encounter;

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
    var monsterManifest = {"monsters": $scope.$storage.encounter, "name": $scope.encounter_name};
    console.log(monsterManifest);
    $http.put('http://e.slamar.com/api/v1/generate-encounter/' + $scope.encounter_name, monsterManifest)
    .success(function(data){
      console.log("Battle Created!!");
      console.log(data);
      /*
      // var someFile = new Blob([data], { type: 'application/xml' });
      someFile = new Blob([data], { type: 'text/xml' });
      FileSaver.saveAs(someFile, 'sample-battle.xml', true);
      */
    })
    .error(function(data){
      console.log("Something went wrong...");
    });
  }

});
