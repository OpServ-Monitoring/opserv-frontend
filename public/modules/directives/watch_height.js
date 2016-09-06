/**
 * Created by Snare on 28.08.16.
 */
/*
 * Checks every $digest for height changes
 */
app.directive( 'ktWatchSize', ['$rootScope',function(rootScope) {
    return {
        link: function( scope, element, attrs ) {
            scope.$watch( function() {
                if(scope.__height != element[0].offsetHeight ){
                    rootScope.$broadcast('item-resize',element[0]);
                    scope.__height = element[0].offsetHeight;

                }
                if(scope.__width != element[0].offsetWidth){
                    rootScope.$broadcast('item-resize',element[0]);
                    scope.__width = element[0].offsetWidth;
                }
            });
        }
    }
}]);