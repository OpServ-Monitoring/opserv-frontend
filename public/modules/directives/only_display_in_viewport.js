/**
 * Created by Snare on 07.09.16.
 */
app.directive( 'ktOnlyDisplayInVieport',['$rootScope', function(rootScope) {
    return {
        link: function( scope, element, attrs ) {

            scope.$watch( function() {
                var isInViewport = isElementInViewport(element[0]);
                if(!isInViewport){

                    console.log("nicht in virwport");
                    element[0].style.display='none';
                    rootScope.$broadcast('notinviewport',true)
                }else{
                    console.log(" in virwport");
                    //console.log(element[0]);
                    element[0].style.display='block';
                    rootScope.$broadcast('notinviewport',false)
                }
            });

            function isElementInViewport (el) {

                ////special bonus for those using jQuery
                //if (typeof jQuery === "function" && el instanceof jQuery) {
                //    el = el[0];
                //}

                var rect = el.getBoundingClientRect();


                return (
                    rect.top >= 0 &&
                    rect.left >= 0 &&
                    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
                    rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
                );
            }
        }
    }
}]);