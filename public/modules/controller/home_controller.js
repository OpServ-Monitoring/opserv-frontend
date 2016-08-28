/**
 * Created by Snare on 24.08.16.
 */
app.controller('Ctrl',function($scope,$mdDialog,$timeout){
    var scope = $scope;



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


    scope.isFabOpen = false;
    scope.isEditMode = false;
    var chartOptions = {
        title: {
            text:'testtitel'
        },
        chart:{
            events:{
                load:function(){
                    var chart = this;
                    setTimeout(function(){
                        chart.reflow();
                    },60)
                }
            }
        },
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        legend: {
            align: 'left',
            verticalAlign: 'top',
            y: 10,
            floating: true,
            borderWidth: 0
        },

        tooltip: {
            shared: true,
            crosshairs: true
        },

        //plotOptions: {
        //    line: {
        //        dataLabels: {
        //            enabled: true
        //        },
        //        enableMouseTracking: false
        //    }
        //},

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }]
    };
    console.log(scope.chartOptions);



    scope.gridsterOpts = {
        columns: 6, // the width of the grid, in columns
        pushing: false, // whether to push other items out of the way on move or resize
        floating: false, // whether to automatically float items up so they stack (you can temporarily disable if you are adding unsorted items with ng-repeat)
        swapping: false, // whether or not to have items of the same size switch places instead of pushing down if they are the same size
        width: 'auto', // can be an integer or 'auto'. 'auto' scales gridster to be the full width of its containing element
        colWidth: 'auto', // can be an integer or 'auto'.  'auto' uses the pixel width of the element divided by 'columns'
        rowHeight: 'match', // can be an integer or 'match'.  Match uses the colWidth, giving you square widgets.
        margins: [15, 15], // the pixel distance between each widget
        outerMargin: true, // whether margins apply to outer edges of the grid
        isMobile: false, // stacks the grid items if true
        mobileBreakPoint: 500, // if the screen is not wider that this, remove the grid layout and stack the items
        mobileModeEnabled: true, // whether or not to toggle mobile mode when screen width is less than mobileBreakPoint
        minColumns: 1, // the minimum columns the grid must have
        minRows: 2, // the minimum height of the grid, in rows
        maxRows: 10,
        defaultSizeX: 2, // the default width of a gridster item, if not specifed
        defaultSizeY: 1, // the default height of a gridster item, if not specified
        //minSizeX: 20, // minimum column width of an item
        //maxSizeX: 40, // maximum column width of an item
        //minSizeY: 20, // minumum row height of an item
        //maxSizeY: 40 // maximum row height of an item
        resizable: {
            enabled: false,
            handles: ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'],
            //start: function(event, $element, widget) {}, // optional callback fired when resize is started,
            resize: function(event, $element, widget) {
                Highcharts.charts[0].reflow();
            }, // optional callback fired when item is resized,
            stop: function(event, $element, widget) {
                Highcharts.charts[0].reflow();
            } // optional callback fired when item is finished resizing
        },
        draggable: {
            enabled: false // whether dragging items is supported
            //handle: '.my-class' // optional selector for drag handle
            //start: function(event, $element, widget) {}, // optional callback fired when drag is started,
            //drag: function(event, $element, widget) {}, // optional callback fired when item is moved,
            //stop: function(event, $element, widget) {} // optional callback fired when item is finished dragging
        }
    };

    var standardItemsOne = [
        { sizeX: 2, sizeY: 1, row: 0, col: 0 , options:chartOptions},
        { sizeX: 2, sizeY: 2, row: 0, col: 2 },
        { sizeX: 2, sizeY: 1, row: 0, col: 4 },
        { sizeX: 2, sizeY: 1, row: 1, col: 0 },
        { sizeX: 2, sizeY: 2, row: 1, col: 4 },
        { sizeX: 4, sizeY: 1, row: 2, col: 0 }
    ];
    var standardItemstwo =[
        { sizeX: 2, sizeY: 1, row: 0, col: 0 },
        { sizeX: 2, sizeY: 2, row: 0, col: 2 }
    ];

    scope.tabs=[
        { title: 'First Monitor',items:standardItemsOne},
        { title: 'Second Monitor',items:standardItemstwo}
    ];

    scope.tabby =[
        {title: 'One'},
        {title: 'Two'}
    ];




    var originatorEv;
    scope.openMenu = function($mdOpenMenu, ev) {
        originatorEv = ev;
        $mdOpenMenu(ev);
    };

    scope.addDashboard = function(){
        scope.tabs.push({
            title:'two',
            standardItems:standardItemstwo
        })
    };

    scope.deleteCurrentDashboard = function(tab){
        var index = scope.tabs.indexOf(tab);
        scope.tabs.splice(index,1);
    };

    scope.addItem = function(tab){
        var tabIndex = scope.tabs.indexOf(tab);
        scope.tabs[tabIndex].items.push({ sizeX: 2, sizeY: 2, row: 0, col: 0 });
    };

    scope.deleteTabItem = function(tab,item){
        var tabIndex = scope.tabs.indexOf(tab);
        var itemIndex = scope.tabs[tabIndex].items.indexOf(item);
        scope.tabs[tabIndex].items.splice(itemIndex,1);
    };

    scope.toggleEditMode = function(){
        if(!scope.isEditMode){
            scope.gridsterOpts.pushing = true;
            scope.gridsterOpts.floating = true;
            scope.gridsterOpts.swapping = true;
            scope.gridsterOpts.resizable.enabled = true;
            scope.gridsterOpts.draggable.enabled = true;
        }else{
            scope.gridsterOpts.pushing = false;
            scope.gridsterOpts.floating = false;
            scope.gridsterOpts.swapping = false;
            scope.gridsterOpts.resizable.enabled = false;
            scope.gridsterOpts.draggable.enabled = false;
        }
        scope.isEditMode = !scope.isEditMode;
    };





});