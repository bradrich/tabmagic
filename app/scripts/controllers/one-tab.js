'use strict';

angular.module('TabMagicApp').controller('OneTabCtrl', function ($scope, $moment, $tabs) {

	// Navigation
	$scope.navigation = 'bringToOne';

	// Show requested action button
	$scope.actionButtonShow = function (button) {

		// Catcher
		var show = false;

		// Bring to one
		if ('bringToOne' === button && $scope.oneTab.data) {
			angular.forEach($scope.oneTab.data.tmOneTabSelectedTabs, function (tab) {
				if (tab.tmSelected) {
					show = true;
				}
			});
		}

		return show;
	};

	// Define one tab
	$scope.oneTab = {

		// Data
		data: null,

		// Initialize
		init: function init() {

			// Get information from storage
			chrome.storage.sync.get(['tmOneTabSelectedTabs', 'tmOneTabCreateDate'], function (items) {

				// Set data
				$scope.oneTab.data = angular.copy(items);
				$scope.oneTab.data.tmOneTabCreateDate = $moment($scope.oneTab.data.tmOneTabCreateDate).format('llll');

				// Loop through selected tabs
				angular.forEach($scope.oneTab.data.tmOneTabSelectedTabs, function (tab) {

					// Unselect tab
					tab.tmSelected = false;

					// Remove chrome tab
					chrome.tabs.remove(tab.id);
				});

				// Apply to scope
				$scope.$apply();
			});
		},

		// Reopen
		reopen: function reopen() {

			// Selected tabs
			var selected = [];
			var toRemove = [];

			// Loop through selected tabs
			angular.forEach($scope.oneTab.data.tmOneTabSelectedTabs, function (tab, index) {
				if (tab.tmSelected) {

					// Add to select
					selected.push(tab);

					// Add to remove
					toRemove.push(index);
				}
			});

			// If there are any selected tabs
			if (selected.length > 0) {

				// Loop through selected tabs
				angular.forEach(selected, function (tab) {

					// Call create from tab service
					$tabs.create(tab.url);
				});

				// Reverse then loop through toRemove
				toRemove.reverse();
				angular.forEach(toRemove, function (index) {

					// Remove tab
					$scope.oneTab.remove(index);
				});
			}
		},

		// Remove
		remove: function remove(index) {
			$scope.oneTab.data.tmOneTabSelectedTabs.splice(index, 1);
		},

		// Remove all
		removeAll: function removeAll() {
			$scope.oneTab.data.tmOneTabSelectedTabs.length = 0;
		}

	};

	// Initialize oneTab
	$scope.oneTab.init();
});
//# sourceMappingURL=one-tab.js.map
