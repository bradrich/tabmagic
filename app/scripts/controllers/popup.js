'use strict';

angular.module('TabMagicApp').controller('PopUpCtrl', function ($tabs, $windows, $sessions, $history, $scope, $q, $moment, $parse, $timeout) {

	// Navigation
	$scope.navigation = 'recentlyClosed';

	// Show requested action button
	$scope.actionButtonShow = function (button) {

		// Catcher
		var show = false;

		// Recently closed
		if ('recentlyClosed' === button) {
			angular.forEach($scope.sessions.recentlyClosed.data, function (session) {
				if (session.tmSelected) {
					show = true;
				}
			});
		}
		// Recently visited
		else if ('recentlyVisited' === button) {
				angular.forEach($scope.history.recentlyVisited.data, function (item) {
					if (item.tmSelected) {
						show = true;
					}
				});
			}
			// Synces devices
			else if ('devices' === button) {
					angular.forEach($scope.sessions.devices.data, function (device) {
						angular.forEach(device.sessions, function (session) {
							angular.forEach(session.window.tabs, function (tab) {
								if (tab.tmSelected) {
									show = true;
								}
							});
						});
					});
				}
				// Bring to one and snooze
				else if ('bringToOne' === button || 'snooze' === button) {
						angular.forEach($scope.windows.data, function (window) {
							angular.forEach(window.tabs, function (tab) {
								if (tab.tmSelected) {
									show = true;
								}
							});
						});
						if ($scope.tabs.current && $scope.tabs.current.tmSelected) {
							show = true;
						}
					}
					// Snooze open
					else if ('snoozeOpen' === button) {
							angular.forEach($scope.tabs.snooze.current.data, function (tab) {
								if (tab.tmSelected) {
									show = true;
								}
							});
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
			get: function get() {

				// Call get recently closed from sessions service
				$sessions.getRecentlyClosed().then(function (sessions) {

					// Set recently closed sessions
					$scope.sessions.recentlyClosed.data = sessions.filter($sessions.removeSessionsBasedOnUrl);
				});
			},

			// Remove selections
			removeSelections: function removeSelections() {

				// Loop through windows and set tmCollapsed to false
				angular.forEach($scope.sessions.recentlyClosed.data, function (session) {
					session.tmCollapsed = false;
				});
			},

			// Reopen
			reopen: function reopen() {

				// Loop through all of the recently closed sessions to find selected sessions
				angular.forEach($scope.sessions.recentlyClosed.data, function (session) {
					if (session.tmSelected) {
						$scope.sessions.recentlyClosed.selectedTabs.push(session.tab);
					}
				});

				// If there are any selected recently open sessions
				if ($scope.sessions.recentlyClosed.selectedTabs.length > 0) {

					// Loop through selected session tabs
					angular.forEach($scope.sessions.recentlyClosed.selectedTabs, function (tab) {

						// Call create from tab service
						$tabs.create(tab.url);
					});
				}

				// Empty selected tabs
				$scope.sessions.recentlyClosed.selectedTabs.length = 0;
			}

		},

		// Devices
		devices: {

			// Data
			data: null,

			// Selected session tabs
			selectedTabs: [],

			// Get
			get: function get() {

				// Call get devices from sessions service
				$sessions.getDevices().then(function (devices) {

					// Set recently closed sessions
					$scope.sessions.devices.data = devices;
				});
			},

			// Open tab
			openTab: function openTab() {

				// Loop through all of the devices to find the sessions with selected tabs
				angular.forEach($scope.sessions.devices.data, function (device) {
					angular.forEach(device.sessions, function (session) {
						angular.forEach(session.window.tabs, function (tab) {
							if (tab.tmSelected) {
								$scope.sessions.devices.selectedTabs.push(tab);
							}
						});
					});
				});

				// If there are any selected tabs
				if ($scope.sessions.devices.selectedTabs.length > 0) {

					// Loop through selected tabs
					angular.forEach($scope.sessions.devices.selectedTabs, function (tab) {

						// Call create from tab service
						$tabs.create(tab.url);
					});
				}

				// Empty selected tabs
				$scope.sessions.devices.selectedTabs.length = 0;
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
			get: function get(searchText, maxResults) {

				// Call search history
				$history.search({ text: searchText, maxResults: maxResults }).then(function (history) {

					// Set recently history
					$scope.history.recentlyVisited.data = history;
				});
			},

			// Remove selections
			removeSelections: function removeSelections() {

				// Loop through windows and set tmCollapsed to false
				angular.forEach($scope.history.recentlyVisited.data, function (item) {
					item.tmCollapsed = false;
				});
			},

			reopen: function reopen() {

				// Loop through all of the recently visited webpages to find selected items
				angular.forEach($scope.history.recentlyVisited.data, function (item) {
					if (item.tmSelected) {
						$scope.history.recentlyVisited.selectedHistory.push(item);
					}
				});

				// If there are any selected history items
				if ($scope.history.recentlyVisited.selectedHistory.length > 0) {

					// Loop through selected history items and create a new tab for each
					angular.forEach($scope.history.recentlyVisited.selectedHistory, function (item) {

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

		// Click to select
		select: function select(current, tabId) {

			// Is this the current tab?
			if (current) {

				// Loop through all windows and tabs to mark the active tab
				angular.forEach($scope.windows.data, function (window) {
					angular.forEach(window.tabs, function (tab) {
						if (tabId === tab.id) {
							tab.tmSelected = !tab.tmSelected;
						}
					});
				});
			}
			// NOT the current tab
			else {

					// Mark the current tab if ids match
					if (tabId === $scope.tabs.current.id) {
						$scope.tabs.current.tmSelected = !$scope.tabs.current.tmSelected;
					}
				}

			// Mark the current snoozed tabs
			angular.forEach($scope.tabs.snooze.current.data, function (snooze) {
				snooze.tmSelected = false;
			});
		},

		// Unselect
		unselect: function unselect() {

			// Loop through all windows and tabs to unselect all tabs
			angular.forEach($scope.windows.data, function (window) {
				angular.forEach(window.tabs, function (tab) {
					tab.tmSelected = false;
				});
			});

			// Unselect current tab also
			$scope.tabs.current.tmSelected = false;
		},

		// One tab
		oneTab: {
			tmOneTabSelectedTabs: [],
			tmOneTabCreateDate: null
		},

		// Query
		query: function query(active, currentWindow) {

			// Call query from tabs service
			$tabs.query({ active: active, currentWindow: currentWindow }).then(function (tabs) {
				if (tabs.length > 0) {
					$scope.tabs.current = tabs[0];
				}
			});
		},

		// Bring to one tab
		bringToOne: function bringToOne(sendAll) {

			// Loop through all windows and tabs to find selected tabs
			angular.forEach($scope.windows.data, function (window) {
				angular.forEach(window.tabs, function (tab) {

					// Is this for all tabs?
					if (sendAll) {
						$scope.tabs.oneTab.tmOneTabSelectedTabs.push(tab);
					}
					// Not all tabs, is tab selected?
					else if (tab.tmSelected) {
							$scope.tabs.oneTab.tmOneTabSelectedTabs.push(tab);
						}
				});
			});

			// If there are any selected tabs
			if ($scope.tabs.oneTab.tmOneTabSelectedTabs.length > 0) {

				// Store selected tabs
				$scope.tabs.oneTab.tmOneTabCreateDate = $moment().toDate();
				chrome.storage.sync.set($scope.tabs.oneTab);

				// Create new one-tab tab
				$tabs.create('one-tab.html').then(function () {
					console.log('TM: New tab created');
				}, function () {
					console.error('TM: New tab failed');
				});
			}

			// Empty tabs.selected
			$scope.tabs.oneTab.tmOneTabSelectedTabs.length = 0;
		},

		// Snooze
		snooze: {

			// Currently snoozed
			current: {

				// Necessities
				data: [],
				tmCollapsed: false,

				// Remove from current array
				remove: function remove(index) {

					// Remove item
					if (index > -1) {
						$scope.tabs.snooze.current.data.splice(index, 1);
					}

					// Resync array
					var store = { tmSnoozeCurrentTabs: $scope.tabs.snooze.current.data };
					chrome.storage.sync.set(store);
				},

				// Reopen
				reopen: function reopen() {}

			},

			// Initialize
			init: function init() {

				// Get the currently snoozed tabs from chrome storage
				chrome.storage.sync.get('tmSnoozeCurrentTabs', function (data) {
					if (data.tmSnoozeCurrentTabs.length > 0) {
						$scope.tabs.snooze.current.data = angular.copy(data.tmSnoozeCurrentTabs);
					}
				});
			},

			// Add to snoozed
			add: function add(sendAll, request) {

				// Loop through all windows and tabs to find selected tabs
				angular.forEach($scope.windows.data, function (window) {
					angular.forEach(window.tabs, function (tab) {

						// Create snooze tab
						var snoozedTab = {
							dateCreated: $moment().format(),
							tab: tab,
							type: request,
							snoozeToDates: [],
							removedBySnooze: false,
							tmSelected: false
						};

						// Set snoozeToDates
						if ('laterToday' === request) {
							var hourToAdd = parseInt($scope.settings.snooze.data.laterToday.model.replace('in ', '').replace(' hour', '').replace('s', ''));
							var date = $moment().add(hourToAdd, 'hours').format;
							snoozedTab.snoozeToDates.push(date);
						}

						// Is this for all tabs?
						if (sendAll) {
							$scope.tabs.snooze.current.data.push(snoozedTab);
						}
						// Not all tabs, is tab selected?
						else if (tab.tmSelected) {
								$scope.tabs.snooze.current.data.push(snoozedTab);
							}
					});
				});

				// If there are any current snoozed tabs
				if ($scope.tabs.snooze.current.data.length > 0) {

					// Store snoozed tabs
					var store = { tmSnoozeCurrentTabs: $scope.tabs.snooze.current.data };
					chrome.storage.sync.set(store);

					// Loop through current snoozed tabs to see if any need to be removed from window
					angular.forEach($scope.tabs.snooze.current.data, function (tab) {
						if (!tab.removedBySnooze) {
							chrome.tabs.remove(tab.tab.id);
							tab.removedBySnooze = true;
						}
					});
				}
			},

			// Periodically
			periodically: {

				// Form
				form: {
					wakeUpThisTab: {
						models: {
							master: 'Every week',
							edit: 'Every week'
						},
						options: ['Every day', 'Every week', 'Every month', 'Every year']
					},
					onTheseDays: {
						options: [{
							model: null,
							label: 'S',
							value: 'Sunday'
						}, {
							model: null,
							label: 'M',
							value: 'Monday'
						}, {
							model: null,
							label: 'T',
							value: 'Tuesday'
						}, {
							model: null,
							label: 'W',
							value: 'Wednesday'
						}, {
							model: null,
							label: 'T',
							value: 'Thursday'
						}, {
							model: null,
							label: 'F',
							value: 'Friday'
						}, {
							model: null,
							label: 'S',
							value: 'Saturday'
						}],
						showInput: function showInput() {
							return 'Every week' === $scope.tabs.snooze.periodically.form.wakeUpThisTab.models.edit;
						}
					},
					onThisDay: {
						models: {
							master: '1st',
							edit: '1st'
						},
						options: ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th', '13th', '14th', '15th', '16th', '17th', '18th', '19th', '20th', '21st', '22nd', '23rd', '24th', '25th', '26th', '27th', '28th', '29th', '30th', '31st'],
						showInput: function showInput() {
							return 'Every month' === $scope.tabs.snooze.periodically.form.wakeUpThisTab.models.edit;
						}
					},
					onThisDate: {
						monthModels: {
							master: 'Jan',
							edit: 'Jan'
						},
						monthOptions: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
						dayModels: {
							master: '1st',
							edit: '1st'
						},
						dayOptions: ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th', '13th', '14th', '15th', '16th', '17th', '18th', '19th', '20th', '21st', '22nd', '23rd', '24th', '25th', '26th', '27th', '28th', '29th', '30th', '31st'],
						showInput: function showInput() {
							return 'Every year' === $scope.tabs.snooze.periodically.form.wakeUpThisTab.models.edit;
						}
					},
					atThisTime: {
						models: {
							master: $moment().toDate(),
							edit: $moment().toDate()
						},
						hourStep: 1,
						minuteStep: 15,
						isMeridian: true,
						showSpinners: false
					},
					reset: function reset() {

						// Reset each of the inputs back to their master model
						$scope.tabs.snooze.periodically.form.wakeUpThisTab.models.edit = angular.copy($scope.tabs.snooze.periodically.form.wakeUpThisTab.models.master);
						$scope.tabs.snooze.periodically.form.onThisDay.models.edit = angular.copy($scope.tabs.snooze.periodically.form.onThisDay.models.master);
						$scope.tabs.snooze.periodically.form.onThisDate.monthModels.edit = angular.copy($scope.tabs.snooze.periodically.form.onThisDate.monthModels.master);
						$scope.tabs.snooze.periodically.form.onThisDate.dayModels.edit = angular.copy($scope.tabs.snooze.periodically.form.onThisDate.dayModels.master);
						$scope.tabs.snooze.periodically.form.atThisTime.models.edit = angular.copy($scope.tabs.snooze.periodically.form.atThisTime.models.master);

						// Loop through onTheseDays options and set them back to null
						angular.forEach($scope.tabs.snooze.periodically.form.onTheseDays.options, function (option) {
							option.model = null;
						});
					}
				}

			}

		}

	};

	// Initialize tabs snooze
	$scope.tabs.snooze.init();
	// chrome.storage.sync.remove('tmSnoozeCurrentTabs');

	// Windows
	$scope.windows = {

		// Data
		data: null,

		// Get all
		getAll: function getAll() {

			// Call get all from windows service
			$windows.getAll().then(function (windows) {

				// Catcher
				var windowsTemp = [];

				// Loop through the windows data to only grab the "normal" windows
				angular.forEach(windows, function (win) {
					if ('normal' === win.type) {
						windowsTemp.push(win);
					}
				});

				// Set windows
				$scope.windows.data = windowsTemp;
			});
		},

		// Remove selections
		removeSelections: function removeSelections() {

			// Loop through windows and set tmCollapsed to false
			angular.forEach($scope.windows.data, function (window) {
				window.tmCollapsed = false;
			});
		}

	};

	// Settings
	$scope.settings = {

		// Initialize
		init: function init() {
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
			init: function init() {

				// Loop through all of the form data objects of snooze
				angular.forEach($scope.settings.snooze.data, function (setting) {

					// Get the setting value from chrome storage
					chrome.storage.sync.get(setting.storageName, function (items) {
						if (!angular.equals({}, items)) {
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
		save: function save(model) {

			// Parse requested model
			var pModel = $parse(model)($scope);

			// Create object to send to storage service
			var item = {};
			item[pModel.storageName] = pModel.model;

			// Send to service
			chrome.storage.sync.set(item, function () {

				// Set input to saved
				$timeout.cancel(pModel.savedTimer);
				pModel.saved = true;
				$scope.$apply();

				// Wait a bit and turn it off
				pModel.savedTimer = $timeout(function () {
					pModel.saved = false;
				}, 5000);
			});
		}

	};
});
//# sourceMappingURL=popup.js.map
