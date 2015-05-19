'use strict';

tabMagicApp.controller('PopUpCtrl', ['$scope', function($scope){

	// Function to get the current window
	var getCurrentWindow = function(callback){
		chrome.windows.getCurrent({ populate: true }, function(window){
			callback(window);
		});
	};

	// Save current window tabs to $scope
	var setTabs = function(window){
		$scope.tabs = angular.copy(window.tabs);
		console.log($scope.tabs);
	};

	$scope.marks = [
		{
			title: 'Smashing magazine',
			url: 'http://www.smashingmagazine.com/'
		},
		{
			title: 'Markticle',
			url: 'https://markticle.com'
		}
	];

	// Get current window
	getCurrentWindow(setTabs);

	$scope.$watch('tabs', function(newValue){
		console.log(newValue);
	});

}]);