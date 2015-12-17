'use strict';

angular.module('TabMagicApp').filter('momentDate', function ($moment) {
    return function (date, format) {
        if (!date) {
            return '';
        }

        console.log($moment(date));
        console.log($moment(date).fromNow());
        console.log(format);
    };
});
//# sourceMappingURL=moment-date.js.map
