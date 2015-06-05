'use strict';

tabMagicApp.factory('$tabs', [
	'$q',
function($q){

	// API of factory
	var factory = {

		// Create
		create: function(url){
			var deferred = $q.defer();
			chrome.tabs.create({ url: url }, function(tab){
				deferred.resolve(tab);
			});
			return deferred.promise;
		}

	};

	return factory;

}]);