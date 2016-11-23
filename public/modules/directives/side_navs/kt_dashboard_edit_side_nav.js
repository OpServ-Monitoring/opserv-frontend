/**
 * Created by Snare on 07.09.16.
 */
app.directive('ktDashboardEditSideNav',[ 'dataService',   function(dataService){
    return {
        priority: 1,

        templateUrl: 'views/templates/side_navs/kt_dashboard_edit_side_nav.html',

        restrict: 'E',
        controller: ['$scope','$rootScope','$timeout', function MyTabsController($scope,$rootScope,$timeout) {

            const CPUS = "cpus";
            const CPU_CORES = "cpu-cores";
            const GPUS = "gpus";
            const MEMORY = "memory";
            const DISKS = "disks";
            const NETWORK = "network";
            const PARTITIONS = "partitions";
            const PROCESSES = "processes";
            const SYSTEM = "system";

            var scope = $scope;
            var rootScope = $rootScope;

            scope.lastTab = [];

            scope.cis =[
                {label:CPUS,action:selectCi},
                {label:CPU_CORES,action:selectCi},
                {label:GPUS,action:selectCi},
                {label:MEMORY,action:selectCi},
                {label:DISKS,action:selectCi},
                {label:NETWORK,action:selectCi},
                {label:PARTITIONS,action:selectCi},
                {label:PROCESSES,action:selectCi},
                {label:SYSTEM,action:selectCi}
            ];

            scope.ids = [];

            scope.categories = [];

            function loadIds(ci) {
                dataService.getCiIds(ci.label,rootScope.dashboards[scope.selectedDashboard].baseUrl);
            }

            function loadCats(id) {
                dataService.getCiCats(scope.selectedCi.label,id,rootScope.dashboards[scope.selectedDashboard].baseUrl);
            }

            scope.$on("ci_ids_received", function (event, status, ciName, ids) {
                if(status){
                    if(ciName==scope.selectedCi.label){
                        scope.ids = [];
                        angular.forEach(ids,function(object){
                            scope.ids.push({label:object.label,action:selectId})
                        });
                        scope.idsLoading = false;
                    }
                }else{
                    //TODO display error toast
                    console.log("error beim Laden der CI - IDs")
                }

            });

            scope.$on("ci_cats_received", function (event, status, ciName, cats) {
                if(status){
                    if(ciName==scope.selectedCi.label){
                        scope.categories = [];
                        angular.forEach(cats,function(object){
                            scope.categories.push({label:object.label,action:selectCategory})
                        });
                        scope.catsLoading = false;
                    }
                }else{
                    //TODO display error toast
                    console.log("error beim Laden der CI - Cats")
                }
            });

            function selectCi (ci) {
                scope.selectedCi = ci;
                scope.idsLoading= true;
                loadIds(ci);
                scope.selectedSideNavIndex = 1;
                scope.lastTab.push(0);
            }

            function selectId (id) {
                scope.selectedId = id;
                scope.catsLoading= true;
                loadCats(id.label);
                scope.selectedSideNavIndex = 2;//Kategorie Auswahl
                scope.lastTab.push(1);
            }

            function selectCategory(cat){
                scope.selectedCat = cat;
                scope.addWidget(scope.selectedCi,scope.selectedId,scope.selectedCat);
            }

            scope.scrollBack = function () {
                scope.selectedSideNavIndex = scope.lastTab.pop();
            };

            scope.$watch('selectedSideNavIndex',function(newValue,oldValue){
                if(scope.selectedSideNavIndex == 0){
                    scope.ids=[];
                    scope.categories=[];
                }
                if(scope.selectedSideNavIndex == 1){
                    scope.categories=[];
                }
            });
        }]
    };
}]);