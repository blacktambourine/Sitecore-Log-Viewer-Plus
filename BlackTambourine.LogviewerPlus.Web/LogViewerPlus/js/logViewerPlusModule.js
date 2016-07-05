var accordionModule = angular.module('corpApp.logViewerPlusModule', ['ngRoute']);

accordionModule.controller('LogViewerPlusCtrl', ['$scope', '$controller', 'LogViewerPlusService', function ($scope, $controller, LogViewerServicePlus)
{

    $scope.populatePageData = function () 
    {
        if (!$scope.filterForm.$valid)
        {
            $scope.pageErrors = { "formInvalid": true };
            return;
        }
        
        $scope.pageErrors = {};
        $scope.data = {};
        $scope.hasSubmitted = true;

        $scope.filters.fromDate = new Date($scope.filters.dt);
        $scope.filters.fromDate.setHours($scope.filters.fromTime.getHours(), $scope.filters.fromTime.getMinutes(), 0, 0);

        $scope.filters.toDate = new Date($scope.filters.dt);
        $scope.filters.toDate.setHours($scope.filters.toTime.getHours(), $scope.filters.toTime.getMinutes(), 0, 0);

        $scope.callWebApiService(LogViewerServicePlus,
        {
            LogFilePrefix: $scope.filters.logFileType,
            FromDate: $scope.filters.fromDate,
            ToDate: $scope.filters.toDate,
            CategoryFilters: $scope.checkCategoryResults,
            StatusFilters: $scope.checkStatusResults
        })
        .then(function (result)
        {
            $scope.HandleResponseErrors(result);
            $scope.data.Logs = result.Logs;
            return true; //canContinue, always return a value when using .then()
        },
        function () { $scope.onSubmitFail(); });
    }

    $scope.clearFilters = function ()
    {
        $scope.data = {};

        $scope.checkCategoryResults = [];
        $scope.checkCategoryModel = {
            Indexing: false,
            Cache: false,
            MediaRequestProtect: false,
            Dll: false,
            Dianoga: false,
            Scheduler: false,
            TdsPackageDeployer: false,
            Analytics: false,
            PathAnalyzer: false,
            Heartbeat: false,
            Audit: false,
            ManagedPoolThread: false,
            SitecoreInstanceInfo: false,
            Miscellaneous: false
        };

        $scope.checkStatusResults = [];
        $scope.checkStatusModel = {
            Info: false,
            Warn: false,
            Error: false
        };

        //Time pickers defaults
        $scope.filters = {};
        $scope.filters.dt = new Date();
        $scope.filters.fromTime = jsDates.getDefaultDatepickerFromDate();
        $scope.filters.toTime = jsDates.getDefaultDatepickerToDate();

        $scope.filters.logFileType = "log.";
    }

    //initialise page
    $scope.init = function ()
    {
        //inherit from base controller
        angular.extend(this, $controller('BaseCtrl', { $scope: $scope }));
        $scope.clearFilters();
        
        //timepicker settings
        $scope.hstep = 1;
        $scope.mstep = 15;
        $scope.ismeridian = false;
    }

    //#region Date Picker
    
    $scope.dateOptions = {
        dateDisabled: false,
        formatYear: 'yyyy',
        startingDay: 1
    };

    $scope.datepicker = {
        opened: false
    };

    $scope.openDatepicker = function () {
        $scope.datepicker.opened = true;
    };

    //#endregion
    
    //#region Category Filters
    $scope.checkCategoryModel = {
        Indexing: false,
        Cache: false,
        MediaRequestProtect: false,
        Dll: false,
        Dianoga: false,
        Scheduler: false,
        TdsPackageDeployer: false,
        Analytics: false,
        PathAnalyzer: false,
        Heartbeat: false,
        Audit: false,
        ManagedPoolThread: false,
        SitecoreInstanceInfo: false,
        Miscellaneous: false
    };

    $scope.checkCategoryResults = [];

    $scope.$watchCollection('checkCategoryModel', function ()
    {
        $scope.checkCategoryResults = [];
        angular.forEach($scope.checkCategoryModel, function (value, key)
        {
            if (value)
            {
                $scope.checkCategoryResults.push(key);
            }
        });
    });
    //#endregion

    //#region Status Filters
    $scope.checkStatusModel = {
        Info: false,
        Warn: false,
        Error: false
    };

    $scope.checkStatusResults = [];

    $scope.$watchCollection('checkStatusModel', function ()
    {
        $scope.checkStatusResults = [];
        angular.forEach($scope.checkStatusModel, function (value, key)
        {
            if (value)
            {
                $scope.checkStatusResults.push(key);
            }
        });
    });
    //#endregion
}]);
