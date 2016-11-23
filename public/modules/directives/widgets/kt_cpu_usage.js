/**
 * Created by Snare on 05.09.16.
 */
app.directive('ktCpuUsage', [ 'dataService',  function (dataService) {
    return {
        restrict: 'E',
        templateUrl: 'views/templates/widgets/kt_cpu_usage.html',
        controller: ['$scope','$mdDialog', function CPUUsageController($scope,$mdDialog) {
            //-------------------------- variables -------------------------------------------------------------------------

            var scope = $scope;

            scope.types =[
                {text:'Live',title:'CPU Usage - Live'},
                {text:'History',title:'CPU Usage - History'}
            ];

            scope.selectedType = {};
            selectTypeFromGivenOptions();

            scope.displayAsChart = scope.options.displayAsChart;

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
                    text : scope.selectedType.title
                },
                series: [],
                loading: true,
                useHighStocks: true,
                func: function(chart) {
                    scope.chart = chart;
                }
            };

            //-------------------------- Listener -------------------------------------------------------------------------

            scope.$watch('selectedType',function(newValue, oldValue){
                clearData();
                toggleLoading(true);
                configureHowToLoadNewData(newValue,oldValue);
                setTitle(newValue.title);
            });

            scope.$on('openSettings',function(event, dashboardIndex, widgetIndex){
                if (dashboardIndex == scope.dashboardindex && widgetIndex == scope.widgetindex){
                    $mdDialog.show({
                            controller: DialogSettingsContoller,
                            templateUrl: 'views/templates/dialog/settings_dialog.html',
                            parent: angular.element(document.body),
                            clickOutsideToClose: true,
                            fullscreen: true // Only for -xs, -sm breakpoints.
                        })
                        .then(function(answer) {

                            scope.selectedType = answer.newType;
                            scope.config.title.text = answer.newTitle;
                            // catch wrong user input
                            if(answer.newSamplingRateLive >= 500 && answer.newSamplingRateLive <= 10000){
                                scope.samplingRateLive = answer.newSamplingRateLive;
                                DataService.updateSamplingRateOfCPUUsageLive(scope.baseurl,scope.cpuId,scope.samplingRateLive);
                            }else{
                                scope.samplingRateLive = 1000;
                                DataService.updateSamplingRateOfCPUUsageLive(scope.baseurl,scope.cpuId,scope.samplingRateLive);
                            }
                        }, function() {

                        });
                }
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

            var first = true;
            scope.$on(EVENT_CI_LIVE_DATA_RECEIVED,function(event, status, baseUrl, cpuId, data){
                if (status && baseUrl == scope.baseurl && scope.selectedType.text == scope.types[0].text && cpuId == scope.cpuId){
                    if (first){
                        // create Series
                        scope.config.series = [{data:[]}];
                        first = false;
                    }
                    toggleLoading(false);
                    if (scope.config.series[0].data.length < 60) { // TODO anpassen, vielleicht abhängig von abtastrate machen
                        scope.config.series[0].data.push([data.x, data.y]);
                    } else {
                        scope.config.series[0].data.push([data.x, data.y]);
                        scope.config.series[0].data.shift();
                    }
                }else{

                }
                //console.log(scope.config.series[0].data);
            });

            scope.$on(EVENT_CI_HISTORY_DATA_RECEIVED,function(event, status, baseUrl, cpuId, data){
                if (status && baseUrl == scope.baseurl && scope.selectedType.text == scope.types[1].text && cpuId == scope.cpuId){
                    if(!scope.config.series){
                        first = true;
                        scope.config.series = [{data:[]}];
                        toggleLoading(false);
                        scope.config.series[0].data = data;
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

            function selectTypeFromGivenOptions() {
                if(scope.options.realtime==true){
                    scope.selectedType = scope.types[0]
                }else{
                    scope.selectedType = scope.types[1]
                }
            }

            function configureHowToLoadNewData(newValue, oldValue) {
                if (newValue.text == scope.types[0].text){

                    // configure how new data should arive
                    toggleAnimation(false);
                    dataService.enableCPUUsageLive(scope.baseurl,scope.cpuId,scope.samplingRateLive);
                    dataService.enableCILiveTimer(scope.baseurl, 'cpus', 0, 'usage', scope.samplingRateLive);
                }
                if (newValue.text == scope.types[1].text){

                    // configure how new data should arive
                    toggleAnimation(true);
                    dataService.getCPUUsageHistory(scope.baseurl,scope.cpuId)
                }

                if (newValue.text == scope.types[1].text && oldValue.text == scope.types[0].text){
                    dataService.disableCPUUsageLive(scope.baseurl,scope.cpuId);
                }
            }

            function setTitle(title) {
                scope.config.title.text = title;
            }

            function DialogSettingsContoller($scope, $mdDialog){
                $scope.selectedType = scope.selectedType;
                $scope.title = scope.config.title.text;
                $scope.types = scope.types;
                $scope.samplingRateLive = scope.samplingRateLive;

                $scope.cancel = function() {
                    $mdDialog.cancel();
                };

                $scope.submit = function() {

                    var answer = {};
                    answer['newTitle'] = $scope.title;
                    answer['newType'] = $scope.selectedType;
                    answer['newSamplingRateLive'] = $scope.samplingRateLive;

                    $mdDialog.hide(answer);
                };
            }

        }],
        link: function (scope, element, attr) {
            element.on('$destroy', function() {
                //aufräumen
                dataService.disableCPUUsageLive(scope.baseurl);

            });
        }
    };
}]);