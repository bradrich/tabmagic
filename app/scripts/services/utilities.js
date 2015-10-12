'use strict';

angular.module('TabMagicApp').factory('$utils', function ($rootScope, $location, $anchorScroll, localStorageService) {

	// API of factory
	var factory = {

		// Data storage
		dataStorage: {

			// Set
			set: function set(name, data) {
				$rootScope.utils.dataStorage[name] = data;
				localStorageService.add(name, data);
			},

			// Get
			get: function get(name) {
				return angular.isDefined($rootScope.utils.dataStorage[name]) ? $rootScope.utils.dataStorage[name] : localStorageService.get(name);
			},

			// Delete
			'delete': function _delete(name, notRoot) {
				if (notRoot) {
					localStorageService.remove(name);
				} else {
					delete $rootScope.utils.dataStorage[name];
					localStorageService.remove(name);
				}
			},

			// Clear all
			clearAll: function clearAll() {
				localStorageService.clearAll();
			}

		}

	};

	// Define necessary objects
	$rootScope.utils = {
		dataStorage: {
			set: function set(name, data) {
				factory.dataStorage.set(name, data);
			},
			get: function get(name) {
				return factory.dataStorage.get(name);
			},
			'delete': function _delete(name, notRoot) {
				factory.dataStorage['delete'](name, notRoot);
			},
			clearAll: function clearAll() {
				factory.dataStorage.clearAll();
			}
		}
	};

	return factory;
});
//# sourceMappingURL=utilities.js.map
