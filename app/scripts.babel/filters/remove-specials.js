'use strict';

angular.module('TabMagicApp')

.filter('removeSpecials', function($tabs){
    return function(tabs){
        if(!tabs){ return tabs; }

        // Define catch array
        var filteredTabs = [];

        // Loop through the tabs
        angular.forEach(tabs, function(tab){
            if($tabs.notSpecial(tab)){ filteredTabs.push(tab); }
        });

        return filteredTabs;

    };
});
