/**
 * Created by Snare on 28.08.16.
 */
/*
 * Get notified when height changes and change margin-top
 */
app.directive( 'emHeightTarget', function() {
    return {
        link: function( scope, elem, attrs ) {

            scope.$watch( '__height', function( newHeight, oldHeight ) {
                console.log(elem);
                Highcharts.charts[0].reflow();
            } );
        }
    }
} );

/*
 * Checks every $digest for height changes
 */
app.directive( 'emHeightSource', function() {

    return {
        link: function( scope, element, attrs ) {

            scope.$watch( function() {
                console.log("set");
                scope.__height = element[0].offsetHeight;
            } );
        }
    }

} );