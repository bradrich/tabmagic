'use strict';

angular.module('TabMagicApp').directive('mainSection', function () {
	return {
		restrict: 'C',
		link: function link(scope, element) {

			// Get widths
			var parentWidth = element.parent().width();
			var navWidth = element.parent().find('.nav').width();

			// Set main section width
			element.width(parentWidth - navWidth);
		}
	};
});
//# sourceMappingURL=main-section.js.map
