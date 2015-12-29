'use strict';

angular.module('TabMagicApp')

.factory('$tabs', function($q){

	// API of factory
	var factory = {

		// Special types of tabs
		special: ['chrome-extension:', 'chrome:', 'chrome-devtools:', 'file:', 'chrome.google.com/webstore'],

		// Query
		query: function(options){
			var deferred = $q.defer();
			chrome.tabs.query(options, function(tabs){
				deferred.resolve(tabs);
			});
			return deferred.promise;
		},

		// Create
		create: function(url){
			var deferred = $q.defer();
			chrome.tabs.create({ url: url }, function(tab){
				deferred.resolve(tab);
			});
			return deferred.promise;
		},

		// Is the tab not a special type of tab and thus allowed to be listed
		notSpecial: function(tab){
			var allowed = true;
			angular.forEach(factory.special, function(special){
				if(tab.url.indexOf(special) > -1){ allowed = false; }
			});
			return allowed;
		}

	};

	return factory;

});
