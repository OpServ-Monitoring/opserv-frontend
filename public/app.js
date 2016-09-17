/**
 * Created by Snare on 24.08.16.
 */

const EVENT_DASHBOARDS_RECEIVED = "dashboards_received";
const EVENT_CPU_LIVE_DATA_RECEIVED = "cpu_live_data_received";
const EVENT_CPU_HISTORY_DATA_RECEIVED = "cpu_history_data_received";


//Chart Types
const CHART_CPU_LIVE = "chart_cpu_live";


var app = angular.module('app',[
    'ngRoute',
    'gridster',
    'ngMaterial',
    'highcharts-ng',
    'angularViewportWatch',
    'ngMockE2E'
]);

app.config(function($mdThemingProvider) {
    $mdThemingProvider.definePalette('black', {
        '50': '242424',
        '100': '242424',
        '200': '242424',
        '300': '242424',
        '400': '242424',
        '500': '242424',
        '600': '242424',
        '700': '242424',
        '800': '242424',
        '900': '242424',
        'A100': '242424',
        'A200': '242424',
        'A400': '242424',
        'A700': '242424',
        'contrastDefaultColor': 'light'
    });
    $mdThemingProvider.definePalette('white', {
        '50': 'ffffff',
        '100': 'ffffff',
        '200': 'ffffff',
        '300': 'ffffff',
        '400': 'ffffff',
        '500': 'ffffff',
        '600': 'ffffff',
        '700': 'ffffff',
        '800': 'ffffff',
        '900': 'ffffff',
        'A100': 'ffffff',
        'A200': 'ffffff',
        'A400': 'ffffff',
        'A700': 'ffffff',
        'contrastDefaultColor': 'dark'
    });
    $mdThemingProvider.definePalette('blue', {
        '50': '00b8d4',
        '100': '00b8d4',
        '200': '00b8d4',
        '300': '00b8d4',
        '400': '00b8d4',
        '500': '00b8d4',
        '600': '00b8d4',
        '700': '00b8d4',
        '800': '00b8d4',
        '900': '00b8d4',
        'A100': '00b8d4',
        'A200': '00b8d4',
        'A400': '00b8d4',
        'A700': '00b8d4',
        'contrastDefaultColor': 'light'
    });

    $mdThemingProvider.theme('default')
        .primaryPalette('black')
        .backgroundPalette('white')
        .accentPalette('blue')
        .dark();

});

app.config(function(){
    //HIGHCHARTS OPTIONS:

    /**
     * Dark theme for Highcharts JS
     * @author Torstein Honsi
     */

// Load the fonts
    Highcharts.createElement('link', {
        href: 'https://fonts.googleapis.com/css?family=Unica+One',
        rel: 'stylesheet',
        type: 'text/css'
    }, null, document.getElementsByTagName('head')[0]);

    Highcharts.theme = {
        colors: ["#2b908f", "#90ee7e", "#f45b5b", "#7798BF", "#aaeeee", "#ff0066", "#eeaaee",
            "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"],
        chart: {
            backgroundColor: {
                linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
                stops: [
                    [0, '#2a2a2b'],
                    [1, '#3e3e40']
                ]
            },
            style: {
                fontFamily: "'Unica One', sans-serif"
            },
            plotBorderColor: '#606063'
        },
        title: {
            style: {
                color: '#E0E0E3',
                textTransform: 'uppercase',
                fontSize: '20px'
            }
        },
        subtitle: {
            style: {
                color: '#E0E0E3',
                textTransform: 'uppercase'
            }
        },
        xAxis: {
            gridLineColor: '#707073',
            labels: {
                style: {
                    color: '#E0E0E3'
                }
            },
            lineColor: '#707073',
            minorGridLineColor: '#505053',
            tickColor: '#707073',
            title: {
                style: {
                    color: '#A0A0A3'

                }
            }
        },
        yAxis: {
            gridLineColor: '#707073',
            labels: {
                style: {
                    color: '#E0E0E3'
                }
            },
            lineColor: '#707073',
            minorGridLineColor: '#505053',
            tickColor: '#707073',
            tickWidth: 1,
            title: {
                style: {
                    color: '#A0A0A3'
                }
            }
        },
        tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            style: {
                color: '#F0F0F0'
            }
        },
        plotOptions: {
            series: {
                dataLabels: {
                    color: '#B0B0B3'
                },
                marker: {
                    lineColor: '#333'
                }
            },
            boxplot: {
                fillColor: '#505053'
            },
            candlestick: {
                lineColor: 'white'
            },
            errorbar: {
                color: 'white'
            }
        },
        legend: {
            itemStyle: {
                color: '#E0E0E3'
            },
            itemHoverStyle: {
                color: '#FFF'
            },
            itemHiddenStyle: {
                color: '#606063'
            }
        },
        credits: {
            style: {
                color: '#666'
            }
        },
        labels: {
            style: {
                color: '#707073'
            }
        },

        drilldown: {
            activeAxisLabelStyle: {
                color: '#F0F0F3'
            },
            activeDataLabelStyle: {
                color: '#F0F0F3'
            }
        },

        navigation: {
            buttonOptions: {
                symbolStroke: '#DDDDDD',
                theme: {
                    fill: '#505053'
                }
            }
        },

        // scroll charts
        rangeSelector: {
            buttonTheme: {
                fill: '#505053',
                stroke: '#000000',
                style: {
                    color: '#CCC'
                },
                states: {
                    hover: {
                        fill: '#707073',
                        stroke: '#000000',
                        style: {
                            color: 'white'
                        }
                    },
                    select: {
                        fill: '#000003',
                        stroke: '#000000',
                        style: {
                            color: 'white'
                        }
                    }
                }
            },
            inputBoxBorderColor: '#505053',
            inputStyle: {
                backgroundColor: '#333',
                color: 'silver'
            },
            labelStyle: {
                color: 'silver'
            }
        },

        navigator: {
            handles: {
                backgroundColor: '#666',
                borderColor: '#AAA'
            },
            outlineColor: '#CCC',
            maskFill: 'rgba(255,255,255,0.1)',
            series: {
                color: '#7798BF',
                lineColor: '#A6C7ED'
            },
            xAxis: {
                gridLineColor: '#505053'
            }
        },

        scrollbar: {
            barBackgroundColor: '#808083',
            barBorderColor: '#808083',
            buttonArrowColor: '#CCC',
            buttonBackgroundColor: '#606063',
            buttonBorderColor: '#606063',
            rifleColor: '#FFF',
            trackBackgroundColor: '#404043',
            trackBorderColor: '#404043'
        },

        // special colors for some of the
        legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
        background2: '#505053',
        dataLabelsColor: '#B0B0B3',
        textColor: '#C0C0C0',
        contrastTextColor: '#F0F0F3',
        maskColor: 'rgba(255,255,255,0.3)'
    };

    // Apply the theme
    Highcharts.setOptions(Highcharts.theme);
});

app.run(function($rootScope) {

    // Admin Rolle in Root Scope laden, damit sie in HTML zugreifbar ist
    $rootScope.CHART_CPU_LIVE = CHART_CPU_LIVE;
});

app.config(function ($routeProvider) {
    //TODO enable authentification
    $routeProvider.when("/",{
        templateUrl: "views/dashboards.html",
        name: "Dashboards",
        controller: 'DashboardCtrl'
        //requiresLogin: true
    }).otherwise({
        redirectTo: "/"
    });
});


app.run(function($httpBackend) {
    var standardItemsOne = [
        { id: 0, sizeX: 20, sizeY: 12, row: 0, col: 0, displayItem: {type: CHART_CPU_LIVE, config:{}} }
        //{ id: 1, sizeX: 2, sizeY: 2, row: 0, col: 2, displayItem: {type: 'text', config:options} },
        //{ id: 2, sizeX: 2, sizeY: 1, row: 0, col: 4, displayItem: {type: 'text', config:{}} },
        //{ id: 3, sizeX: 2, sizeY: 1, row: 1, col: 0, displayItem: {type: 'text', config:{}} },
        //{ id: 4, sizeX: 2, sizeY: 2, row: 1, col: 4, displayItem: {type: 'text', config:{}} },
        //{ id: 1, sizeX: 3, sizeY: 3, row: 27, col: 0, displayItem: {type: 'text', config:{}} }
    ];
    var standardItemstwo =[
        { id:0, sizeX: 10, sizeY: 12, row: 0, col: 0, displayItem: {type: '', config:{}} }
        //{ id:1, sizeX: 2, sizeY: 2, row: 13, col: 2, displayItem: {type: 'text', config:{}} }
    ];

    var dashboards=[
        { title: 'First Monitor',widgets:standardItemsOne, baseUrl: 'http://127.0.0.1:31337'},
        { title: 'Second Monitor',widgets:standardItemstwo, baseUrl: 'http://127.0.0.1:31337'},
        { title: 'Monitor',widgets:standardItemstwo, baseUrl: 'http://127.0.0.1:31337'}
    ];


    $httpBackend.when('GET','http://127.0.0.1:31337/api/data/v1/components/cpu/0/cpu-cores/0/usage?realtime=true').respond(function(status, data, headers, statusText) {
        var x = (new Date()).getTime(), // current time
            y = Math.round(Math.random() * 100);
        return [200, {usage:y}];
    });

    $httpBackend.when('GET','http://127.0.0.1:31337/api/data/v1/components/cpu/0/cpu-cores/0/usage?history=true').respond(function(status, data, headers, statusText) {
        // generate an array of random data
        var values = [], time = (new Date()).getTime(), i;

        for (i = -99; i <= 0; i += 1) {
            values.push([
                time + i * 1000,
                Math.round(Math.random() * 100)
            ]);
        }
        return [200, values];
    });


    $httpBackend.whenGET('/dashboards').respond(dashboards);


    //// adds a new phone to the phones array
    //$httpBackend.whenPOST('/phones').respond(function(method, url, data) {
    //    var phone = angular.fromJson(data);
    //    phones.push(phone);
    //    return [200, phone, {}];
    //});
    $httpBackend.whenGET('views/dashboards.html').passThrough(); // Requests for templates are handled by the real server
    $httpBackend.whenGET('views/templates/kt_dashboard_widget.html').passThrough();
    $httpBackend.whenGET('views/templates/kt_dashboards_toolbar.html').passThrough();
    $httpBackend.whenGET('views/templates/kt_cpu_live.html').passThrough();
    $httpBackend.whenGET('views/templates/kt_dashboard_edit_toolbar.html').passThrough();
    $httpBackend.whenGET('views/templates/kt_dashboard_fab.html').passThrough();
    $httpBackend.whenGET('views/templates/widget_fab_speed_dial.html').passThrough();
    $httpBackend.whenGET('views/templates/dialog/settings_dialog.html').passThrough();



});


//var myAppDev = angular.module('myAppDev', ['myApp', 'ngMockE2E']);
//myAppDev.run(function($httpBackend) {
//    var phones = [{name: 'phone1'}, {name: 'phone2'}];
//
//    // returns the current list of phones
//    $httpBackend.whenGET('/phones').respond(phones);
//
//    // adds a new phone to the phones array
//    $httpBackend.whenPOST('/phones').respond(function(method, url, data) {
//        var phone = angular.fromJson(data);
//        phones.push(phone);
//        return [200, phone, {}];
//    });
//    $httpBackend.whenGET(/^\/templates\//).passThrough(); // Requests for templates are handled by the real server
//    //...
//});