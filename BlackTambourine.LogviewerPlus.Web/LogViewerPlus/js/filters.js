var basefilters = angular.module('corpApp.filters', []);

//To Log Entry Status 
basefilters.filter('toLogEntryStatus', [function () {
    return function (input) {

        switch (input)
        {
            case 0:
                return "Info";
            case 1:
                return "Warn";
            case 2:
                return "Error";
            case 3:
                return "Stacktrace";
            case 4:
                return "None";
            default:
                return "None";
        }
    };
}]);

//To Log Entry Category 
basefilters.filter('toLogEntryCategory', [function () {
    return function (input) {

        switch (input) {
            case 0:
                return "ErrorOutput";
            case 1:
                return "Cache";
            case 2:
                return "MediaRequestProtect";
            case 3:
                return "Dll";
            case 4:
                return "Dianoga";
            case 5:
                return "Scheduler";
            case 6:
                return "TdsPackageDeployer";
            case 7:
                return "Analytics";
            case 8:
                return "PathAnalyzer";
            case 9:
                return "Indexing";
            case 11:
                return "Heartbeat";
            case 12:
                return "Audit";
            case 13:
                return "ManagedPoolThread";
            case 14:
                return "SitecoreInstanceInfo";
            case 15:
                return "Miscellaneous";
            default:
                return "Miscellaneous";
        }
    };
}]);