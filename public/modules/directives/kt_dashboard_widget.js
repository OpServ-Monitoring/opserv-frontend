/**
 * Created by Snare on 25.08.16.
 */
app.directive('ktDashboardWidget', function (RestService) {
    return {
        restrict: 'E',
        templateUrl: 'views/templates/kt_dashboard_widget.html',
        scope: {
            options: '=',
            display: '=',
            ci: '=',
            kategorie: '='
        },
        link: function (scope, element) {

            if(scope.display == CHART_CPU_LIVE){
                scope.$on(EVENT_CPU_LIVE_DATA_RECEIVED,function(event,status,data){
                    //console.log(data);
                    var chart = RestService.charts[0];
                    if(status){
                        if (chart.series[0].data.length < 120) {
                            chart.series[0].addPoint([data.x, data.y], true, false);
                        } else {
                            chart.series[0].addPoint([data.x, data.y], true, true);
                        }
                        //var chart = scope.options.getHighcharts();
                    }else{
                        //todo display Error
                    }
                });
            }


            //console.log(scope.display);
            //This is not a highcharts object. It just looks a little like one!
            if(scope.ci === 'cpu' && scope.kategorie === 'temp'){

                element.on('$destroy', function() {
                    //TODO aufräumen ,falls nötig
                    //clearInterval(loadData);
                });

            }

        }
    };
});