'use strict';

tabMagicApp.factory('$utils', [
	'$rootScope',
	'$location',
	'$anchorScroll',
	'localStorageService',
function($rootScope, $location, $anchorScroll, localStorageService){

	// API of factory
	var factory = {

		// Data storage
		dataStorage: {

			// Set
			set: function(name, data){
				$rootScope.utils.dataStorage[name] = data;
				localStorageService.add(name, data);
			},

			// Get
			get: function(name){
				return (angular.isDefined($rootScope.utils.dataStorage[name])) ? $rootScope.utils.dataStorage[name] : localStorageService.get(name);
			},

			// Delete
			delete: function(name, notRoot){
				if(notRoot){ localStorageService.remove(name); }
				else{
					delete $rootScope.utils.dataStorage[name];
					localStorageService.remove(name);
				}
			},

			// Clear all
			clearAll: function(){
				localStorageService.clearAll();
			}

		}

	};

	// Define necessary objects
	$rootScope.utils = {
		dataStorage: {
			set: function(name, data){ factory.dataStorage.set(name, data); },
			get: function(name){ return factory.dataStorage.get(name); },
			delete: function(name, notRoot){ factory.dataStorage.delete(name, notRoot); },
			clearAll: function(){ factory.dataStorage.clearAll(); }
		}
	};

	return factory;

}]);

tabMagicApp.directive('customScrollbar', function(){
	return {
		restrict: 'A',
		link: function(scope, element, attrs){

			// Set max-height
			element.css('max-height', attrs.maxHeight);

			// Put nicescroll on element
			element.niceScroll({
				zindex: '9999',
				cursorcolor: attrs.customScrollbar,
				cursorwidth: '6px',
				cursorborder: '0px solid ' + attrs.customScrollbar,
				cursorborderradius: '4px',
				bouncescroll: true,
				hidecursordelay: '800',
				railpadding: { top:0, right:2, left:0, bottom:0 }
			});
			element.getNiceScroll().resize().hide();

		}
	};
});

tabMagicApp.directive("disableAnimate", ['$animate', function($animate){
    return function(scope, element){
        $animate.enabled(false, element);
    };
}]);

tabMagicApp.directive('addBorder', function(){
	return {
		restrict: 'A',
		link: function(scope, element, attrs){

			// Check that the requested id is available
			var trigger = element.parent().find('#' + attrs.addBorder);
			if(trigger.length > 0){

				// Handle trigger scroll event
				trigger.scroll(function(){

					// If trigger is scrolled, add border
					if(trigger.scrollTop() > 5){
						element.addClass('bordered');
					}
					else{
						element.removeClass('bordered');
					}

				});

			}

		}
	};
});