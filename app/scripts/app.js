'use strict';
/* exported tabMagicApp */

var tabMagicApp = angular.module('TabMagicApp', [
	'ngAnimate',
	'LocalStorageModule',
	'angular-momentjs',
	'ui.bootstrap'
])

.run(['$document', function($document){

	// Initialize Foundation
	$document.foundation();

}]);