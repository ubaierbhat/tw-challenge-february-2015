var app = angular.module('app');

app.directive('typeahead', ["$timeout", function ($timeout) {
    return {
        restrict: 'E',
        transclude: true,
        replace: true,
        template: '<div><input id="search" class="form-control typeahead" name="to" ng-model="term" ng-change="query()" type="text" autocomplete="off" /><div ng-transclude></div></div>',
        scope: {
            search: "&",
            select: "&",
            items: "=",
            term: "="
        },
        controller: ["$scope", function ($scope) {
            $scope.items = [];
            $scope.hide = false;

            this.activate = function (item) {
                $scope.active = item;
            };

            this.activateNextItem = function () {
                var index = $scope.items.indexOf($scope.active);
                this.activate($scope.items[(index + 1) % $scope.items.length]);
            };

            this.activatePreviousItem = function () {
                var index = $scope.items.indexOf($scope.active);
                this.activate($scope.items[index === 0 ? $scope.items.length - 1 : index - 1]);
            };

            this.isActive = function (item) {
                return $scope.active === item;
            };

            this.selectActive = function () {
                this.select($scope.active);
            };

            this.select = function (item) {
                $scope.items = [];
                $scope.select({item: item});
            };

            $scope.query = function () {
                $scope.search({term: $scope.term});
            };
        }],

        link: function (scope, element, attrs, controller) {
            var $input = element.find('input');

            $input.bind('keyup', function (e) {
                if (e.keyCode === 9 || e.keyCode === 13) {
                    scope.$apply(function () {
                        controller.selectActive();
                    });
                }

                if (e.keyCode === 27) {
                    scope.$apply(function () {
                        scope.items = [];
                    });
                }
            });

            $input.bind('keydown', function (e) {
                if (e.keyCode === 13 || e.keyCode === 27) {
                    e.preventDefault();
                }

                if (e.keyCode === 9) {
                    scope.$apply(function () {
                        scope.items = [];
                    });
                }

                if (e.keyCode === 40) {
                    e.preventDefault();
                    scope.$apply(function () {
                        controller.activateNextItem();
                    });
                }

                if (e.keyCode === 38) {
                    e.preventDefault();
                    scope.$apply(function () {
                        controller.activatePreviousItem();
                    });
                }
            });
        }
    };
}]);

app.directive('typeaheadItem', function () {
    return {
        require: '^typeahead',
        link: function (scope, element, attrs, controller) {

            var item = scope.$eval(attrs.typeaheadItem);

            scope.$watch(function () {
                return controller.isActive(item);
            },
            function (active) {
                if (active) {
                    element.addClass('active');
                } else {
                    element.removeClass('active');
                }
            });

            element.bind('mouseenter', function (e) {
                scope.$apply(function () {
                    controller.activate(item);
                });
            });

            element.bind('mouseleave', function (e) {
                console.log("Mouseleave");
            });

            element.bind('click', function (e) {
                scope.$apply(function () {
                    controller.select(item);
                });
            });
        }
    };
});

app.directive("chartCanvas", function($compile){
	return function(scope, element, attrs){
	    angular.element(document.getElementById('container')).append($compile("<canvas id=chart></canvas>")(scope));
	    var context = document.getElementById('chart').getContext('2d');
	    if(scope.chartType=="bar"){
	        var chart = new Chart(context).Bar(new BarChartData(scope.chartData.dataSecondary,scope.chartData.data));
	    }else if(scope.chartType=="line"){
            var chart = new Chart(context).Line(new LineChartData(scope.chartData.labels,scope.chartData.data,scope.chartData.dataSecondary));
	    }else{
	        scope.noData = true;
	    }
	};
});

app.directive("globalStatistics", function(){
	return function(scope, element, attrs){
	    //manage select or search
	    scope.$watch("form.object", function(val){
	        if(val==null||val==""){
	            angular.element(document.getElementById("search"))[0].disabled = false;
	            angular.element(document.getElementById("select"))[0].disabled = false;
	            scope.formInvalid.object = false;
	        }else if(scope.form.object.type){
	            angular.element(document.getElementById("search"))[0].disabled = true;
	            scope.formInvalid.objectError = false;
	            scope.formInvalid.object = true;
	        }else if(scope.form.object.name){
	            angular.element(document.getElementById("select"))[0].disabled = true;
	            scope.formInvalid.objectError = false;
	            scope.formInvalid.object = true;
	        }
	    });

	    //Date validation onclick
		angular.element(document.getElementById("button")).bind("click", function(){
		    scope.submitted=true;
			if(scope.form.startDate>scope.form.endDate||scope.form.startDate==""||scope.form.endDate==""){
			    scope.submitted=false;
			    scope.formInvalid.datesError = true;
			    scope.formInvalid.dates = false;
			}else{
				scope.formInvalid.dates = true;
				scope.formInvalid.datesError = false;
			}
			if(!scope.formInvalid.object){
			    scope.submitted=false;
			    scope.formInvalid.objectError = true;
			    scope.formInvalid.object = false;
			}
		});
	};
});

app.directive("navbar", function(Auth){
	return function(scope, element, attrs){
	    scope.$watch(function () {
            return Auth.isAuthenticated();
        },
        function (newValue) {
            element[0].hidden = !newValue;
        });

	    angular.element(element[0].lastElementChild).bind("click", function(){
	         element[0].hidden = true;
	         Auth.unauthenticate(function() {
                console.log("Logged out");
             },
             function() {
                console.log('Logout failed!');
             });
	    });
	};
});