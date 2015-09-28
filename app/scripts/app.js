'use strict';
/* exported tabMagicApp */

var tabMagicApp = angular.module('TabMagicApp', [
	'ngAnimate',
	'ngFx',
	'LocalStorageModule',
	'angular-momentjs',
	'ui.bootstrap',
	'ngMaterial'
])

// Material design configuration
.config(function($mdThemingProvider){
	$mdThemingProvider.theme('default')
		.primaryPalette('red');
})

// Runs
.run(['$document', function($document){

	// Initialize Foundation
	$document.foundation();

}]);