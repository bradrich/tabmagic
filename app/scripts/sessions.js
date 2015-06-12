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
		},

		// Session url filter
		removeSessionsBasedOnUrl: function(session){
			return !(session.tab.url.indexOf('chrome-extension:') > -1 ||
				session.tab.url.indexOf('chrome:') > -1 ||
				session.tab.url.indexOf('chrome-devtools:') > -1 ||
				session.tab.url.indexOf('file:') > -1 ||
				session.tab.url.indexOf('chrome.google.com/webstore') > -1);
		}

	};

	return factory;

}]);