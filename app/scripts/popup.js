'use strict';

tabMagicApp.controller('PopUpCtrl', ['$scope', '$q', '$utils', function($scope, $q, $utils){

	// Function to return a promise containing all windows data
	var getWindows = function(){
		var deferred = $q.defer();
    chrome.windows.getAll({ populate: true }, function(windows){
      deferred.resolve(windows);
		});
    return deferred.promise;
	};

  // Function to return a promise containing newly created tab data
  var createTab = function(){
    var deferred = $q.defer();
    chrome.tabs.create({ url: 'newtab.html' }, function(tab){
      deferred.resolve(tab);
    });
    return deferred.promise;
  };

  // Remove any previously stored tabs
  $utils.dataStorage.clearAll()

	// Get current window
  getWindows().then(function(windows){
    $scope.windows = windows;
  });

  // Selected tabs (to be sent to new tab)
  $scope.selectedTabs = [];

  // Create new tab
  $scope.createTab = function(windowId){

    // Loop through all windows and tabs to find selected tabs
    angular.forEach($scope.windows, function(window){
      if(window.id === windowId){
        angular.forEach(window.tabs, function(tab){
          if(tab.tmSelected){
            $scope.selectedTabs.push(tab);
          }
        });
      }
    });

    // If there are any selected tabs
    if($scope.selectedTabs.length > 0){

      // Store selected tabs
      $utils.dataStorage.set('tmSelectedTabs', $scope.selectedTabs);

      // Create
      createTab().then(function(tab){
        $scope.newTab = tab;
        $utils.dataStorage.set('tmNewTab', $scope.newTab);
      });

    }

  };

}]);