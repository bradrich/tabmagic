'use strict';

tabMagicApp.controller('PopUpCtrl', [
	'$tabs',
	'$windows',
	'$sessions',
	'$scope',
	'$q',
	'$utils',
	'$moment',
function($tabs, $windows, $sessions, $scope, $q, $utils, $moment){

	// Navigation
	$scope.navigation =  'recentlyClosed';

	// Function to return a promise containing all windows data
	// var getWindows = function(){
	// 	var deferred = $q.defer();
	// 	chrome.windows.getAll({ populate: true }, function(windows){
	// 		deferred.resolve(windows);
	// 	});
	// 	return deferred.promise;
	// };

	// Function to return a promise containing newly created tab data
	// var createTab = function(url){
	// 	var deferred = $q.defer();
	// 	chrome.tabs.create({ url: url }, function(tab){
	// 		deferred.resolve(tab);
	// 	});
	// 	return deferred.promise;
	// };

	// Function to return a promise containing recently closed session data
	// var getRecentlyClosedSessions = function(){
	// 	var deferred = $q.defer();
	// 	chrome.sessions.getRecentlyClosed(function(sessions){
	// 		deferred.resolve(sessions);
	// 	});
	// 	return deferred.promise;
	// };

	// Remove any previously stored tabs
	$utils.dataStorage.clearAll();

	// Get recently closed sessions
	$sessions.getRecentlyClosed().then(function(sessions){

		// Set collapsed
		$scope.sessionsCollapsed = false;

		// Set recently closed sessions
		$scope.recentlyClosedSessions = sessions;

		// console.log($scope.recentlyClosedSessions);

		// // Remove unwanted urls from sessions
		// angular.forEach($scope.recentlyClosedSessions, function(session, sIndex){
		// 	if(session.tab.url.indexOf('chrome-extension:') > -1 || session.tab.url.indexOf('chrome:') > -1 || session.tab.url.indexOf('chrome-devtools:') > -1 || session.tab.url.indexOf('file:') > -1 || session.tab.url.indexOf('chrome.google.com/webstore') > -1){
		// 		$scope.recentlyClosedSessions.splice(sIndex, 1);
		// 	}
		// });

	});

	// Get windows
	$windows.getAll().then(function(windows){

		// Set windows
		$scope.windows = windows;

		// Set necessary attributes
		angular.forEach($scope.windows, function(window){
			window.tmCollapsed = false;
		});

	});

	// Selected tabs (to be sent to new tab)
	$scope.selectedTabs = [];
	$scope.selectedTabsIds = [];

	// Show requested action button
	$scope.actionButtonShow = function(button){

		// Catcher
		var show = false;

		// Recently closed
		if('recentlyClosed' === button){
			angular.forEach($scope.recentlyClosedSessions, function(session){
				if(session.tmSelected){
					show = true;
				}
			});
		}
		// Bring to one
		else if('bringToOne' === button){
			angular.forEach($scope.windows, function(window){
				angular.forEach(window.tabs, function(tab){
					if(tab.tmSelected){
						show = true;
					}
				});
			});
		}

		return show;

	};

	// Create new tab
	$scope.createTab = function(fromRecent, fromBringToOne, sendAll){

		// Handle fromRecent-based request
		if(fromRecent && !fromBringToOne){

			// Loop through all of the recently closed sessions to find selected sessions
			angular.forEach($scope.recentlyClosedSessions, function(session){

				// Is this for all tabs?
				if(sendAll){
					$scope.selectedTabs.push(session.tab);
				}
				else if(session.tmSelected){
					$scope.selectedTabs.push(session.tab);
				}

			});

			// If there are any selected tabs
			if($scope.selectedTabs.length > 0){

				// Loop through selected tabs and create a new tab for each
				angular.forEach($scope.selectedTabs, function(tab){

					// Create tab
					$tabs.create(tab.url);

				});

			}

		}
		// Handle fromBringToOne-based request
		else if(!fromRecent && fromBringToOne){

			// Loop through all windows and tabs to find selected tabs
			angular.forEach($scope.windows, function(window){
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
			});

			// If there are any selected tabs
			if($scope.selectedTabs.length > 0){

				// Store selected tabs
				$utils.dataStorage.set('tmSelectedTabs', $scope.selectedTabs);
				$utils.dataStorage.set('tmSelectedTabsIds', $scope.selectedTabsIds);

				// Store creation time
				$utils.dataStorage.set('tmDateTime', $moment());

				// Create
				$tabs.create('newtab.html').then(function(tab){

					// Save new tab to data storage
					$scope.newTab = tab;
					$utils.dataStorage.set('tmNewTab', $scope.newTab);

				});

			}

		}

	};

}]);