/**
 * Created by Snare on 05.09.16.
 */
app.directive('ktCpuLive', [ 'RestService', '$rootScope',  function (RestService,$rootScope) {
    return {
        restrict: 'E',
        templateUrl: 'views/templates/kt_cpu_live.html',
        scope: {
            options: '=',
            baseurl: '=',
            widgetindex: '=',
            dashboardindex: '='
        },
        controller: ['$scope','$mdDialog', function CPUUsageController($scope,$mdDialog) {
            var scope = $scope;

            scope.isEditing = false;
            scope.selectedType = {text:'Live',title:'CPU Usage - Live'};
            scope.samplingRate = 1000;

            scope.types =[
                {text:'Live',title:'CPU Usage - Live'},
                {text:'History',title:'CPU Usage - History'}
            ];

            scope.config = {
                options: {
                    chart: {
                        zoomType: 'x',
                        animation: false
                    },

                    rangeSelector: {
                        labelStyle: {
                            display: 'none'
                        },
                        buttonTheme: { // styles for the buttons
                            fill: 'none',
                            style: {
                                fontWeight: 'bold'
                            },
                            states :{
                                hover:{
                                    fill:'none'
                                },
                                select:{
                                    fill:'none',
                                    style:{
                                        color:'#00b8d4'
                                    }
                                },
                                disabled:{
                                    style:{
                                        color :'#444444'
                                    }
                                }
                            }
                        },
                        buttonSpacing:10,
                        buttons: [{
                            count: 20,
                            type: 'second',
                            text: '30s'
                        }, {
                            count: 40,
                            type: 'second',
                            text: '40s'
                        }, {
                            type: 'all',
                            text: 'All'
                        }],
                        inputEnabled: false
                        //selected: 0,
                        //enabled: true
                    },
                    navigator: {
                        enabled: true
                    },
                    navigation:{
                        buttonOptions: {
                            theme: {
                                states: {
                                    hover: {
                                        fill: 'rgb(80, 80, 83)',
                                        stroke: 'rgba(255,255,255,0.87)',
                                        style:{
                                            color: '#000'
                                        }
                                    },
                                    select: {
                                        stroke: 'rgba(255,255,255,0.87)',
                                        fill: 'rgba(255,255,255,0.2)'
                                    }
                                }
                            }
                        },
                        menuStyle: {
                            background: '#242424',
                            'box-shadow': '0px 0px 0px #fff',
                            'border-color': '#242424'
                        },
                        menuItemStyle: {
                            color: 'rgba(255,255,255,0.87)',
                            'font-family': '"Roboto", "Helvetica", "Arial", sans-serif'
                        },
                        menuItemHoverStyle: {
                            background: 'rgba(255,255,255,0.2)'
                        }
                    },
                    loading: {
                        style: {
                            backgroundColor: 'silver'
                        },
                        labelStyle: {
                            color: 'black'
                        }
                    },
                },
                title : {
                    text : scope.selectedType.title
                },
                series: [{
                    id:1,
                    data:[]
                }
                ],
                loading: true,
                useHighStocks: true,
                func: function(chart) {
                    scope.chart = chart;
                }
            };

            scope.$watch('selectedType',function(newValue, oldValue){
                // andere daten laden
                if(newValue.text == scope.types[0].text){
                    //delete old data
                    for(var i = 0; i < scope.config.series[0].data.length; i++){
                        scope.config.series[0].data.splice(i);
                    }
                    // no animation for dynamic data
                    scope.config.options.chart.animation = false;
                    // enable Loading
                    scope.config.loading = true;
                    // configure how new data should arive
                    RestService.enableCPUUsageLive(scope.baseurl,scope.samplingRate);
                }
                if(newValue.text == scope.types[1].text){

                    // enable Loading
                    scope.config.loading = true;
                    // configure how new data should arive
                    RestService.disableCPUUsageLive(scope.baseurl);
                    RestService.getCPUUsageHistory(scope.baseurl)
                }
                // überschrift ändern
                scope.config.title.text = newValue.title;
            });




            scope.delete = function () {
                scope.$emit("delete-widget",scope.dashboardindex,scope.widgetindex);
            };

            scope.openSettings = function(ev){

                $mdDialog.show({
                        controller: DialogContoller,
                        templateUrl: 'views/templates/dialog/settings_dialog.html',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        clickOutsideToClose: true,
                        fullscreen: true // Only for -xs, -sm breakpoints.
                    })
                    .then(function(answer) {

                        scope.selectedType = answer.newType;
                        scope.config.title.text = answer.newTitle;
                        // catch wrong user input
                        if(answer.newSamplingRate > 500 && answer.newSamplingRate < 10000){
                            scope.samplingRate = answer.newSamplingRate;
                            RestService.updateSamplingRateOfCPUUsageLive(scope.baseurl,scope.samplingRate);
                        }else{
                            scope.samplingRate = 1000;
                            RestService.updateSamplingRateOfCPUUsageLive(scope.baseurl,scope.samplingRate);
                        }


                    }, function() {

                    });
            };


            function DialogContoller($scope, $mdDialog){
                $scope.selectedType = scope.selectedType;
                $scope.title = scope.config.title.text;
                $scope.types = scope.types;
                $scope.samplingRate = scope.samplingRate;

                $scope.cancel = function() {
                    $mdDialog.cancel();
                };

                $scope.submit = function() {

                    var answer = {};
                    answer['newTitle'] = $scope.title;
                    answer['newType'] = $scope.selectedType;
                    answer['newSamplingRate'] = $scope.samplingRate;

                    $mdDialog.hide(answer);
                };
            }

            scope.$on('item-resize',function(event,container){
                if (container == scope.chart.container){
                    scope.chart.reflow()
                }
            });

            scope.$on('toggleEditMode',function(event, isEditing){
                scope.isEditing = isEditing;
                // hide all highcharts buttons
                var result = document.getElementsByClassName("highcharts-button");
                angular.forEach(result,function(object){
                    if (isEditing){
                        object.style.display = 'none'
                    }else{
                        object.style.display = 'block'
                    }
                });
            });

            scope.$on(EVENT_CPU_LIVE_DATA_RECEIVED,function(event,status,baseUrl,data){
                if (status && baseUrl == scope.baseurl && scope.selectedType.text == scope.types[0].text){

                    scope.config.loading = false;
                    if (scope.config.series[0].data.length < 60) { // TODO warschienlich anpassen , wirft manchmal fehler anpassen
                        scope.config.series[0].data.push([data.x, data.y]);
                        //scope.chart.series[0].addPoint([data.x, data.y], true, false);
                    } else {
                        scope.config.series[0].data.push([data.x, data.y]);
                        scope.config.series[0].data.shift();
                        //scope.chart.series[0].addPoint([data.x, data.y], true, true);
                    }
                }else{

                }
            });

            scope.$on(EVENT_CPU_HISTORY_DATA_RECEIVED,function(event,status,baseUrl,data){
                if (status && baseUrl == scope.baseurl && scope.selectedType.text == scope.types[1].text){
                    scope.config.loading = false;
                    for(var i = 0; i < scope.config.series[0].data.length; i++){
                        scope.config.series[0].data.splice(i);
                    }
                    scope.config.options.chart.animation = true;
                    scope.config.series[0].data = data;
                }else{

                }
            });



        }],
        link: function (scope, element, attr) {


            element.on('$destroy', function() {
                //aufräumen
                RestService.disableCPUUsageLive(scope.baseurl);

            });
        }
    };
}]);