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

	// Remove any previously stored tabs
	$utils.dataStorage.clearAll();

	// Get recently closed sessions
	$sessions.getRecentlyClosed().then(function(sessions){

		// Set collapsed
		$scope.sessionsCollapsed = false;

		// Set recently closed sessions
		$scope.recentlyClosedSessions = sessions.filter($sessions.removeSessionsBasedOnUrl);

	});

	// Windows
	$scope.windows = [];

	// Get windows
	$scope.getAllWindows = function(){

		// Reset needed data
		$scope.windows.length = 0;
		$scope.emptySelectedTabs();

		// Make promise
		$windows.getAll().then(function(windows){

			// Set windows
			$scope.windows = windows;

			// Set necessary attributes
			angular.forEach($scope.windows, function(window){
				window.tmCollapsed = false;
			});

		});

	};

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
		else if('bringToOne' === button || 'suspend' === button){
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

	// Bring to one tab
	$scope.bringToOneTab = function(sendAll){

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

		// Empty selectedTabs
		$scope.emptySelectedTabs();

	};

	// Reopen recently closed
	$scope.recentlyClosedReopen = function(){

		// Loop through all of the recently closed sessions to find selected sessions
		angular.forEach($scope.recentlyClosedSessions, function(session){

			// Is this for all tabs?
			if(session.tmSelected){
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

		// Empty selected tabs
		$scope.emptySelectedTabs();

	};

	// Empty selected tabs arrays
	$scope.emptySelectedTabs = function(){
		$scope.selectedTabs.length = 0;
		$scope.selectedTabsIds.length = 0;
	};

	// Check if the current tab is suspended
	$scope.currentTabIsSuspended = function(){

		// Get the active tab
		$tabs.query({ active: true, currentWindow: true }).then(function(tabs){
			if(tabs.length > 0){
				return $tabs.isSuspended(tabs[0]);
			}
		});

	};

	// Suspend current tab
	$scope.suspendCurrentTab = function(){

		// Get the current tab
		$tabs.query({ active: true, currentWindow: true }).then(function(tabs){
			if(tabs.length > 0){
				$scope.suspendTab(tabs[0]);
			}
		});

	};

	$scope.suspendSelectedTabs = function(){
		return;
	};

	// Suspend tab
	$scope.suspendTab = function(tab){

		// Make sure we have a legit tab
		if('undefined' !== typeof(tab) && !$tabs.isSuspended(tab)){

			// Create suspended url
			var url = chrome.extension.getURL('suspended.html#uri=' + tab.url);

			// Send message to contentScript
			chrome.tabs.sendMessage(tab.id, {
				action: 'confirmSuspendTab',
				suspendedTabUrl: url
			});

		}

	};

}]);