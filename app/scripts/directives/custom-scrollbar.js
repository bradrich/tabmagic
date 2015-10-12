'use strict';

angular.module('TabMagicApp').directive('customScrollbar', function () {
	return {
		restrict: 'A',
		link: function link(scope, element, attrs) {

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
				railpadding: { top: 0, right: 2, left: 0, bottom: 0 }
			});
			element.getNiceScroll().resize().hide();
		}
	};
});
//# sourceMappingURL=custom-scrollbar.js.map
