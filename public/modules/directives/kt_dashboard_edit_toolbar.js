/**
 * Created by Snare on 07.09.16.
 */
app.directive('ktDashboardEditToolbar', function(){
    return {
        priority: 1,

        templateUrl: 'views/templates/kt_dashboard_edit_toolbar.html',

        restrict: 'E'
    };
});