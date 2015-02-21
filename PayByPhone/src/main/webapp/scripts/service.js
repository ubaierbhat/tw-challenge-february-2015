var app = angular.module('app');

app.service('Auth', function ($location ,CrowdLoginResource, CrowdLogoutResource, $cookieStore, JiraLoginResource) {

    this.authorize = function (credentials, successCallback, failureCallback) {
        var filteredCredentials = {
            username: credentials.username,
            password: credentials.password
        };

        CrowdLoginResource.save(filteredCredentials, function (response) {
            console.log('Authorize response');
            console.log(response);

            if (response.displayName) {
                $cookieStore.put('crowdUser', response);

                console.log("Connecting to jira");
                JiraLoginResource.save(filteredCredentials, function (response) {
                    console.log("Jira response");
                    if (response[0] == 1) {
                        successCallback();
                    } else {
                        failureCallback();
                    }
                });

            } else {
                failureCallback();
            }
        });
    };

    this.unauthenticate = function (successCallback, failureCallback) {
        if (!this.isAuthenticated()) {
            successCallback();
            return;
        }

        CrowdLogoutResource.save(function(response) {
            console.log(response);

            if (response[0] == 1) {
                $cookieStore.remove('crowdUser');
                successCallback();
                //should disconnect with jira
            } else {
                failureCallback();
            }
        });
    };

    this.isAuthenticated = function () {
        return !!this.getUser();
    };

    this.getUser = function () {
        return $cookieStore.get('crowdUser');
    };
});

app.service('PatService', function (PatResource) {
    this.submit = function (data, successCallback, failureCallback) {
        PatResource.save(data, function (response) {
            if (response.key) {
                successCallback();
            } else {
                failureCallback();
            }
        });
    }
});

app.service('UsersService', function (PeopleSearchResource) {
       this.search = function (searchTerm, successCallback) {
           return PeopleSearchResource.getAll({searchTerm: searchTerm}, successCallback);
       }
   });

app.service('OfficeService', function (OfficeSearchResource) {
       this.search = function (searchTerm, successCallback) {
           return OfficeSearchResource.getAll({searchTerm: searchTerm}, successCallback);
       }
       this.getAll = function (successCallback) {
           return OfficeSearchResource.getAll(successCallback);
       }
});

app.service('GifService', function (GifSearchResource) {
    this.getAll = function (successCallback) {
        return GifSearchResource.getAll(successCallback);
    }
});

app.service('UserStatisticsService', function (UserStatisticsResource) {
    this.findAllReceived = function(user, successCallback){
        return UserStatisticsResource.getAll({type: "received", username: user}, successCallback);
    }

    this.findAllGiven = function(user, successCallback){
        UserStatisticsResource.getAll({type: "given", username: user}, successCallback);
    }

    this.chartForGiven = function(user, successCallback){
        UserStatisticsResource.get({type: "graphGiven", username: user}, successCallback);
    }

    this.chartForReceived = function(user, successCallback){
        UserStatisticsResource.get({type: "graphReceived", username: user}, successCallback);
    }
});

app.service('GlobalStatisticsService', function (GlobalStatisticsResource) {
    this.statisticsByUser = function(form, successCallback){
        return GlobalStatisticsResource.get({type: "byUser", startDate: form.startDate, endDate: form.endDate, object: form.object}, successCallback);
    }

    this.statisticsByOffice = function(form, successCallback){
        return GlobalStatisticsResource.get({type: "byOffice", startDate: form.startDate, endDate: form.endDate, object: form.object}, successCallback);
    }

    this.most = function(form, successCallback){
        return GlobalStatisticsResource.get({type: form.object, startDate: form.startDate, endDate: form.endDate}, successCallback);
    }

});

app.service('ChartService', function () {

    var chartData;
    var type;
    var name;

    this.set = function(data){
        chartData = data;
    }

    this.setType = function(data){
        type = data;
    }

    this.get = function(){
        return chartData;
    }

    this.getType = function(){
        return type;
    }

    this.setName = function(data){
        name = data;
    }

    this.getName = function(){
        return name;
    }

});