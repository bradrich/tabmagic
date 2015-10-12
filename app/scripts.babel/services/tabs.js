'use strict';

angular.module('TabMagicApp')

.factory('$tabs', function($q){

	// API of factory
	var factory = {

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

		// Is special
		isSpecial: function(tab){
			return (tab.url.indexOf('chrome-extension:') > -1 ||
				tab.url.indexOf('chrome:') > -1 ||
				tab.url.indexOf('chrome-devtools:') > -1 ||
				tab.url.indexOf('file:') > -1 ||
				tab.url.indexOf('chrome.google.com/webstore') > -1);
		}

	};

	return factory;

});