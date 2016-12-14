/**
 * Created by Snare on 07.09.16.
 */
app.directive('ktDashboardEditSideNav',[ 'dataService',   function(dataService){
    return {
        priority: 1,

        templateUrl: 'views/templates/side_navs/kt_dashboard_edit_side_nav.html',

        restrict: 'E',
        controller: ['$scope','$rootScope','$timeout', function MyTabsController($scope,$rootScope,$timeout) {

            const CI_CPUS = "cpus";
            const CI_CPU_CORES = "cpu-cores";
            const CI_GPUS = "gpus";
            const CI_MEMORY = "memory";
            const CI_DISKS = "disks";
            const CI_NETWORK = "network";
            const CI_PARTITIONS = "partitions";
            const CI_PROCESSES = "processes";
            const CI_SYSTEM = "system";

            var scope = $scope;
            var rootScope = $rootScope;

            scope.lastTab = [];

            scope.cis =[
                {label:CI_CPUS,action:selectCi},
                {label:CI_CPU_CORES,action:selectCi},
                {label:CI_GPUS,action:selectCi},
                {label:CI_MEMORY,action:selectCi},
                {label:CI_DISKS,action:selectCi},
                {label:CI_NETWORK,action:selectCi},
                {label:CI_PARTITIONS,action:selectCi},
                {label:CI_PROCESSES,action:selectCi},
                {label:CI_SYSTEM,action:selectCi}
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
                        angular.forEach(ids,function(id){
                            scope.ids.push({label:id,action:selectId})
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
                        angular.forEach(cats,function(catName){
                            scope.categories.push({label:catName,action:selectCategory})
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
                scope.catsLoading= true;
                loadCats(0);
                scope.selectedSideNavIndex = 1;
                scope.lastTab.push(0);
            }

            function selectId (id) {
                scope.selectedId = id;
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
            });
        }]
    };
}]);