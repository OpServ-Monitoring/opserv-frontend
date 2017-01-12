app.factory('dialogService',function($mdDialog){

    var service = {};

    service.showWidgetSettings = function (currentSettings, callback) {
        $mdDialog.show({
            controller: widgetSettingsController,
            templateUrl: 'views/templates/dialog/widget_settings_dialog.html',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            fullscreen: true // Only for -xs, -sm breakpoints.
        }).then(function(answer) {
            callback(answer)
        }, function() {});

        function widgetSettingsController($scope, $mdDialog){
            $scope.currentMode = currentSettings.currentMode;
            $scope.title = currentSettings.title;
            $scope.modes = currentSettings.modes;
            $scope.samplingRateLive = currentSettings.samplingRateLive;

            $scope.cancel = function() {
                $mdDialog.cancel();
            };

            $scope.submit = function() {
                var answer = {};
                answer['newTitle'] = $scope.title;
                answer['newMode'] = $scope.currentMode;
                answer['newSamplingRateLive'] = $scope.samplingRateLive;
                $mdDialog.hide(answer);
            };
        }
    };

    service.showDashboardSettings = function (currentSettings, callback) {
        $mdDialog.show({
            controller: dashboardSettingsController,
            templateUrl: 'views/templates/dialog/dashboard_settings_dialog.html',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            fullscreen: true // Only for -xs, -sm breakpoints.
        }).then(function(answer) {
            callback(answer)
        }, function() {});

        function dashboardSettingsController($scope, $mdDialog){
            $scope.title = currentSettings.title;
            $scope.baseUrl = currentSettings.baseUrl;

            $scope.cancel = function() {
                $mdDialog.cancel();
            };

            $scope.submit = function() {
                var answer = {};
                answer['newTitle'] = $scope.title;
                answer['newBaseUrl'] = $scope.baseUrl;
                $mdDialog.hide(answer);
            };
        }
    };

    return service;
});

