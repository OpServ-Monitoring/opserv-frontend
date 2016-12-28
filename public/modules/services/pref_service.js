
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
            var standardItemsOne = [
                { id: 0, sizeX: 15, sizeY: 10, row: 0, col: 0, displayItem: {ci: 'cpus', id: 0, category: 'usage', title:"CPUS 0 USAGE ", displayAsChart:true, realtime:true}},
                { id: 1, sizeX: 15, sizeY: 10, row: 0, col: 15, displayItem: {ci: 'cpu-cores', id: 0, category: 'usage', title:"CPU-CORES 0 USAGE", displayAsChart:true, realtime:true}},
                { id: 2, sizeX: 15, sizeY: 10, row: 10, col: 10, displayItem: {ci: 'cpu-cores', id: 1, category: 'usage', title:"CPU-CORES 1 USAGE", displayAsChart:true, realtime:true}}
                //{ id: 2, sizeX: 2, sizeY: 1, row: 0, col: 4, displayItem: {type: 'text', config:{}} },
                //{ id: 3, sizeX: 2, sizeY: 1, row: 1, col: 0, displayItem: {type: 'text', config:{}} },
                //{ id: 4, sizeX: 2, sizeY: 2, row: 1, col: 4, displayItem: {type: 'text', config:{}} },
                //{ id: 1, sizeX: 3, sizeY: 3, row: 27, col: 0, displayItem: {type: 'text', config:{}} }
            ];

            var dashboards=[
                { title: 'Default Monitor',widgets:standardItemsOne, baseUrl: ''} // https://397b6935.ngrok.io
            ];

            // service.dashboards = response.data;
            // console.log(response.data.data.value);
            // console.log(JSON.parse(response.data.data.value));
            $rootScope.$broadcast(EVENT_DASHBOARDS_RECEIVED, true, dashboards); //TODO anpassen
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
        return $http.put('/api/preferences/v1/dashboards',dashboards).then(function successCallback(response) {
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