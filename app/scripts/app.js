'use strict';

angular.module('TabMagicApp', ['ngAnimate', 'ngMessages', 'ngFx', 'LocalStorageModule', 'angular-momentjs', 'ui.bootstrap', 'ngMaterial', 'ui.mask', 'ui.bootstrap.collapse', 'ui.bootstrap.tooltip', 'ui.bootstrap.timepicker', 'angularInlineEdit'])

// Material design configuration
.config(function ($mdThemingProvider) {
	$mdThemingProvider.theme('default').primaryPalette('red');
})

// Runs
.run(['$document', function ($document) {

	// Initialize Foundation
	$document.foundation();
}]);
//# sourceMappingURL=app.js.map
