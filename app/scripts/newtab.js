'use strict';

tabMagicApp.controller('NewTabCtrl', function($scope, $q, $utils, $moment){

	// Function to remove a tab
	var removeTabs = function(tabIds){
		chrome.tabs.remove(tabIds);
	};

	// Get needed info from data storage
	$scope.newTab = $utils.dataStorage.get('tmNewTab');
	$scope.selectedTabs = $utils.dataStorage.get('tmSelectedTabs');
	$scope.selectedTabsIds = $utils.dataStorage.get('tmSelectedTabsIds');
	var savedDT = $utils.dataStorage.get('tmDateTime');
	$scope.dateTime = $moment(savedDT).format('llll');

	// Remove all selected tabs
	removeTabs($scope.selectedTabsIds);

	console.log($scope.newTab);
	console.log($scope.selectedTabs);
	console.log($scope.selectedTabsIds);
	console.log($scope.dateTime);

});