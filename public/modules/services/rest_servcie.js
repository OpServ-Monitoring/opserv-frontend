/**
 * Created by Snare on 29.08.16.
 */

app.factory('RestService',function($http,$rootScope){

//------------------------------------------------Variablen--------------------------------------------------------------------------------------------------------------------------------------//
    var service = {
        dashboards: [],
        charts: [],
        securedApiPath : "/api/v2/secured", //TODO in dashboard integrieren
        publicApiPath: "/api/v2/public"
    };

//------------------------------------------------ Dashboards --------------------------------------------------------------------------------------------------------------------------------------//

    /**
     * läd alle Dashobards eines Users
     * @returns {*}
     * @param userId
     */
    service.getDashboards = function(userId){
        //DUMMY:

        var options = {
            id:"id",
            options: {
                chart: {
                    zoomType: 'x'
                },

                rangeSelector: {
                    labelStyle: {
                        display: 'none'
                    },
                    buttons: [{
                        count: 30,
                        type: 'second',
                        text: '30S'
                    }, {
                        count: 1,
                        type: 'minute',
                        text: '1M'
                    }, {
                        type: 'all',
                        text: 'All'
                    }],
                    inputEnabled: false,
                    selected: 0,
                    enabled: true
                },
                navigator: {
                    enabled: true
                }
            },
            title : {
                text : 'CPU Live Temperature'
            },

            exporting: {
                enabled: false
            },
            series: [{
                id:1,
                data:[]
            }
            ],
            loading: false,
            useHighStocks: true,
            func: function(chart) {

                //CALL REST SERVICE
                //setInterval(function () {
                //    chart.reflow()
                //}, 1000);

                service.charts.push(chart);
                //var x = (new Date()).getTime(), // current time
                //    y = Math.round(Math.random() * 100);
                //if (chart.series[0].data.length < 120) {
                //    chart.series[0].addPoint([x, y], true, false);
                //} else {
                //    chart.series[0].addPoint([x, y], true, true);
                //}
            }
        };

        var standardItemsOne = [
            { id: 0, sizeX: 4, sizeY: 3, row: 0, col: 0, displayItem: {type: CHART_CPU_LIVE, config:options} },
            //{ id: 1, sizeX: 2, sizeY: 2, row: 0, col: 2, displayItem: {type: 'text', config:options} },
            //{ id: 2, sizeX: 2, sizeY: 1, row: 0, col: 4, displayItem: {type: 'text', config:{}} },
            //{ id: 3, sizeX: 2, sizeY: 1, row: 1, col: 0, displayItem: {type: 'text', config:{}} },
            //{ id: 4, sizeX: 2, sizeY: 2, row: 1, col: 4, displayItem: {type: 'text', config:{}} },
            { id: 5, sizeX: 4, sizeY: 1, row: 3, col: 0, displayItem: {type: 'text', config:{}} }
        ];
        var standardItemstwo =[
            { id:0, sizeX: 2, sizeY: 1, row: 0, col: 0, displayItem: {type: 'text', config:options} },
            { id:1, sizeX: 2, sizeY: 2, row: 0, col: 2, displayItem: {type: 'text', config:options} }
        ];

        var dashboards=[
            { title: 'First Monitor',widgets:standardItemsOne},
            { title: 'Second Monitor',widgets:standardItemstwo}
        ];

        return $http.get('dashboards.json').then(function successCallback(response) {
            service.dashboards = dashboards;
            $rootScope.$broadcast(EVENT_DASHBOARDS_RECEIVED, true, dashboards);
        }, function errorCallback(response) {
            $rootScope.$broadcast(EVENT_DASHBOARDS_RECEIVED, false, dashboards);
        });
    };

    /**
     * speichert alles dashboards
     * @param dashboards
     * @returns {*}
     */
    service.saveDashboards = function(dashboards){
        return $http.post('/save',dashboards).then(function successCallback(response) {
            console.log(response);
            $rootScope.$broadcast("dashboards-saved", true);
        }, function errorCallback(response) {
            $rootScope.$broadcast("dashboards-saved", false);
        });
    };

    //127.0.0.1:31337/api/data/v1/components/cpu/0/cpu-cores/0/usage?realtime=true
    service.getCPULive = function(){
        //return $http.get('/api/data/v1/components/cpu/0/cpu-cores/0/usage?realtime=true').then(function successCallback(response) {
        //    console.log(response);
        //    $rootScope.$broadcast(EVENT_CPU_LIVE_DATA_RECEIVED, true, response);
        //}, function errorCallback(response) {
        //    $rootScope.$broadcast(EVENT_CPU_LIVE_DATA_RECEIVED, false, response);
        //});
        var x = (new Date()).getTime(), // current time
            y = Math.round(Math.random() * 100);
        $rootScope.$broadcast(EVENT_CPU_LIVE_DATA_RECEIVED, true, {x:x,y:y});
    };


    return service;
});


//$timeout(function() {
//    otherService.updateTestService('Mellow Yellow')
//    console.log('update with timeout fired')
//}, 3000);