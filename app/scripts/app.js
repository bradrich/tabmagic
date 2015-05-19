'use strict';
/* exported tabMagicApp */

var tabMagicApp = angular.module('TabMagicApp', [
  'LocalStorageModule'
])

.run(['$document', function($document){

	// Initialize Foundation
	$document.foundation();

}]);