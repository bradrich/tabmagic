'use strict';

tabMagicApp.controller('PopUpCtrl', [
	'$scope',
	'$q',
	'$utils',
	'$moment',
function($scope, $q, $utils, $moment){

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

	// Function to return a promise containing recently closed session data
	var getRecentlyClosedSessions = function(){
		var deferred = $q.defer();
		chrome.sessions.getRecentlyClosed(function(sessions){
			deferred.resolve(sessions);
		});
		return deferred.promise;
	};

	// Remove any previously stored tabs
	$utils.dataStorage.clearAll();

	// Get recently closed sessions
	getRecentlyClosedSessions().then(function(sessions){

		// Set collapsed
		$scope.sessionsCollapsed = true;

		// Set recently closed sessions
		$scope.recentlyClosedSessions = sessions;
		console.log($scope.recentlyClosedSessions);

	});

	// Get windows
	getWindows().then(function(windows){

		// Set windows
		$scope.windows = windows;

		// Set necessary attributes
		angular.forEach($scope.windows, function(window){
			window.tmCollapsed = true;
		});

	});

	// Selected tabs (to be sent to new tab)
	$scope.selectedTabs = [];
	$scope.selectedTabsIds = [];

	// Create new tab
	$scope.createTab = function(windowId, sendAll){

		// Loop through all windows and tabs to find selected tabs
		angular.forEach($scope.windows, function(window){
			if(window.id === windowId){
				angular.forEach(window.tabs, function(tab){

					// Is this for all tabs?
					if(sendAll){
						$scope.selectedTabs.push(tab);
						$scope.selectedTabsIds.push(tab.id);
					}
					// Not all tabs, is tab selected?
					else if(tab.tmSelected){
						$scope.selectedTabs.push(tab);
						$scope.selectedTabsIds.push(tab.id);
					}

				});
			}
		});

		// If there are any selected tabs
		if($scope.selectedTabs.length > 0){

			// Store selected tabs
			$utils.dataStorage.set('tmSelectedTabs', $scope.selectedTabs);
			$utils.dataStorage.set('tmSelectedTabsIds', $scope.selectedTabsIds);

			// Store creation time
			$utils.dataStorage.set('tmDateTime', $moment());

			// Create
			createTab().then(function(tab){

				// Save new tab to data storage
				$scope.newTab = tab;
				$utils.dataStorage.set('tmNewTab', $scope.newTab);

			});

		}

	};

}]);