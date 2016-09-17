/**
 * Created by Snare on 07.09.16.
 */
app.directive('ktDashboardsToolbar', function(){
    return {
        priority: 1,

        templateUrl: 'views/templates/kt_dashboards_toolbar.html',

        restrict: 'E',
        controller: ['$scope', function MyTabsController($scope) {
            var scope = $scope;
            scope.scrollCPU = function(){
                scope.selectedSideNavIndex = 1;//CPU Auswahl
            };

            scope.scrollBegin = function(){
                scope.selectedSideNavIndex = 0;
            }
        }]
    };
});