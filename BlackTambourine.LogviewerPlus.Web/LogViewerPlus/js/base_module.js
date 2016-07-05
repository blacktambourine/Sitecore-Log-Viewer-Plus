var baseModule = angular.module('corpApp.baseModule', ['ngRoute', 'ngSanitize']);

baseModule.controller('BaseCtrl', ['$scope', '$q', '$timeout', '$sce', function ($scope, $q, $timeout, $sce) {
    //#region Initialise variables

    $scope.pageErrors = {};
    $scope.data = {};
    $scope.pager = {};

    //#endregion

    //#region Web API functions

    //Handle errors from Web API
    $scope.HandleResponseErrors = function (response) {
        if (response.HasResponseErrors) {
            return $scope.onSubmitFail();
        }
    }

    //Call a web api service asynchronously
    $scope.callWebApiService = function (service, serviceParameters) {
        var deferred = $q.defer();
        var successCb = function (result) {
            deferred.resolve(result);
        };
        var errorCb = function () {
            deferred.reject();
        };

        service.get(serviceParameters, successCb, errorCb);
        return deferred.promise;
    };

    //#endregion

    //#region generic failure handling
    $scope.onSubmitFail = function () {
        $scope.pageErrors = { "submitFail": true };
        return false;
    }

    //Are there server errors on this page
    $scope.hasPageErrors = false;
    $scope.$watch('pageErrors', function () {
        $scope.hasPageErrors = !jQuery.isEmptyObject($scope.pageErrors);
    }, true);

    //#endregion

    //#region global View functions

    //set html content from web service as trusted
    $scope.renderHtml = function (html) {
        return $sce.trustAsHtml(html);
    };

    //strip html tags and set as trusted
    $scope.stripHtmlTags = function (html) {
        return $scope.renderHtml(String(html).replace(/<[^>]+>/gm, ''));
    };

    //limit the length of a text element
    $scope.limitTextLength = function (text, limit, terminator) {
        limit = limit | 0;
        if (limit <= 0 || text.length <= limit) {
            return text;
        }
        // restrict to limit to begin with.
        var limited = text.substring(0, limit);
        // find the last space
        var lastSpace = limited.lastIndexOf(' ');

        if (lastSpace === -1) {
            return limited + terminator;
        }
        else {
            return limited.substring(0, lastSpace) + terminator;
        }
    };

    //#endregion

    //#region Pager Control functions
    //pagination settings and defaults
    $scope.initPager = function () {
        $scope.pager.totalItems = 1000; //this needs a dummy default value before the first service call
        $scope.pager.currentPage = 1;
        $scope.pager.pageSize = 10;
        $scope.pager.itemCounter = 1;
        $scope.pager.numPages = 5;

        var deviceWidth = $(document).width();
        if (deviceWidth < 768) {
            $scope.pager.maxSize = 3;
        }
        else {
            $scope.pager.maxSize = 10;
        }
    }

    //reset pager on new search
    $scope.resetPager = function () {
        $scope.pager.currentPage = 1;
    }

    //on change
    $scope.pagerPageChanged = function () {
        $scope.pager.itemCounter = ($scope.pager.currentPage * $scope.pager.pageSize) - $scope.pager.pageSize + 1; //search result item number counter
        $scope.populatePageData();
    };
    //#endregion 

}]);