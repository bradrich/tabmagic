'use strict';

tabMagicApp.factory('$history', function($q){

	// API of factory
	var factory = {

		// Search
		search: function(options){
			var deferred = $q.defer();
			chrome.history.search(options, function(history){
				deferred.resolve(history);
			});
			return deferred.promise;
		}

	};

	return factory;

});