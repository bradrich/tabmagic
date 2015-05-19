'use strict';

tabMagicApp.controller('NewTabCtrl', ['$scope', '$q', '$utils', function($scope, $q, $utils){

  // Get new tab from local storage
  $scope.newTab = $utils.dataStorage.get('tmNewTab');

  // Get previously selected tabs from local storage
  $scope.selectedTabs = $utils.dataStorage.get('tmSelectedTabs');

  console.log($scope.newTab);
  console.log($scope.selectedTabs);

}]);