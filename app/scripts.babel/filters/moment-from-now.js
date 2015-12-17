'use strict';

angular.module('TabMagicApp')

.filter('momentFromNow', function($moment){
    return function(date){
        if(!date){ return ''; }

        return $moment(date).fromNow();

    };
});
