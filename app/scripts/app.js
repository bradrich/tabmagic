'use strict';
/* exported tabMagicApp */

var tabMagicApp = angular.module('TabMagicApp', [])

.run(['$document', function($document){

	// Initialize Foundation
	$document.foundation();

}]);