'use strict';

angular.module('TabMagicApp')

.factory('$utils', function($rootScope, $location, $anchorScroll, localStorageService){

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

});