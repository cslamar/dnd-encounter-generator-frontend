var encounterApp = angular.module('encounterApp', ['ngStorage', 'ui.bootstrap']);

encounterApp.controller('EncounterCtrl', function ($scope, $http, $sessionStorage, $uibModal, $sce, $document) {
  var name_array = [];
  var generateName = function(){
    var seed = Math.round((Math.random() * 1000) % name_array.length);
    // console.log(name_array[seed]);
    $scope.some_name = name_array[seed];
  };

  $scope.addName = generateName;
  $scope.isArray = angular.isArray;
  $scope.isObject = angular.isObject;
  $scope.selected = undefined;
  $scope.showList = false;
  $scope.bn = undefined;
  $scope.qtyRange = [1, 2, 3, 4, 5, 6];
  $scope.qty = 1;
  $scope.toggleList = function(){
    $scope.showList = !$scope.showList;
  };

  $scope.$storage = $sessionStorage;
  $scope.$storage = $sessionStorage.$default({
    monsterCount: 0,
    encounter: []
  });

  $scope.setQty = function(q) {
    $scope.qty = q;
  };

  $scope.clearList = function(){
    $scope.$storage.monsterCount = 0;
    $scope.$storage.encounter = [];
    console.log("List Cleared!");
  };

  $scope.encounter = $scope.$storage.encounter;

  $http.get('/api/v1/monsters/').success(function(data) {
    $scope.monsters = data.monsters;
  });

  $http.get('data/names_set.json').success(function(data){
    $scope.random_names = data.names_set;
    name_array = data.names_set;
    var seed = Math.round((Math.random() * 1000) % data.names_set.length);

    $scope.random_name = data.names_set[seed];
  });

  $scope.getMonsterInfo = function(id) {
    console.log('Getting monster info...');
    $http.get('/api/v1/monsters/' + id +'/').success(function(data){
      console.log(data);
      $scope.selectedMonster = data;
      generateName();
      $scope.qty = 1;
    });
  };

  $scope.addMonster = function(name, monster, quantity) {
    console.log(name, monster);
    $sessionStorage.monsterCount = $sessionStorage.monsterCount + quantity;
    var mName = name;
    for( var i = 0; i < quantity; i++){
      var newMonster = {"label": mName, "monster": monster};
      $sessionStorage.encounter.push(newMonster);
      var seed =  Math.round((Math.random() * 1000) % name_array.length);
      mName = name_array[seed]
    }
    $scope.qty = 1;
  };

  $scope.generateXML = function() {
    var monsterManifest = {"monsters": $scope.$storage.encounter, "name": $scope.encounter_name};
    console.log(monsterManifest);
    $scope.battleName = $sce.trustAsResourceUrl('/api/v1/encounter/' + $scope.encounter_name + '.xml');
    $http.put('/api/v1/generate-encounter/' + $scope.encounter_name, monsterManifest)
    .success(function(data){
      console.log("Battle Created!!");
      document.getElementById('battle-form').submit();
    })
    .error(function(data){
      console.log("Something went wrong...");
    });
  };

  // modal tests
  $scope.animationsEnabled = true;
  $scope.open = function (size) {

    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: '/confirm-modal.html',
      controller: 'ModalInstanceCtrl',
      size: size,
      resolve: {
        storage: function () {
          return $scope.$storage;
        }
      }
    });

    modalInstance.result.then(function (theBattle) {

      $scope.encounter_name = theBattle;
      console.log("the battle: ", theBattle);
      $scope.generateXML();
    }, function () {

      console.log('Modal dismissed at: ' + new Date());
    });
  };

  // End tests

});

// modal tests
angular.module('ui.bootstrap').controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, storage) {

  $scope.storage = storage;
  console.log(storage);

  $scope.ok = function () {
    $uibModalInstance.close($scope.encounter_name);
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});
// end tests
