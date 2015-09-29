'use strict';

tabMagicApp.controller('PopUpCtrl', function($tabs, $windows, $sessions, $history, $scope, $q, $utils, $moment, $parse, $timeout){

	// Navigation
	$scope.navigation = 'recentlyClosed';

	// Remove any previously stored tabs
	$utils.dataStorage.clearAll();

	// Show requested action button
	$scope.actionButtonShow = function(button){

		// Catcher
		var show = false;

		// Recently closed
		if('recentlyClosed' === button){
			angular.forEach($scope.sessions.recentlyClosed.data, function(session){
				if(session.tmSelected){
					show = true;
				}
			});
		}
		// Recently visited
		else if('recentlyVisited' === button){
			angular.forEach($scope.history.recentlyVisited.data, function(item){
				if(item.tmSelected){
					show = true;
				}
			});
		}
		// Bring to one
		else if('bringToOne' === button || 'snooze' === button){
			angular.forEach($scope.windows.data, function(window){
				angular.forEach(window.tabs, function(tab){
					if(tab.tmSelected){
						show = true;
					}
				});
			});
			if($scope.tabs.current && $scope.tabs.current.tmSelected){
				show = true;
			}
		}

		return show;

	};

	// Sessions
	$scope.sessions = {

		// Recently closed
		recentlyClosed: {

			// Data
			data: null,

			// Selected session tabs
			selectedTabs: [],

			// Get
			get: function(){

				// Call get recently closed from sessions service
				$sessions.getRecentlyClosed().then(function(sessions){

					// Set recently closed sessions
					$scope.sessions.recentlyClosed.data = sessions.filter($sessions.removeSessionsBasedOnUrl);

				});

			},

			// Remove selections
			removeSelections: function(){

				// Loop through windows and set tmCollapsed to false
				angular.forEach($scope.sessions.recentlyClosed.data, function(session){
					session.tmCollapsed = false;
				});

			},

			// Reopen
			reopen: function(){

				// Loop through all of the recently closed sessions to find selected sessions
				angular.forEach($scope.sessions.recentlyClosed.data, function(session){
					if(session.tmSelected){
						$scope.sessions.recentlyClosed.selectedTabs.push(session.tab);
					}
				});

				// If there are any selected recently open sessions
				if($scope.sessions.recentlyClosed.selectedTabs.length > 0){

					// Loop through selected session tabs
					angular.forEach($scope.sessions.recentlyClosed.selectedTabs, function(tab){

						// Call create from tab service
						$tabs.create(tab.url);

					});

				}

				// Empty selected tabs
				$scope.sessions.recentlyClosed.selectedTabs.length = 0;

			}

		}

	};

	// Get recently closed sessions
	$scope.sessions.recentlyClosed.get();

	// History
	$scope.history = {

		// Recently visited
		recentlyVisited: {

			// Data
			data: null,

			// Selected history items
			selectedHistory: [],

			// Get
			get: function(searchText, maxResults){

				// Call search history
				$history.search({ text: searchText, maxResults: maxResults }).then(function(history){

					// Set recently history
					$scope.history.recentlyVisited.data = history;

				});

			},

			// Remove selections
			removeSelections: function(){

				// Loop through windows and set tmCollapsed to false
				angular.forEach($scope.history.recentlyVisited.data, function(item){
					item.tmCollapsed = false;
				});

			},

			reopen: function(){

				// Loop through all of the recently visited webpages to find selected items
				angular.forEach($scope.history.recentlyVisited.data, function(item){
					if(item.tmSelected){
						$scope.history.recentlyVisited.selectedHistory.push(item);
					}
				});

				// If there are any selected history items
				if($scope.history.recentlyVisited.selectedHistory.length > 0){

					// Loop through selected history items and create a new tab for each
					angular.forEach($scope.history.recentlyVisited.selectedHistory, function(item){

						// Create tab
						$tabs.create(item.url);

					});

				}

				// Empty selected history
				$scope.history.recentlyVisited.selectedHistory.length = 0;

			}

		}

	};

	// Tabs
	$scope.tabs = {

		// Current
		current: null,

		// Selected
		selected: [],
		selectedIds: [],

		// Query
		query: function(active, currentWindow){

			// Call query from tabs service
			$tabs.query({ active: active, currentWindow: currentWindow }).then(function(tabs){
				if(tabs.length > 0){
					$scope.tabs.current = tabs[0];
				}
			});

		},

		// Bring to one tab
		bringToOne: function(sendAll){

			// Loop through all windows and tabs to find selected tabs
			angular.forEach($scope.windows.data, function(window){
				angular.forEach(window.tabs, function(tab){

					// Is this for all tabs?
					if(sendAll){
						$scope.tabs.selected.push(tab);
						$scope.tabs.selectedIds.push(tab.id);
					}
					// Not all tabs, is tab selected?
					else if(tab.tmSelected){
						$scope.tabs.selected.push(tab);
						$scope.tabs.selectedIds.push(tab.id);
					}

				});
			});

			// If there are any selected tabs
			if($scope.tabs.selected.length > 0){

				// Store selected tabs
				$utils.dataStorage.set('tmSelectedTabs', $scope.tabs.selected);
				$utils.dataStorage.set('tmSelectedTabsIds', $scope.tabs.selectedIds);

				// Store creation time
				$utils.dataStorage.set('tmDateTime', $moment());

				// Create
				$tabs.create('newtab.html').then(function(tab){

					// Save new tab to data storage
					$scope.newTab = tab;
					$utils.dataStorage.set('tmNewTab', $scope.newTab);

				});

			}

			// Empty tabs.selected
			$scope.tabs.selected.length = 0;
			$scope.tabs.selectedIds.length = 0;

		}

	};

	// Windows
	$scope.windows = {

		// Data
		data: null,

		// Get all
		getAll: function(){

			// Call get all from windows service
			$windows.getAll().then(function(windows){

				// Set windows
				$scope.windows.data = windows;

			});

		},

		// Remove selections
		removeSelections: function(){

			// Loop through windows and set tmCollapsed to false
			angular.forEach($scope.windows.data, function(window){
				window.tmCollapsed = false;
			});

		}

	};

	// Settings
	$scope.settings = {

		// Initialize
		init: function(){
			$scope.settings.snooze.init();
		},

		// Snooze
		snooze: {

			// Data
			data: {
				workdayStarts: {
					model: '8:00 AM',
					options: ['6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM'],
					storageName: 'tmSettingsSnoozeWorkdayStarts'
				},
				workdayEnds: {
					model: '7:00 PM',
					options: ['3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM'],
					storageName: 'tmSettingsSnoozeWorkdayEnds'
				},
				weekStarts: {
					model: 'Monday',
					options: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
					storageName: 'tmSettingsSnoozeWeekStarts'
				},
				weekendStarts: {
					model: 'Saturday',
					options: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
					storageName: 'tmSettingsSnoozeWeekendStarts'
				},
				laterToday: {
					model: 'in 3 hours',
					options: ['in 1 hour', 'in 2 hours', 'in 3 hours', 'in 4 hours', 'in 5 hours'],
					storageName: 'tmSettingsSnoozeLaterToday'
				},
				someday: {
					model: 'in 3 months',
					options: ['in 1 month', 'in 2 months', 'in 3 months', 'in 4 months', 'in 5 months'],
					storageName: 'tmSettingsSnoozeSomeday'
				}
			},

			// Initialize
			init: function(){

				// Loop through all of the form data objects of snooze
				angular.forEach($scope.settings.snooze.data, function(setting){

					// Get the setting value from chrome storage
					chrome.storage.sync.get(setting.storageName, function(items){
						if(!angular.equals({}, items)){
							setting.model = items[setting.storageName];
						}
					});

					// Add pending and saved state to each setting
					setting.saved = false;
					setting.savedTimer = null;

				});

			}

		},

		// Save setting change
		save: function(model){

			// Parse requested model
			var pModel = $parse(model)($scope);

			// Create object to send to storage service
			var item = {};
			item[pModel.storageName] = pModel.model;

			// Send to service
			chrome.storage.sync.set(item, function(){

				// Set input to saved
				$timeout.cancel(pModel.savedTimer);
				pModel.saved = true;
				$scope.$apply();

				// Wait a bit and turn it off
				pModel.savedTimer = $timeout(function(){
					pModel.saved = false;
				}, 5000);

			});

		}

	};

	// // Check if the current tab is suspended
	// $scope.currentTabIsSuspended = function(){

	// 	// Get the active tab
	// 	$tabs.query({ active: true, currentWindow: true }).then(function(tabs){
	// 		if(tabs.length > 0){
	// 			return $tabs.isSuspended(tabs[0]);
	// 		}
	// 	});

	// };

	// // Suspend current tab
	// $scope.suspendCurrentTab = function(){

	// 	// Get the current tab
	// 	$tabs.query({ active: true, currentWindow: true }).then(function(tabs){
	// 		if(tabs.length > 0){
	// 			$scope.suspendTab(tabs[0]);
	// 		}
	// 	});

	// };

	// $scope.suspendSelectedTabs = function(){
	// 	return;
	// };

	// // Suspend tab
	// $scope.suspendTab = function(tab){

	// 	// Make sure we have a legit tab
	// 	if('undefined' !== typeof(tab) && !$tabs.isSuspended(tab)){

	// 		// Create suspended url
	// 		var url = chrome.extension.getURL('suspended.html#uri=' + tab.url);

	// 		// Send message to contentScript
	// 		chrome.tabs.sendMessage(tab.id, {
	// 			action: 'confirmSuspendTab',
	// 			suspendedTabUrl: url
	// 		});

	// 	}

	// };

});