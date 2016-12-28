/**
 * Created by Snare on 24.08.16.
 */
app.controller('DashboardCtrl',function($scope, $rootScope, prefService, $mdSidenav, $mdToast, $timeout){
    var scope = $scope;
    var rootScope = $rootScope;

    scope.isFabOpen = false;
    rootScope.isEditMode = false;

    scope.gridsterOpts = {
        columns: 30, // the width of the grid, in columns
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
        maxRows: 100,
        defaultSizeX: 2, // the default width of a gridster item, if not specifed
        defaultSizeY: 1, // the default height of a gridster item, if not specified
        //minSizeX: 20, // minimum column width of an item
        //maxSizeX: 40, // maximum column width of an item
        //minSizeY: 10, // minumum row height of an item
        //maxSizeY: 40 // maximum row height of an item
        resizable: {
            enabled: false,
            handles: ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw']
            //start: function(event, $element, widget) {}, // optional callback fired when resize is started,
            //resize: function(event, $element, widget) {}, // optional callback fired when item is resized,
            //stop: function(event, $element, widget) {} // optional callback fired when item is finished resizing
        },
        draggable: {
            enabled: false // whether dragging items is supported
            //handle: '.my-class' // optional selector for drag handle
            //start: function(event, $element, widget) {}, // optional callback fired when drag is started,
            //drag: function(event, $element, widget) {}, // optional callback fired when item is moved,
            //stop: function(event, $element, widget) {} // optional callback fired when item is finished dragging
        }
    };

    prefService.getDashboards(0);

    scope.$on(EVENT_DASHBOARDS_RECEIVED,function(event,success,data){
        rootScope.dashboards=data;
        scope.isLoaded = true;
    });

    scope.$on("delete-widget", function (event, dashboardIndex, widgetIndex) {
        var forRollback = rootScope.dashboards[dashboardIndex].widgets[widgetIndex];
        rootScope.dashboards[dashboardIndex].widgets.splice(widgetIndex,1);
        showToast("Widget",function (response) {
            if ( response == 'ok' ) {
                rootScope.dashboards[dashboardIndex].widgets.push(forRollback);
            }
        });
    });



    var originatorEv;
    scope.openMenu = function($mdOpenMenu, ev) {
        originatorEv = ev;
        $mdOpenMenu(ev);
    };

    scope.addDashboard = function(){
        rootScope.dashboards.push({
            title: 'My Dashboard',
            widgets:[],
            baseUrl: ''
        });
    };

    scope.deleteCurrentDashboard = function(index){
        var forRollback = rootScope.dashboards[index];
        console.log(forRollback);
        rootScope.dashboards.splice(index,1);
        showToast("Dashboard",function (response) {
            if ( response == 'ok' ) {
                console.log(forRollback);
                rootScope.dashboards.push(forRollback);
            }
        });
    };

    scope.save = function(){
        console.log(scope.dashboards);
        prefService.saveDashboards(scope.dashboards);
    };

    scope.addWidget = function(ci, id, cat){
        var widget = {
            sizeX: 15,
            sizeY: 10,
            row: 0,
            col: 0,
            displayItem: {
                ci: ci.label,
                id: id.label,
                category: cat.label,
                title: ci.label+" "+id.label+" "+cat.label,
                realtime: true,
                displayAsChart:true
            }
        };

        //TODO -Live anpassen, je nachdem welches CI es ist
        rootScope.dashboards[scope.selectedDashboard].widgets.push(widget);
    };

    scope.toggleEditMode = function(){

        if(!scope.isEditMode){
            scope.gridsterOpts.pushing = true;
            scope.gridsterOpts.floating = true;
            scope.gridsterOpts.swapping = true;
            scope.gridsterOpts.resizable.enabled = true;
            scope.gridsterOpts.draggable.enabled = true;
            rootScope.$broadcast('toggleEditMode',true);
        }else{
            scope.gridsterOpts.pushing = false;
            scope.gridsterOpts.floating = false;
            scope.gridsterOpts.swapping = false;
            scope.gridsterOpts.resizable.enabled = false;
            scope.gridsterOpts.draggable.enabled = false;
            rootScope.$broadcast('toggleEditMode',false);
        }
        rootScope.isEditMode = !rootScope.isEditMode;
        $mdSidenav('left').toggle();
    };


    scope.toggleLeft = function () {
        $mdSidenav('left').toggle();
    };

    function showToast(what, callback) {
        var toast = $mdToast.simple()
            .textContent(what+' gelöscht ')
            .action('UNDO')
            .highlightAction(true)
            .highlightClass('md-accent')// Accent is used by default, this just demonstrates the usage.
            .position("top right")
            .hideDelay(5000);

        $mdToast.show(toast).then(function(response) {
            callback(response)
        });
    }
});
