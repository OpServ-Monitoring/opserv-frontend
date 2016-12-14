/**
 * Created by Snare on 25.08.16.
 */
app.directive('ktDashboardWidget',[ 'dataService',function (dataService) {
    return {
        restrict: 'E',
        templateUrl: 'views/templates/widgets/kt_dashboard_widget.html',
        scope: {
            baseurl: '=',
            widgetindex: '=',
            dashboardindex: '=',
            displayitem: '='
        },
        controller: ['$scope','$mdDialog', function CPUUsageController($scope,$mdDialog) {
            //-------------------------- variables -------------------------------------------------------------------------

            var scope = $scope;

            scope.openSettings = function () {
                $mdDialog.show({
                    controller: DialogSettingsContoller,
                    templateUrl: 'views/templates/dialog/settings_dialog.html',
                    parent: angular.element(document.body),
                    clickOutsideToClose: true,
                    fullscreen: true // Only for -xs, -sm breakpoints.
                }).then(function(answer) {
                    scope.currentMode = answer.newMode;
                    scope.displayitem.title = answer.newTitle;
                    // catch wrong user input
                    if( answer.newSamplingRateLive >= 500 && answer.newSamplingRateLive <= 10000){
                        scope.samplingRateLive = answer.newSamplingRateLive;
                    }else{
                        scope.samplingRateLive = 1000;
                    }

                }, function() {});
            };

            scope.delete = function () {
                scope.$emit("delete-widget",scope.dashboardindex,scope.widgetindex);
            };

            scope.$on('toggleEditMode',function(event, isEditing){
                scope.isEditing = isEditing;
            });

            scope.modes =[
                {text:"Live"},
                {text:"History"}
            ];

            if(scope.displayitem.realtime == true){
                scope.currentMode = scope.modes[0]
            }else{
                scope.currentMode = scope.modes[1]
            }

            scope.displayAsChart = scope.displayitem.displayAsChart;

            scope.samplingRateLive = 1000;
            scope.samplingRateHistorie = 86400000; // 1 Tag

            scope.cpuId = 0;

            scope.config = {
                options: {
                    chart: {
                        zoomType: 'x',
                        animation: true,
                        events: {
                            load: function () {
                                toggleVisibilityHighchartsButtons(scope.isEditing);
                            }
                        }
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
                    }
                },
                title : {
                    text : ""
                },
                series: [],
                loading: true,
                useHighStocks: true,
                func: function(chart) {
                    scope.chart = chart;
                }
            };

            //-------------------------- Listener -------------------------------------------------------------------------

            scope.$watch('currentMode',function(newMode, oldMode){
                clearData();
                toggleLoading(true);
                configureHowToLoadNewData(newMode,oldMode);
                setChartTitle();
            });

            scope.$on('item-resize',function(event,container){
                if (scope.chart && container == scope.chart.container){
                    scope.chart.reflow()
                }
            });

            scope.$on('toggleEditMode',function(event, isEditing){
                scope.isEditing = isEditing;
                toggleVisibilityHighchartsButtons(isEditing);
            });

            scope.$on(EVENT_CI_LIVE_DATA_RECEIVED,function(event, status, baseUrl, ci, id, category, data){
                if (status && baseUrl == scope.baseurl &&
                    scope.currentMode.text == scope.modes[0].text &&
                    ci == scope.displayitem.ci &&
                    id == scope.displayitem.id &&
                    category == scope.displayitem.category){
                    console.log(ci, id, category, data);
                    if (!scope.config.series){
                        // create Series
                        scope.config.series = [{id:ci+id+category,data:[]}];
                    }
                    toggleLoading(false);
                    if (scope.config.series[0].data.length < 60) { // TODO anpassen, vielleicht abhängig von abtastrate machen
                        scope.config.series[0].data.push([data.timestamp, data.value]);
                    } else {
                        scope.config.series[0].data.push([data.timestamp, data.value]);
                        scope.config.series[0].data.shift();
                    }
                }else{
                    // do nothing, not the right data
                }
            });

            scope.$on(EVENT_CI_HISTORY_DATA_RECEIVED,function(event, status, baseUrl, ci, id, category, data){
                if (status && baseUrl == scope.baseurl &&
                    scope.currentMode.text == scope.modes[1].text &&
                    ci == scope.displayitem.ci &&
                    id == scope.displayitem.id &&
                    category == scope.displayitem.category){
                    if(!scope.config.series){
                        scope.config.series = data;
                        toggleLoading(false);
                    }else{
                        console.log("series: ",scope.config.series)
                    }
                }else{

                }
            });


            //-------------------------- Helper ----------------------------------------------------------------------------

            function toggleVisibilityHighchartsButtons(isEditing) {
                // hide or show all highcharts buttons
                var result = document.getElementsByClassName("highcharts-button");
                angular.forEach(result, function (object) {
                    if (isEditing) {
                        object.style.display = 'none'
                    } else {
                        object.style.display = 'block'
                    }
                });
            }

            function clearData() {
                //delete old data
                delete scope.config.series;
            }

            function toggleLoading(b) {
                scope.config.loading = b;
            }

            function toggleAnimation(b){
                scope.config.options.chart.animation = b;
            }

            //TODO anpassen, variablen verständlicher machen
            function configureHowToLoadNewData(newMode, oldMode) {
                console.log(newMode);
                if (newMode.text == scope.modes[0].text){
                    console.log("live daten laden");
                    // configure how new data should arive
                    toggleAnimation(false);
                    //dataService.enableCPUUsageLive(scope.baseurl,scope.cpuId,scope.samplingRateLive);
                    dataService.enableCILiveTimer(scope.baseurl, scope.displayitem.ci, scope.displayitem.id, scope.displayitem.category, scope.samplingRateLive);
                }
                if (newMode.text == scope.modes[1].text){
                    console.log("history daten laden");
                    // configure how new data should arive
                    toggleAnimation(true);
                    dataService.getCiHistoryData(scope.baseurl,scope.displayitem.ci, scope.displayitem.id, scope.displayitem.category)
                }

                if (newMode.text == scope.modes[1].text && oldMode.text == scope.modes[0].text){
                    console.log("delete intervalrr in direktive");
                    dataService.disableCiLiveTimer(scope.baseurl,scope.displayitem.ci, scope.displayitem.id, scope.displayitem.category);
                }
            }

            function setChartTitle() {
                delete scope.config.title.text;
                scope.config.title.text = scope.displayitem.title+ " - " +scope.currentMode.text;
            }

            function DialogSettingsContoller($scope, $mdDialog){
                $scope.currentMode = scope.currentMode;
                $scope.title = scope.displayitem.title;
                $scope.modes = scope.modes;
                $scope.samplingRateLive = scope.samplingRateLive;

                $scope.cancel = function() {
                    $mdDialog.cancel();
                };

                $scope.submit = function() {

                    var answer = {};
                    answer['newTitle'] = $scope.title;
                    answer['newMode'] = $scope.currentMode;
                    answer['newSamplingRateLive'] = $scope.samplingRateLive;

                    $mdDialog.hide(answer);
                };
            }



        }],
        link: function (scope, element) {

            element.on('$destroy', function() {
                dataService.disableCiLiveTimer(scope.baseurl,scope.displayitem.ci,scope.displayitem.id,scope.displayitem.category);
            });

        }
    };
}]);