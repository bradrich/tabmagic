'use strict';

angular.module('TabMagicApp').controller('PopUpCtrl', function ($tabs, $windows, $sessions, $history, $scope, $moment, $parse, $timeout) {

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
			data: [],

			// Selected session tabs
			selectedTabs: [],

			// Get
			get: function get() {

				// Call get recently closed from sessions service
				$sessions.getRecentlyClosed().then(function (sessions) {
					angular.forEach(sessions, function (session) {
						$sessions.addToRecentlyClosed($scope.sessions.recentlyClosed.data, session);
					});
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

		// Query
		query: function query(active, currentWindow) {

			// Call query from tabs service
			$tabs.query({ active: active, currentWindow: currentWindow }).then(function (tabs) {
				if (tabs.length > 0 && $tabs.notSpecial(tabs[0])) {
					$scope.tabs.current = tabs[0];
				}
			});
		},

		// Bring to one tab
		bringToOne: function bringToOne(sendAll) {

			// Necessities
			var store = {
				tmOneTabGroup0: {
					name: 'Bring to One',
					tabs: [],
					createDate: null
				}
			};

			// Loop through all windows and tabs to find selected tabs
			angular.forEach($scope.windows.data, function (window) {
				angular.forEach(window.tabs, function (tab) {
					if (sendAll || tab.tmSelected) {

						// Add tab to group
						store.tmOneTabGroup0.tabs.push(tab);

						// Remove tab from window
						chrome.tabs.remove(tab.id);
					}
				});
			});

			// If there are any tabs in the group
			if (store.tmOneTabGroup0.tabs.length > 0) {

				// Store selected tabs
				store.tmOneTabGroup0.createDate = $moment().toDate();
				chrome.storage.sync.set(store);

				// Create new one-tab tab
				$tabs.create('one-tab.html').then(function () {
					console.log('TM: New tab created');
				}, function () {
					console.error('TM: New tab failed');
				});
			}
		},

		// Snooze
		snooze: {

			// Currently snoozed
			current: {
				data: [],
				tmCollapsed: false,
				selectedTabs: []
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

			// Add to snoozed current array and then close the tab
			add: function add(sendAll, request) {

				// Loop through all windows and tabs to find selected tabs
				angular.forEach($scope.windows.data, function (window) {
					angular.forEach(window.tabs, function (tab) {

						// Create snooze tab
						var snoozedTab = {
							dateCreated: $moment().format(),
							tab: tab,
							type: request,
							periodicallySetting: {
								type: null,
								daysOfWeek: [],
								dayOfMonth: null,
								monthOfYear: null
							},
							nextSnoozedToDate: null,
							removedBySnooze: false,
							tmSelected: false
						};

						// Necessities
						var month,
						    currentDayIndex,
						    dayIndex,
						    monthIndex,
						    hour,
						    date,
						    rightNow,
						    startingDate,
						    futureDate = null;

						// Set nextSnoozedToDate
						if ('laterToday' === request) {
							hour = parseInt($scope.settings.snooze.data.laterToday.model.replace('in ', '').replace(' hour', '').replace('s', ''));
							date = $moment().add(hour, 'hours').format();
							snoozedTab.nextSnoozedToDate = date;
						} else if ('thisEvening' === request) {
							hour = parseInt($scope.settings.snooze.data.workdayEnds.model.replace(':00 PM', '')) + 12;
							date = $moment().hour(hour).minutes(0).seconds(0).format();
							snoozedTab.nextSnoozedToDate = date;
						} else if ('tomorrow' === request) {
							hour = parseInt($scope.settings.snooze.data.workdayStarts.model.replace(':00 AM', ''));
							date = $moment().add(1, 'days').hour(hour).minutes(0).seconds(0).format();
							snoozedTab.nextSnoozedToDate = date;
						} else if ('thisWeekend' === request) {
							dayIndex = $scope.settings.snooze.data.weekStarts.options.indexOf($scope.settings.snooze.data.weekStarts.model);
							hour = parseInt($scope.settings.snooze.data.workdayStarts.model.replace(':00 AM', ''));
							date = $moment().day(dayIndex).hour(hour).minutes(0).seconds(0).format();
							snoozedTab.nextSnoozedToDate = date;
						} else if ('nextWeek' === request) {
							currentDayIndex = $moment().day();
							dayIndex = $scope.settings.snooze.data.weekStarts.options.indexOf($scope.settings.snooze.data.weekStarts.model);
							if (dayIndex < currentDayIndex) {
								dayIndex += 7;
							}
							hour = parseInt($scope.settings.snooze.data.workdayStarts.model.replace(':00 AM', ''));
							date = $moment().day(dayIndex).hour(hour).minutes(0).seconds(0).format();
							snoozedTab.nextSnoozedToDate = date;
						} else if ('inAMonth' === request) {
							hour = parseInt($scope.settings.snooze.data.workdayStarts.model.replace(':00 AM', ''));
							date = $moment().add(1, 'months').hour(hour).minutes(0).seconds(0).format();
							snoozedTab.nextSnoozedToDate = date;
						} else if ('someday' === request) {
							month = parseInt($scope.settings.snooze.data.someday.model.replace('in ', '').replace(' month', '').replace('s', ''));
							hour = parseInt($scope.settings.snooze.data.workdayStarts.model.replace(':00 AM', ''));
							date = $moment().add(month, 'months').hour(hour).minutes(0).seconds(0).format();
							snoozedTab.nextSnoozedToDate = date;
						} else if ('pickADate' === request) {
							date = $moment($scope.tabs.snooze.pickADate.model).format();
							snoozedTab.nextSnoozedToDate = date;
						} else if ('periodically' === request) {

							// Set periodicallySetting.type
							snoozedTab.periodicallySetting.type = $scope.tabs.snooze.periodically.form.wakeUpThisTab.models.edit.replace('Every ', '');
							if ('day' === snoozedTab.periodicallySetting.type) {
								snoozedTab.periodicallySetting.type = 'daily';
							} else if ('week' === snoozedTab.periodicallySetting.type) {
								snoozedTab.periodicallySetting.type = 'weekly';
							} else if ('month' === snoozedTab.periodicallySetting.type) {
								snoozedTab.periodicallySetting.type = 'monthly';
							} else if ('year' === snoozedTab.periodicallySetting.type) {
								snoozedTab.periodicallySetting.type = 'yearly';
							}

							// Set current date
							rightNow = $moment();

							// If wakeUpThisTab is 'Every day'
							if ('daily' === snoozedTab.periodicallySetting.type) {

								// Set startingDate
								startingDate = $moment($scope.tabs.snooze.periodically.form.atThisTime.models.edit);

								// If rightNow is AFTER startingDate, then add 1 day to startingDate
								if (rightNow.diff(startingDate) > 0) {
									startingDate.add(1, 'days');
								}

								// Push date
								date = startingDate.format();
								snoozedTab.nextSnoozedToDate = date;
							}
							// If wakeUpThisTab is 'Every week'
							else if ('weekly' === snoozedTab.periodicallySetting.type) {

									// Loop through onTheseDays to get the selected days
									angular.forEach($scope.tabs.snooze.periodically.form.onTheseDays.options, function (option) {
										if (option.model) {

											// Add option.value to periodicallySetting.daysOfWeek
											snoozedTab.periodicallySetting.daysOfWeek.push(option.value);

											// Set startingDate
											startingDate = $moment($scope.tabs.snooze.periodically.form.atThisTime.models.edit).day(option.value);

											// If rightNow is AFTER startingDate with that option selected, then add 1 week to that startingDate and set it as the futureDate
											if (rightNow.diff(startingDate) > 0 && !futureDate) {
												futureDate = startingDate.add(1, 'weeks');
											}
											// If rightNow is BEFORE startingDate, then that is the nextSnoozedToDate
											else if (rightNow.diff(startingDate) < 0) {
													date = startingDate.format();
													snoozedTab.nextSnoozedToDate = date;
												}
										}
									});

									// If after the loop, nextSnoozedToDate has not been set, then set it to the first futureDate created
									if (!snoozedTab.nextSnoozedToDate) {
										date = futureDate.format();
										snoozedTab.nextSnoozedToDate = date;
									}
								}
								// If wakeUpThisTab is 'Every month'
								else if ('monthly' === snoozedTab.periodicallySetting.type) {

										// Set dayIndex and periodicallySetting.dayOfMonth from onThisDay input
										dayIndex = parseInt($scope.tabs.snooze.periodically.form.onThisDay.models.edit.replace('st', '').replace('nd', '').replace('rd', '').replace('th', ''));
										snoozedTab.periodicallySetting.dayOfMonth = dayIndex;

										// Set startingDate
										startingDate = $moment($scope.tabs.snooze.periodically.form.atThisTime.models.edit).date(dayIndex);

										// If rightNow is AFTER startingDate, then add 1 month to startingDate
										if (rightNow.diff(startingDate) > 0) {
											startingDate.add(1, 'months');
										}

										// Push date
										date = startingDate.format();
										snoozedTab.nextSnoozedToDate = date;
									}
									// If wakeUpThisTab is 'Every year'
									else if ('yearly' === snoozedTab.periodicallySetting.type) {

											// Set monthIndex and periodicallySetting.monthOfYear from onThisDate month input
											monthIndex = $scope.tabs.snooze.periodically.form.onThisDate.monthOptions.indexOf($scope.tabs.snooze.periodically.form.onThisDate.monthModels.edit);
											snoozedTab.periodicallySetting.monthOfYear = monthIndex;

											// Set dayIndex and periodicallySetting.dayOfMonth from onThisDay input
											dayIndex = parseInt($scope.tabs.snooze.periodically.form.onThisDate.dayModels.edit.replace('st', '').replace('nd', '').replace('rd', '').replace('th', ''));
											snoozedTab.periodicallySetting.dayOfMonth = dayIndex;

											// Set startingDate
											startingDate = $moment($scope.tabs.snooze.periodically.form.atThisTime.models.edit).month(monthIndex).date(dayIndex);

											// If rightNow is AFTER startingDate, then add 1 year to startingDate
											if (rightNow.diff(startingDate) > 0) {
												startingDate.add(1, 'years');
											}

											// Push date
											date = startingDate.format();
											snoozedTab.nextSnoozedToDate = date;
										}
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

					// Get all windows again to update list
					$timeout(function () {
						$scope.windows.getAll();
					}, 400);

					// Set extension badge text to current snoozed tabs length
					chrome.browserAction.setBadgeText({ text: $scope.tabs.snooze.current.data.length.toString() });
				}
			},

			// Remove from current array
			remove: function remove(index, tabId) {

				// Remove item when index is given
				if (index || 0 === index) {
					$scope.tabs.snooze.current.data.splice(index, 1);
				}
				// Remove item when tabId is given
				else if (tabId) {

						// Index of tab with matching id
						var tabIndex;

						// Loop through the snooze current tabs to find the matching id
						angular.forEach($scope.tabs.snooze.current.data, function (snooze) {
							if (tabId === snooze.tab.id) {
								tabIndex = $scope.tabs.snooze.current.data.indexOf(snooze);
							}
						});

						// Remove item with tabIndex
						$scope.tabs.snooze.current.data.splice(tabIndex, 1);
					}

				// Resync array
				var store = { tmSnoozeCurrentTabs: $scope.tabs.snooze.current.data };
				chrome.storage.sync.set(store);

				// Set extension badge text to current snoozed tabs length
				if ($scope.tabs.snooze.current.data.length > 0) {
					chrome.browserAction.setBadgeText({ text: $scope.tabs.snooze.current.data.length.toString() });
				} else {
					chrome.browserAction.setBadgeText({ text: '' });
				}
			},

			// Reopen
			reopen: function reopen() {

				// Loop through all of the snooze current tabs
				angular.forEach($scope.tabs.snooze.current.data, function (snooze) {
					if (snooze.tmSelected) {
						$scope.tabs.snooze.current.selectedTabs.push(snooze);
					}
				});

				// If there are any selected snooze current tabs
				if ($scope.tabs.snooze.current.selectedTabs.length > 0) {

					// Loop through the selected snooze current tabs
					angular.forEach($scope.tabs.snooze.current.selectedTabs, function (snooze) {

						// Call create from the tabs service
						$tabs.create(snooze.tab.url);

						// If the snooze type is not periodically, then remove it from the snooze current tabs list as well
						if ('periodically' !== snooze.type) {
							$scope.tabs.snooze.remove(null, snooze.tab.id);
						}
					});
				}

				// Clear selected snooze current tabs
				$scope.tabs.snooze.current.selectedTabs.length = 0;
			},

			// Periodically
			periodically: {

				// Form
				form: {

					// Inputs
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
							value: 0
						}, {
							model: null,
							label: 'M',
							value: 1
						}, {
							model: null,
							label: 'T',
							value: 2
						}, {
							model: null,
							label: 'W',
							value: 3
						}, {
							model: null,
							label: 'T',
							value: 4
						}, {
							model: null,
							label: 'F',
							value: 5
						}, {
							model: null,
							label: 'S',
							value: 6
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
							master: $moment().format('MMM'),
							edit: $moment().format('MMM')
						},
						monthOptions: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
						dayModels: {
							master: null,
							edit: null
						},
						dayOptions: null,
						showInput: function showInput() {
							return 'Every year' === $scope.tabs.snooze.periodically.form.wakeUpThisTab.models.edit;
						},
						// Calculate the number of days based off of the month chosen
						calcDays: function calcDays() {

							// Necessities
							var maxDays = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th', '13th', '14th', '15th', '16th', '17th', '18th', '19th', '20th', '21st', '22nd', '23rd', '24th', '25th', '26th', '27th', '28th', '29th', '30th', '31st'];
							var monthsAndDays = {
								'Jan': maxDays,
								'Feb': maxDays.slice(0, 28),
								'Mar': maxDays,
								'Apr': maxDays.slice(0, 30),
								'May': maxDays,
								'Jun': maxDays.slice(0, 30),
								'Jul': maxDays,
								'Aug': maxDays,
								'Sep': maxDays.slice(0, 30),
								'Oct': maxDays,
								'Nov': maxDays.slice(0, 30),
								'Dec': maxDays
							};

							// Grab correct month from monthsAndDays object
							$scope.tabs.snooze.periodically.form.onThisDate.dayOptions = monthsAndDays[$scope.tabs.snooze.periodically.form.onThisDate.monthModels.edit];

							// Reset the dayModels.edit to null if outside of the array range
							if ($scope.tabs.snooze.periodically.form.onThisDate.dayOptions.indexOf($scope.tabs.snooze.periodically.form.onThisDate.dayModels.edit) < 0 && $scope.tabs.snooze.periodically.form.onThisDate.dayModels.edit) {
								$scope.tabs.snooze.periodically.form.onThisDate.dayModels.edit = $scope.tabs.snooze.periodically.form.onThisDate.dayOptions[$scope.tabs.snooze.periodically.form.onThisDate.dayOptions.length - 1];
							}
						}
					},
					atThisTime: {
						models: {
							master: $moment().seconds(0).millisecond(0).toDate(),
							edit: $moment().seconds(0).millisecond(0).toDate()
						}
					},

					// Reset the form, or reset wakeUpThisTab's accompanying inputs
					reset: function reset(notWakeUpThisTab) {

						// Reset each of the inputs back to their master model
						if (!notWakeUpThisTab) {
							$scope.tabs.snooze.periodically.form.wakeUpThisTab.models.edit = angular.copy($scope.tabs.snooze.periodically.form.wakeUpThisTab.models.master);
						}
						$scope.tabs.snooze.periodically.form.onThisDay.models.edit = angular.copy($scope.tabs.snooze.periodically.form.onThisDay.models.master);
						$scope.tabs.snooze.periodically.form.onThisDate.monthModels.edit = angular.copy($scope.tabs.snooze.periodically.form.onThisDate.monthModels.master);
						$scope.tabs.snooze.periodically.form.onThisDate.dayModels.edit = angular.copy($scope.tabs.snooze.periodically.form.onThisDate.dayModels.master);
						$scope.tabs.snooze.periodically.form.atThisTime.models.edit = angular.copy($scope.tabs.snooze.periodically.form.atThisTime.models.master);

						// Loop through onTheseDays options and set them back to null
						angular.forEach($scope.tabs.snooze.periodically.form.onTheseDays.options, function (option) {
							option.model = null;
						});

						// Set the form to pristine
						if (!notWakeUpThisTab) {
							$scope.tabs.snooze.periodically.form.data.$setPristine();
						}

						// Initialize dayOptions on onThisDate if wakeUpThisTab is 'Every year'
						if ('Every year' === $scope.tabs.snooze.periodically.form.wakeUpThisTab.models.edit && !$scope.tabs.snooze.periodically.form.onThisDate.daysOptions) {
							$scope.tabs.snooze.periodically.form.onThisDate.calcDays();
							$scope.tabs.snooze.periodically.form.onThisDate.dayModels.master = $moment().format('Do');
							$scope.tabs.snooze.periodically.form.onThisDate.dayModels.edit = angular.copy($scope.tabs.snooze.periodically.form.onThisDate.dayModels.master);
						}
					},

					// Disable submit when everything is not there
					disableSubmit: function disableSubmit() {

						// Catcher
						var disable = false;

						// If wakeUpThisTab is 'Every week'
						if ('Every week' === $scope.tabs.snooze.periodically.form.wakeUpThisTab.models.edit) {

							// Disable if none of onTheseDays options are selected
							var selected = false;
							angular.forEach($scope.tabs.snooze.periodically.form.onTheseDays.options, function (option) {
								if (option.model) {
									selected = true;
								}
							});
							if (!selected) {
								disable = true;
							}
						}
						// If wakeUpThisTab is 'Every month'
						else if ('Every month' === $scope.tabs.snooze.periodically.form.wakeUpThisTab.models.edit) {

								// Disable if onThisDay is not set
								if (!$scope.tabs.snooze.periodically.form.onThisDay.models.edit) {
									disable = true;
								}
							}
							// If wakeUpThisTab is 'Every year'
							else if ('Every year' === $scope.tabs.snooze.periodically.form.wakeUpThisTab.models.edit) {

									// Disable if onThisDate month is not set
									if (!$scope.tabs.snooze.periodically.form.onThisDate.monthModels.edit) {
										disable = true;
									}
									// Disable if onThisDate day is not set
									if (!$scope.tabs.snooze.periodically.form.onThisDate.dayModels.edit) {
										disable = true;
									}
								}
								// Disable if atThisTime is undefined
								else if (angular.isUndefined($scope.tabs.snooze.periodically.form.atThisTime.models.edit)) {
										disable = true;
									}

						return disable;
					}

				}

			},

			// Pick a date
			pickADate: {

				// Necessities
				model: $moment().add(1, 'minutes').seconds(0).milliseconds(0).toDate(),
				minDate: $moment().toISOString(),
				showWeeks: false,
				currentPart: 0

			}

		}

	};

	// Initialize tabs snooze
	$scope.tabs.snooze.init();

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

				console.log($scope.windows.data);
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

		// Bring to one
		bringToOne: {},

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
