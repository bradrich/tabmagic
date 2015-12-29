'use strict';

angular.module('TabMagicApp')

.factory('$sessions', function($q, $tabs){

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

		// Recently closed session list builder that removes duplicates
		addToRecentlyClosed: function(destArray, item){
			if(factory.isSessionAllowed(item)){
				if(destArray && destArray.length > 0){
					var add = true;
					angular.forEach(destArray, function(destItem){
						if(destItem.tab.url === item.tab.url){ add = false; }
					});
					if(add){ destArray.push(item); }
				}
				else{ destArray.push(item); }
			}
		},

		// Get synced devices
		getDevices: function(){
			var deferred = $q.defer();
			chrome.sessions.getDevices(function(devices){
				deferred.resolve(devices);
			});
			return deferred.promise;
		},

		// Session url filter
		isSessionAllowed: function(session){
			if(session && session.tab && session.tab.url){
				return $tabs.notSpecial(session.tab);
			}
		}

	};

	return factory;

});
