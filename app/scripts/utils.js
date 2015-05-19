'use strict';

tabMagicApp.factory('$utils', [
  '$rootScope',
  '$location',
  '$anchorScroll',
  'localStorageService',
  function($rootScope, $location, $anchorScroll, localStorageService){

    // API of factory
    var factory = {

      // UI display helper
      ui: {

        // State
        state: {
          showLoader: true,
          showContent: false,
          showError: false
        },

        // Content
        content: {
          showLoader: false,
          showContent: false,
          showNone: false,
          showList: false,
          showError: false
        },

        // Sections
        sections: {
          showFilter: false,
          showPagination: false
        },

        // Actions
        actions: {
          showAction: false
        },

        // Hidden info
        hiddenInfo: {
          iconInfo: true,
          iconLoading: false,
          showSection: false
        }

      },

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

      },

      // Scroll to anchor
      scrollToAnchor: function(id){
        var old = $location.hash();
        $location.hash(id);
        $anchorScroll();
        $location.hash(old);
      },

      // Redirect to location
      redirectTo: function(path){

        // Configure path
        if(path.indexOf('http') > -1){ path = path.substring(path.indexOf('#') + 1, path.length); }

        // Redirect
        $location.path(path);

      },

      // Alter names after a resource call
      alterNames: function(info){

        // Properly case the info's names
        info.firstName = factory.properCaseName(info.firstName);
        info.middleName = factory.properCaseName(info.middleName);
        info.lastName = factory.properCaseName(info.lastName);
        return info;

      },

      // Environment
      environment: {

        // Prod check
        prodCheck: function(){
          return ($environment.apiEndpoint.indexOf('prd.advanceamerica.net') > -1) ? true : false;
        }

      },

      // Time zones
      timeZones: {

        // Get name
        getName: function(abbr){
          if('EST' === abbr || 'EDT' === abbr){ return 'America/New_York'; }
          else if('CST' === abbr || 'CDT' === abbr){ return 'America/Chicago'; }
          else if('MST' === abbr || 'MDT' === abbr){ return 'America/Denver'; }
          else{ return 'America/Los_Angeles'; }
        }

      },

      // Bracketize
      bracketize: function(model, base){
        var props = model.split('.');
        return (base || props.shift()) + (props.length ? "['" + props.join("']['") + "']" : '');
      },

      // Properly case names
      properCaseName: function(name){
        if((name && name === name.toUpperCase()) || (name && name === name.toLowerCase())){

          // It is uppercase, convert it
          return name.replace(/\b(ma?c|de|le|fitz)?([a-z]+)/ig, function(whole, prefix, word){
            var ret = [];
            if(prefix){
              ret.push(prefix.charAt(0).toUpperCase());
              ret.push(prefix.substr(1).toLowerCase());
            }
            ret.push(word.charAt(0).toUpperCase());
            ret.push(word.substr(1).toLowerCase());
            return ret.join('');
          });

        }
        else{
          return name;
        }
      },

      // Add to array
      // * Function adds a data item to an array, but only if the item does not already exist in the array
      addToArray: function(dest, marker, item){

        // Is the current queue NOT empty?
        if(dest.length > 0){

          // Catcher
          var add = true;

          // Loop through current queue
          angular.forEach(dest, function(dItem){

            // Is there a marker to use?
            if(marker){

              // Does dItem[marker] equal item[marker]?
              if(dItem[marker] === item[marker]){ add = false; }

            }
            else{

              // Does dItem equal item?
              if(dItem === item){ add = false; }

            }

          });

          // Handle add or delete
          if(add){ dest.push(item); }

        }
        // Current queue IS empty
        else{ dest.push(item); }

      }

    };

    // Define necessary objects
    $rootScope.utils = {
      dataStorage: {
        set: function(name, data){ factory.dataStorage.set(name, data); },
        get: function(name){ return factory.dataStorage.get(name); },
        delete: function(name, notRoot){ factory.dataStorage.delete(name, notRoot); },
        clearAll: function(){ factory.dataStorage.clearAll(); }
      },
      redirectTo: factory.redirectTo,
      scrollToAnchor: factory.scrollToAnchor,
      alterNames: factory.alterNames
    };

    return factory;

  }]);