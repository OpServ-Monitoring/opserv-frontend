/**
 * Created by Snare on 25.08.16.
 */
app.directive('ktDashboardWidget', function () {
    return {
        restrict: 'E',
        templateUrl: 'views/templates/kt_dashboard_widget.html',
        scope: {
            options: '=',
            display: '=',
            baseurl: '=',
            widgetindex: '=',
            dashboardindex: '='
        },
        link: function (scope, element) {

            //if(scope.display == CHART_CPU_LIVE){
            //    scope.$on(EVENT_CPU_LIVE_DATA_RECEIVED,function(event,status,data){
            //        //console.log(data);
            //
            //    });
            //}


            //console.log(scope.display);
            //This is not a highcharts object. It just looks a little like one!
            element.on('$destroy', function() {
                //TODO aufräumen ,falls nötig
                //clearInterval(loadData);
            });

        }
    };
});