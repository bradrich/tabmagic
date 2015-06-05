'use strict';

tabMagicApp.factory('$sessions', [
	'$q',
function($q){

	// API of factory
	var factory = {

		// Get recently closed
		getRecentlyClosed: function(){
			var deferred = $q.defer();
			chrome.sessions.getRecentlyClosed(function(sessions){
				deferred.resolve(sessions);
			});
			return deferred.promise;
		}

	};

	return factory;

}]);