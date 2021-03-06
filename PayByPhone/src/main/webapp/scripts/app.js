var app = angular.module('app');

app.controller('RootCtrl', function ($scope) {
    //Nothing to do here
});

app.controller('AddMoneyCtrl', function ($scope, $modal, $location) {
    $scope.addMoneyButton = function () {
        $location.path('/confirmation');
    };
});

app.controller('BalanceCtrl', function ($scope, $modal, $location) {
    $scope.addBalance = function () {
        $location.path('/addMoney');
    };
});

app.controller('RegisterCtrl', function ($scope, $modal, $location) {
    $scope.register = function () {
        $location.path('/balance');
    };
});

app.controller('LoginCtrl', function ($scope, $modal, $location, Auth) {
    $scope.credentials = {
        submitted: false,
        submitBtnActive: true
    };



    $scope.submitLoginForm = function () {
        $scope.credentials.submitBtnActive = false;
        $scope.successAuth = true;
        $location.path('/balance');

    };

    $scope.signup = function(){

        $location.path('/register');

    };



    $scope.forgot = function(){

        $scope.data = "Contact administator for more information.";

        var modalInstance = $modal.open({
            templateUrl: '/partials/forgot.html',
            authenticate: true,
            controller: 'ModalFormInstanceCtrl',
            resolve: {
                title: function () {
                    return "Can't access your account?";
                },
                data: function () {
                    return $scope.data;
                }
            }
        });

        modalInstance.result.then(function (data) {
            //ok
        }, function () {
            //cancel
        });

    };

});
