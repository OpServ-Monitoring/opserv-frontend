
app.factory('prefService',function($http, $rootScope, $timeout){

//------------------------------------------------Variablen--------------------------------------------------------------------------------------------------------------------------------------//
    var service = {
        dashboards: []
    };

//------------------------------------------------ Dashboards --------------------------------------------------------------------------------------------------------------------------------------//

    /**
     * läd alle Dashobards eines Users
     * @returns {*}
     * @param userId
     */
    service.getDashboards = function(userId){
        return $http.get('/api/preferences/v1/dashboards').then(function successCallback(response) {
            service.dashboards = response.data;
            $rootScope.$broadcast(EVENT_DASHBOARDS_RECEIVED, true, response.data);
        }, function errorCallback(response) {
            $rootScope.$broadcast(EVENT_DASHBOARDS_RECEIVED, false, response.data);
        });
    };

    /**
     * speichert alles dashboards
     * @param dashboards
     * @returns {*}
     */
    service.saveDashboards = function(dashboards){
        return $http.post('/api/preferences/v1/dashboards',dashboards).then(function successCallback(response) {
            $rootScope.$broadcast("dashboards-saved", true);
        }, function errorCallback(response) {
            $rootScope.$broadcast("dashboards-saved", false);
        });
    };

    return service;
});


//$timeout(function() {
//    otherService.updateTestService('Mellow Yellow')
//    console.log('update with timeout fired')
//}, 3000);