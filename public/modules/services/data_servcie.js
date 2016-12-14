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
            service.updateSamplingRateOfCiLiveTimer(baseUrl, ci, id, category, samplingRate)
        }
    };

    service.disableCiLiveTimer = function(baseUrl, ci, id, category){
        var intervalName = ci+id+category;
        disableInterval(intervalName, baseUrl);
    };

    service.updateSamplingRateOfCiLiveTimer = function(baseUrl, ci, id, category, newSamplingRate){
        var intervalName = ci+id+category;
        if(isAlreadyIntervalForBaseUrl(intervalName, baseUrl)){
            var countCurrentIntervals = service.intervalMap[intervalName].usedBy;
            stopInterval(intervalName);
            createCiLiveInterval(baseUrl, ci, id, category, newSamplingRate, intervalName);
            setIntervalUsedByAttribute(intervalName,countCurrentIntervals);
        }
    };

    function parseHistoryValues(values) {
        var minArray=[];
        var maxArray=[];
        var avgArray=[];

        angular.forEach(values,function (object) {
            minArray.push([object.timestamp, object.min]);
            maxArray.push([object.timestamp, object.max]);
            avgArray.push([object.timestamp, object.avg])
        });

        return [{name:"min-values",data:minArray},{name:"avg-values",color:"#d966ff",data:avgArray},{name:"max-values",color:"#ff471a",data:maxArray}]
    }

    service.getCiHistoryData = function(baseUrl, ci, id, category){
        $http.get(baseUrl+'/api/data/v1/'+ci+'/'+id+'/'+category).then(function successCallback(response) {
            var parsed_values = parseHistoryValues(response.data.data.values);
            $rootScope.$broadcast(EVENT_CI_HISTORY_DATA_RECEIVED, true, baseUrl, ci, id, category, parsed_values);
        }, function errorCallback(response) {
            $rootScope.$broadcast(EVENT_CI_HISTORY_DATA_RECEIVED, false, baseUrl, ci, id, category, response.data.data.values);
        });
    };

    function createCiLiveInterval(baseUrl, ci, id, category, samplingRate, intervalName){
        console.log(samplingRate);
        $http.put(baseUrl + '/api/data/v1/'+ci+'/'+id+'/'+category,{gathering_rate:samplingRate}).then(function onSuccess(response) {
            var liveInterval = setInterval(function () {
                $http.get(baseUrl + '/api/data/v1/'+ci+'/'+id+'/'+category+'?realtime=true').then(function successCallback(response) {
                    $rootScope.$broadcast(EVENT_CI_LIVE_DATA_RECEIVED, true, baseUrl, ci, id, category, response.data.data);
                }, function errorCallback(response) {
                    $rootScope.$broadcast(EVENT_CI_LIVE_DATA_RECEIVED, false, baseUrl, ci, id, category, response.data.data);
                });
            }, samplingRate);
            service.intervalMap[intervalName] = {interval: liveInterval, baseUrl: baseUrl, usedBy: 1};
        }, function onError(response) {
            console.log("Error while setting gathering Rate of: ", ci,id,category,"rate: ",samplingRate);
            //todo anpassen
        });

    }

//------------------------------------------------ CI Info --------------------------------------------------------------------------------------------------------------------------------------//

    function getValuesFromChildrenLinks(childrenLinks) {
        var ids =[];
        if (childrenLinks){
            angular.forEach(childrenLinks,function (link) {
                var childrenAdress = link.href;
                var cutInArray = childrenAdress.split("/");
                var lastItem = cutInArray[cutInArray.length-1];
                ids.push(lastItem)
            });
            console.log(ids);
            return ids;
        }else{
            return [];
        }
    }

    service.getCiIds = function(ciName,baseUrl){
        return $http.get(baseUrl+'/api/data/v1/'+ciName).then(function successCallback(response) {
            $timeout(function() {
                var ids = getValuesFromChildrenLinks(response.data.links.children);
                $rootScope.$broadcast("ci_ids_received", true, ciName, ids);
            }, 3000);
           // $rootScope.$broadcast("ci_info_received", true , response);
        }, function errorCallback(response) {
            $rootScope.$broadcast("ci_ids_received", false, response);
        });
    };

    service.getCiCats = function(ciName,ciId, baseUrl){
        return $http.get(baseUrl+'/api/data/v1/'+ciName+'/'+ciId).then(function successCallback(response) {
            $timeout(function() {
                var cats = getValuesFromChildrenLinks(response.data.links.children);
                $rootScope.$broadcast("ci_cats_received", true, ciName, cats);
            }, 3000);
            // $rootScope.$broadcast("ci_info_received", true , response);
        }, function errorCallback(response) {
            $rootScope.$broadcast("ci_cats_received", false, response);
        });
    };

    /**
     * alle Cpus über children objekte
     * String hinter letzer "/" ist die Bezeichnung der CPU
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

    function setIntervalUsedByAttribute(intervalName, countCurrentIntervals ) {
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