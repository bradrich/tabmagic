'use strict';

angular.module('TabMagicApp')

.directive('disableAnimate', function($animate){
    return function(scope, element){
        $animate.enabled(false, element);
    };
});