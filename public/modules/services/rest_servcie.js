/**
 * Created by Snare on 29.08.16.
 */

app.factory('RestService',function($http,$rootScope,$timeout){

//------------------------------------------------Variablen--------------------------------------------------------------------------------------------------------------------------------------//
    var service = {
        dashboards: [],
        timerMap: {},
        charts: [],
        securedApiPath : "/api/v2/secured", //TODO in dashboard integrieren
        publicApiPath: "/api/v2/public"
    };

//------------------------------------------------ Dashboards --------------------------------------------------------------------------------------------------------------------------------------//

    /**
     * läd alle Dashobards eines Users
     * @returns {*}
     * @param userId
     */
    service.getDashboards = function(userId){

        return $http.get('/dashboards').then(function successCallback(response) {
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
        return $http.post('/save',dashboards).then(function successCallback(response) {
            console.log(response);
            $rootScope.$broadcast("dashboards-saved", true);
        }, function errorCallback(response) {
            $rootScope.$broadcast("dashboards-saved", false);
        });
    };

    //127.0.0.1:31337/api/data/v1/components/cpu/0/cpu-cores/0/usage?realtime=true
    service.enableCPUUsageLive = function(baseUrl,samplingRate){
        if(!service.timerMap['cpuUsageLiveInterval'] || !service.timerMap['cpuUsageLiveInterval'].baseUrl == baseUrl){
            var cpuLiveInterval = setInterval(function () {
                $http.get(baseUrl+'/api/data/v1/components/cpu/0/cpu-cores/0/usage?realtime=true').then(function successCallback(response) {
                    var now = new Date().getTime();
                    var data = {x:now,y:response.data.usage};
                    $rootScope.$broadcast(EVENT_CPU_LIVE_DATA_RECEIVED, true, baseUrl, data);
                }, function errorCallback(response) {
                    $rootScope.$broadcast(EVENT_CPU_LIVE_DATA_RECEIVED, false, baseUrl, response);
                });
            }, samplingRate);
            service.timerMap['cpuUsageLiveInterval']={interval:cpuLiveInterval,baseUrl:baseUrl,usedBy:1};
        }else{
            //nur Anzahl der used By erhöhen
            service.timerMap['cpuUsageLiveInterval'].usedBy = service.timerMap['cpuUsageLiveInterval'].usedBy+1;
        }
    };

    service.disableCPUUsageLive = function(baseUrl){
        if(service.timerMap['cpuUsageLiveInterval'] && service.timerMap['cpuUsageLiveInterval'].baseUrl == baseUrl){
            //Anzahl der UsedBy verringern
            service.timerMap['cpuUsageLiveInterval'].usedBy = service.timerMap['cpuUsageLiveInterval'].usedBy-1;
            //Wenn usedBy == 0 dann Timer Stoppen
            if(service.timerMap['cpuUsageLiveInterval'].usedBy == 0){
                var intervall = service.timerMap['cpuUsageLiveInterval'].interval;

                clearInterval(intervall);
                // aus Timermap entfernen
                delete service.timerMap['cpuUsageLiveInterval'];
            }
        }else{
            //nix, kein Timer zum Stoppen vorhanden
        }
    };

    service.updateSamplingRateOfCPUUsageLive = function(baseUrl,newSamplingRate){
        //TODO anpassen und abstrahieren
        if(service.timerMap['cpuUsageLiveInterval'] && service.timerMap['cpuUsageLiveInterval'].baseUrl == baseUrl){
            //Anzahl der UsedBy ermitteln
            var countCurrentIntervals = service.timerMap['cpuUsageLiveInterval'].usedBy;

            //Tintervall stoppem
            var intervall = service.timerMap['cpuUsageLiveInterval'].interval;
            clearInterval(intervall);
            delete service.timerMap['cpuUsageLiveInterval'];


            //neuen Intervall erzeugen
            var cpuLiveInterval = setInterval(function () {
                $http.get(baseUrl+'/api/data/v1/components/cpu/0/cpu-cores/0/usage?realtime=true').then(function successCallback(response) {
                    var now = new Date().getTime();
                    var data = {x:now,y:response.data.usage};
                    $rootScope.$broadcast(EVENT_CPU_LIVE_DATA_RECEIVED, true, baseUrl, data);
                }, function errorCallback(response) {
                    $rootScope.$broadcast(EVENT_CPU_LIVE_DATA_RECEIVED, false, baseUrl, response);
                });
            }, newSamplingRate);

            service.timerMap['cpuUsageLiveInterval']={interval:cpuLiveInterval,baseUrl:baseUrl,usedBy:countCurrentIntervals};

        }else{
            //nix, kein Intervall zum ändern vorhanden
        }
    };



    service.getCPUUsageHistory = function(baseUrl){
        $http.get(baseUrl+'/api/data/v1/components/cpu/0/cpu-cores/0/usage?history=true').then(function successCallback(response) {
            $rootScope.$broadcast(EVENT_CPU_HISTORY_DATA_RECEIVED, true, baseUrl, response.data);
        }, function errorCallback(response) {
            $rootScope.$broadcast(EVENT_CPU_HISTORY_DATA_RECEIVED, false, baseUrl, response.data);
        });
    };

    return service;
});


//$timeout(function() {
//    otherService.updateTestService('Mellow Yellow')
//    console.log('update with timeout fired')
//}, 3000);