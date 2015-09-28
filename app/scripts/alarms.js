'use strict';

tabMagicApp.factory('$alarms', function($q){

	// API of factory
	var factory = {

		// Create alarm
		create: function(name){
			var deferred = $q.defer();
			chrome.alarms.create(name, function(){
				deferred.resolve();
			});
			return deferred.promise;
		},

		// Get
		get: function(name){
			var deferred = $q.defer();
			chrome.alarms.get(name, function(alarm){
				deferred.resolve(alarm);
			});
			return deferred.promise;
		},

		// Get all
		getAll: function(){
			var deferred = $q.defer();
			chrome.alarms.getAll(function(alarms){
				deferred.resolve(alarms);
			});
			return deferred.promise;
		},

		// Clear
		clear: function(name){
			var deferred = $q.defer();
			chrome.alarms.clear(name, function(wasCleared){
				deferred.resolve(wasCleared);
			});
			return deferred.promise;
		},

		// Clear all
		clearAll: function(){
			var deferred = $q.defer();
			chrome.alarms.clearAll(function(wasCleared){
				deferred.resolve(wasCleared);
			});
			return deferred.promise;
		}

	};

	return factory;

});