'use strict';

angular.module('TabMagicApp')

.controller('OneTabCtrl', function($scope, $moment, $tabs){

	// Navigation
	$scope.navigation = 'bringToOne';

	// Define one tab
	$scope.oneTab = {

		// Initialize
		init: function(){

			// Get groups by ids
			$scope.oneTab.groups.getIds();

		},

		// Groups
		groups: {

			// Data
			data: [],

			// Get group ids
			getIds: function(){

				// Call the default group
				$scope.oneTab.groups.get(0);

				// Get groups from storage
				chrome.storage.sync.get('tmOneTabGroups', function(data){

					// If there were groups returned from storage
					if(data.tmOneTabGroups){
						angular.forEach(data.tmOneTabGroups, function(id){
							$scope.oneTab.groups.get(id);
						});
					}

				});

			},

			// Get group
			get: function(id){

				// Storage name for group
				var storageName = 'tmOneTabGroup' + id.toString();

				// Group data
				var groupData = {};

				// Get group from storage
				chrome.storage.sync.get(storageName, function(data){
					if(data[storageName]){

						// Set group data
						groupData.id = id;
						groupData.name = data[storageName].name;
						groupData.tabs = data[storageName].tabs;
						groupData.createDate = $moment(data[storageName].createDate).toDate();

						// Add group to overall data
						$scope.oneTab.groups.data.push(groupData);

						// Apply it to the scope
						$scope.$apply();

					}
				});

			},

			// Create or modify a group
			create: function(groupId){

				console.log(groupId);

			}

		},

		// Tabs
		tabs: {

			// Reopen
			reopen: function(groupId, tabId, all){

				// Loop through all of the groups
				angular.forEach($scope.oneTab.groups.data, function(group){

					// If groupId is the group.id
					if(groupId === group.id){

						// Loop through all of the group's tabs
						angular.forEach(group.tabs, function(tab){

							// If tabId is the tab.id or if all is requested
							if(tabId === tab.id || all){

								// Reopen the tab
								$tabs.create(tab.url);

							}

						});

					}

				});

				// Remove the tab from the group
				$scope.oneTab.tabs.remove(groupId, tabId, all);

			},

			// Remove
			remove: function(groupId, tabId, all){

				// Loop through all of the groups
				angular.forEach($scope.oneTab.groups.data, function(group){

					// If groupId is the group.id
					if(groupId === group.id){

						// Loop through all of the group's tabs
						angular.forEach(group.tabs, function(tab){

							// If tabId is the tab.id or if all is requested
							if(tabId === tab.id || all){

								// Remove the tab by its index
								group.tabs.splice(group.tabs.indexOf(tab), 1);

							}

						});

						// Set store
						var store = {};
						var storeGroupName = 'tmOneTabGroup' + group.id.toString();
						store[storeGroupName] = {
							id: group.id,
							name: group.name,
							tabs: group.tabs,
							createDate: group.createDate
						};

						// Sync storage
						chrome.storage.sync.set(store);

					}

				});

			}

		}

	};

	// Initialize oneTab
	$scope.oneTab.init();

});
