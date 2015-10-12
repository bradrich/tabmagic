'use strict';

angular.module('TabMagicApp')

.directive('addBorder', function(){
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