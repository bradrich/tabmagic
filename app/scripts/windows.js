'use strict';

tabMagicApp.factory('$windows', [
	'$q',
function($q){

	// API of factory
	var factory = {

		// Get all
		getAll: function(){
			var deferred = $q.defer();
			chrome.windows.getAll({ populate: true }, function(windows){
				deferred.resolve(windows);
			});
			return deferred.promise;
		}

	};

	return factory;

}]);