'use strict';

angular.module('TabMagicApp').filter('notSpecialTab', function ($tabs) {
    return function (tabs) {
        if (!tabs) {
            return tabs;
        }

        // Define catch array
        var filteredTabs = [];

        // Loop through the tabs
        angular.forEach(tabs, function (tab) {
            if ($tabs.notSpecial(tab)) {
                filteredTabs.push(tab);
            }
        });

        return filteredTabs;
    };
});
//# sourceMappingURL=not-special-tab.js.map
