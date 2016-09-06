/**
 * Created by Snare on 05.09.16.
 */
app.directive('ktCpuLive', [ 'RestService',  function (Restservice) {
    return {
        restrict: 'E',
        template: '<highchart id="id" layout-fill="" config="options"></highchart>',
        scope: {
            options: '='
        },
        link: function (scope, element, attr) {

            //call RestService

            setInterval(function () {
                Restservice.getCPULive();
            }, 1000);


            //scope.$on("abc",function(event,status,data){
            //    console.log("dritte received");
            //    if(status){
            //        console.log("drin");
            //        var chart = scope.options.getHighcharts();
            //        setInterval(function () {
            //            var x = (new Date()).getTime(), // current time
            //                y = Math.round(Math.random() * 100);
            //            if (chart.series[0].data.length < 120) {
            //                chart.series[0].addPoint([x, y], true, false);
            //            } else {
            //                chart.series[0].addPoint([x, y], true, true);
            //            }
            //        }, 1000);
            //    }else{
            //        //todo display Error
            //    }
            //});


            //var chart = scope.options.getHighcharts;
            //console.log(chart);
            //setInterval(function () {
            //    var x = (new Date()).getTime(), // current time
            //        y = Math.round(Math.random() * 100);
            //    if (chart.series[0].data.length < 120) {
            //        chart.series[0].addPoint([x, y], true, false);
            //    } else {
            //        chart.series[0].addPoint([x, y], true, true);
            //    }
            //}, 1000);

        }
    };
}]);