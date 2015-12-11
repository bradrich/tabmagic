'use strict';

angular.module('TabMagicApp', [
	'ngAnimate',
	'ngFx',
	'LocalStorageModule',
	'angular-momentjs',
	'ui.bootstrap',
	'ngMaterial',
	'ui.bootstrap.collapse',
	'ui.bootstrap.tooltip',
	'ui.bootstrap.timepicker'
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
