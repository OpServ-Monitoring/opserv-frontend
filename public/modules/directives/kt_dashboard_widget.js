/**
 * Created by Snare on 25.08.16.
 */
app.directive('ktDashboardWidget', function () {
    return {
        restrict: 'E',
        template: '<div id="content" layout-fill></div>',
        scope: {
            options: '='
        },
        link: function (scope, element) {
            console.log(scope.options);
            if(scope.options){
                Highcharts.chart('content', scope.options);
            }
            //scope.$watch(Highcharts.charts[0].sizeX,function(){
            //    console.log("changed");
            //});
        }
    };
});