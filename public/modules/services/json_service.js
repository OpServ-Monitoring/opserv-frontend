/**
 * Created by Snare on 29.08.16.
 */

app.factory('JSONService',function($http,$rootScope){

//------------------------------------------------Variablen--------------------------------------------------------------------------------------------------------------------------------------//
    var service = {
    };

//------------------------------------------------ Dashboards --------------------------------------------------------------------------------------------------------------------------------------//

    service.stringify = function(obj){
        var jsonified = {};
        // loop through object and write string and type to newly stored data structure
        var i;
        for(i in obj)
            jsonified[i] = {
                // some voodoo to determine the variable type
                type: Object.prototype.toString.call(obj[i]).split(/\W/)[2],
                value: obj[i].toString()
            }
        return JSON.stringify(jsonified)
    };

    service.parse = function(json){
        var objectified = {};
        var obj = JSON.parse(json);
        // loop through object, and handle parsing of string according to type
        var i;
        for(i in obj)
            if(obj[i].type == "RegExp"){
                var m = obj[i].value.match(/\/(.*)\/([a-z]+)?/)
                objectified[i] = new RegExp(m[1],m[2]);
            } else if(obj[i].type == "String"){
                objectified[i] = obj[i].value
            } else if(obj[i].type == "Function"){
                // WARNING: this is more or less like using eval
                // All the usual caveats apply - including jailtime
                objectified[i] = new Function("return ("+obj[i].value+")")();
            }
        // ADD MORE TYPE HANDLERS HERE ...

        return objectified

    };

    return service;
});