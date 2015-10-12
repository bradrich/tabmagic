'use strict';

angular.module('TabMagicApp').factory('$windows', function ($q) {

	// API of factory
	var factory = {

		// Get all
		getAll: function getAll() {
			var deferred = $q.defer();
			chrome.windows.getAll({ populate: true }, function (windows) {
				deferred.resolve(windows);
			});
			return deferred.promise;
		}

	};

	return factory;
});
//# sourceMappingURL=windows.js.map
