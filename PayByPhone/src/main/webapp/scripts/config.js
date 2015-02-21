var app = angular.module('app', ['ngRoute', 'ngResource', 'ngCookies','ui.bootstrap','ngQuickDate']);

app.config(function ($routeProvider) {
    $routeProvider
        .when(
        '/form', {
            templateUrl: 'partials/form.html',
            controller: 'FormCtrl',
            authenticate: true
        })
        .when(
        '/submitted', {
            templateUrl: 'partials/submitted.html',
            controller: 'SubmittedCtrl',
            authenticate: true
        })
        .when(
        '/balance', {
            templateUrl: 'partials/balance.html',
            controller: 'BalanceCtrl'
        })

        .when(
        '/shop', {
            templateUrl: 'partials/shop.html',
            controller: 'ShopCtrl'
        })

        .when(
        '/register', {
            templateUrl: 'partials/register.html',
            controller: 'RegisterCtrl'
        })
        .when(
        '/addMoney', {
            templateUrl: 'partials/addMoney.html',
            controller: 'AddMoneyCtrl'
        })
        .when(
        '/confirmation', {
            templateUrl: 'partials/confirmation.html',
            controller: 'ConfirmationCtrl'
        })

        .when(
        '/login', {
            templateUrl: 'partials/login.html',
            controller: 'LoginCtrl'
        })
        .otherwise({
            redirectTo: '/login'
        });
});

app.run(function ($rootScope, $location, Auth) {
    $rootScope.$on('$routeChangeStart', function (event, next) {

        if (next.authenticate && !Auth.isAuthenticated()) {
            console.log('Trying to access protected route: ' + next.$$route.originalPath);
            $location.path('login');
        }
    });
});

app.factory('CrowdLoginResource', function ($resource) {
    return $resource('rest/crowdLogin');
});

app.factory('CrowdLogoutResource', function ($resource) {
    return $resource('rest/secure/crowdLogout');
});

app.factory('JiraLoginResource', function ($resource) {
    return $resource('rest/secure/jiraLogin');
});

app.factory('PatResource', function ($resource) {
    return $resource('rest/secure/createIssue');
});

app.factory('UserStatisticsResource', function ($resource) {
    return $resource('rest/secure/userStatistics/:type/:username', null,
        {
            getArray: {
                method:'GET',
                isArray: true
            }
        }
    )
});


app.factory('PeopleSearchResource', function ($resource) {
    return $resource('rest/secure/people/search/:searchTerm', null,
        {
            getArray: {
                method:'GET',
                isArray: true
            }
        }
    )
});

app.factory('OfficeSearchResource', function ($resource) {
    return $resource('rest/secure/office/:searchTerm', null,
        {
            getArray: {
                method:'GET',
                isArray: true
            }
        }
    )
});

app.factory('GifSearchResource', function ($resource) {
    return $resource('rest/secure/gif', null,
        {
            getArray: {
                method:'GET',
                isArray: true
            }
        }
    )
});

app.factory('GlobalStatisticsResource', function ($resource) {
    return $resource('rest/secure/globalStatistics/:type/:startDate/:endDate/:object', null,
        {
            getArray: {
                method:'GET',
                isArray: true
            }
        }
    )
});