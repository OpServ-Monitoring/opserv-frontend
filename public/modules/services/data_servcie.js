/**
 * Created by Snare on 29.08.16.
 */

app.factory('dataService',function($http, $rootScope, $timeout){

    const CPU_LIVE_USAGE_TIMER = "cpu_live_usage_timer";

//------------------------------------------------ Variablen --------------------------------------------------------------------------------------------------------------------------------------//
    var service = {
        dashboards: [],
        intervalMap: {},
        securedApiPath : "/api/v2/secured",
        publicApiPath: "/api/v2/public"
    };

//------------------------------------------------ CPU Usage --------------------------------------------------------------------------------------------------------------------------------------//

    service.enableCILiveTimer = function(baseUrl, ci, id, category, samplingRate){
        var intervalName = ci+id+category;
        if(!isAlreadyIntervalForBaseUrl(intervalName, baseUrl)){
            createCiLiveInterval(baseUrl, ci, id, category, samplingRate, intervalName);
        }else{
            increaseIntervalUsedBy(intervalName);
        }
    };

    //service.enableCPUUsageLive = function(baseUrl,cpuId,samplingRate){
    //    var intervalName = CPU_LIVE_USAGE_TIMER+cpuId;
    //    if(!isAlreadyIntervalForBaseUrl(intervalName, baseUrl)){
    //        createCpuLiveUsageInterval(baseUrl, cpuId, samplingRate, intervalName);
    //    }else{
    //        increaseIntervalUsedBy(intervalName);
    //    }
    //};

    service.disableCiLiveTimer = function(baseUrl, ci, id, category){
        var intervalName = ci+id+category;
        disableInterval(intervalName, baseUrl);
    };

    //service.disableCPUUsageLive = function(baseUrl,cpuId){
    //    var intervalName = CPU_LIVE_USAGE_TIMER+cpuId;
    //    disableInterval(intervalName, baseUrl);
    //};

    service.updateSamplingRateOfCiLiveTimer = function(baseUrl, ci, id, category, newSamplingRate){
        var intervalName = ci+id+category;
        if(isAlreadyIntervalForBaseUrl(intervalName, baseUrl)){
            var countCurrentIntervals = service.intervalMap[intervalName].usedBy;
            stopInterval(intervalName);
            createCiLiveInterval(baseUrl, ci, id, category, newSamplingRate, intervalName);
            setIntervalUsedByAttribute(intervalName,countCurrentIntervals);
        }
    };

    //service.updateSamplingRateOfCPUUsageLive = function(baseUrl,cpuId,newSamplingRate){
    //    var intervalName = CPU_LIVE_USAGE_TIMER+cpuId;
    //    if(isAlreadyIntervalForBaseUrl(intervalName, baseUrl)){
    //        var countCurrentIntervals = service.intervalMap[intervalName].usedBy;
    //        stopInterval(intervalName);
    //        createCpuLiveUsageInterval(baseUrl, cpuId, newSamplingRate, intervalName);
    //        setIntervalUsedByAttribute(intervalName,countCurrentIntervals);
    //    }
    //};


    //service.getCPUUsageHistory = function(baseUrl,cpuId){
    //    $http.get(baseUrl+'/api/data/v1/cpus/'+cpuId+'/usage').then(function successCallback(response) {
    //        $rootScope.$broadcast(EVENT_CI_HISTORY_DATA_RECEIVED, true, baseUrl, cpuId, response.data.values);
    //    }, function errorCallback(response) {
    //        $rootScope.$broadcast(EVENT_CI_HISTORY_DATA_RECEIVED, false, baseUrl, cpuId, response.data.values);
    //    });
    //};

    service.getCiHistoryData = function(baseUrl, ci, id, category){
        $http.get(baseUrl+'/api/data/v1/'+ci+'/'+id+'/'+category).then(function successCallback(response) {
            $rootScope.$broadcast(EVENT_CI_HISTORY_DATA_RECEIVED, true, baseUrl, ci, id, category, response.data.values);
        }, function errorCallback(response) {
            $rootScope.$broadcast(EVENT_CI_HISTORY_DATA_RECEIVED, false, baseUrl, ci, id, category, response.data.values);
        });
    };

    //function createCpuLiveUsageInterval(baseUrl, cpuId, samplingRate, intervalName) {
    //    var cpuLiveInterval = setInterval(function () {
    //        $http.get(baseUrl + '/api/data/v1/cpus/' + cpuId + '/usage?realtime=true').then(function successCallback(response) {
    //            var now = new Date().getTime();
    //            var data = {x: now, y: response.data.usage};
    //            $rootScope.$broadcast(EVENT_CI_LIVE_DATA_RECEIVED, true, baseUrl, cpuId, data);
    //        }, function errorCallback(response) {
    //            $rootScope.$broadcast(EVENT_CI_LIVE_DATA_RECEIVED, false, baseUrl, cpuId, response);
    //        });
    //    }, samplingRate);
    //    service.intervalMap[intervalName] = {interval: cpuLiveInterval, baseUrl: baseUrl, usedBy: 1};
    //}


    function createCiLiveInterval(baseUrl, ci, id, category, samplingRate, intervalName){
        var liveInterval = setInterval(function () {
            $http.get(baseUrl + '/api/data/v1/'+ci+'/' + id + '/'+category+'?realtime=true').then(function successCallback(response) {
                var now = new Date().getTime();
                var data = {x: now, y: response.data.usage};
                $rootScope.$broadcast(EVENT_CI_LIVE_DATA_RECEIVED, true, baseUrl, ci, id, category, data);

            }, function errorCallback(response) {
                $rootScope.$broadcast(EVENT_CI_LIVE_DATA_RECEIVED, false, baseUrl, ci, id, category, response);
            });
        }, samplingRate);
        service.intervalMap[intervalName] = {interval: liveInterval, baseUrl: baseUrl, usedBy: 1};
    }

//------------------------------------------------ CPUs Info --------------------------------------------------------------------------------------------------------------------------------------//

    function parseCis(response, callback) {
        callback(null,response.data)
    }

    service.getCiIds = function(ciName,baseUrl){
        return $http.get(baseUrl+'/api/data/v1/'+ciName).then(function successCallback(response) {
            $timeout(function() {
                parseCis(response,function(err,res){
                    if(!err){
                        $rootScope.$broadcast("ci_ids_received", true, ciName, res);
                    }else{
                        console.log(err)
                    }
                });
            }, 3000);
           // $rootScope.$broadcast("ci_info_received", true , response);
        }, function errorCallback(response) {
            $rootScope.$broadcast("ci_ids_received", false, response);
        });
    };

    function parseCats(response, callback) {
        callback(null,response.data)
    }

    service.getCiCats = function(ciName,ciId, baseUrl){
        return $http.get(baseUrl+'/api/data/v1/'+ciName+'/'+ciId).then(function successCallback(response) {
            $timeout(function() {
                parseCats(response,function(err,res){
                    if(!err){
                        $rootScope.$broadcast("ci_cats_received", true, ciName, res);
                    }else{
                        console.log(err)
                    }
                });
            }, 3000);
            // $rootScope.$broadcast("ci_info_received", true , response);
        }, function errorCallback(response) {
            $rootScope.$broadcast("ci_cats_received", false, response);
        });
    };

    /**
     * alle Cpus über children objekte
     * String hinter letzer "/" ist die Bezeichnung der CPU
     */

    /**
     * {
        links:{
            self:{
                href:"aktuelle URl"
                name:"beschreibung"
            },
            parent:{
                href:"parent URl"
                name:"beschreibung"
            }
            children:[
                {
                    href:"URl",
                    name:"beschreibung"
                },
                ...
            ]
        },
            data:{
                unit:"",
                value: Wert
                timestamp: millies
                (oder :
                values:
                [
                    {
                     avg:shflkh,
                     min:ljksbfdkj,
                     max:kjshdfkjlh,
                     timestamp:jksdbflj
                    }
                ]
                )

            }
        }
      */



    function disableInterval(intervalName, baseUrl) {
        if (isAlreadyIntervalForBaseUrl(intervalName, baseUrl)) {
            decreaseIntervalUsedByCounter(intervalName);
            if (service.intervalMap[intervalName].usedBy == 0) {
                stopInterval(intervalName);
                deleteIntervalFromMap(intervalName);
            }
        }
    }

    function isAlreadyIntervalForBaseUrl(intervalName, baseUrl) {
        return service.intervalMap[intervalName] && service.intervalMap[intervalName].baseUrl == baseUrl;
    }

    function stopInterval(intervalName) {
        var interval = service.intervalMap[intervalName].interval;
        clearInterval(interval);
        delete service.intervalMap[intervalName];
    }

    function setIntervalUsedByAttribute(intervalName, countCurrentIntervals) {
        service.intervalMap[intervalName].usedBy = countCurrentIntervals;
    }

    function increaseIntervalUsedBy(intervalName) {
        service.intervalMap[intervalName].usedBy = service.intervalMap[intervalName].usedBy + 1;
    }

    function decreaseIntervalUsedByCounter(intervalName) {
        service.intervalMap[intervalName].usedBy = service.intervalMap[intervalName].usedBy - 1;
    }

    function deleteIntervalFromMap(intervalName) {
        delete service.intervalMap[intervalName];
    }

    return service;
});


//$timeout(function() {
//    otherService.updateTestService('Mellow Yellow')
//    console.log('update with timeout fired')
//}, 3000);