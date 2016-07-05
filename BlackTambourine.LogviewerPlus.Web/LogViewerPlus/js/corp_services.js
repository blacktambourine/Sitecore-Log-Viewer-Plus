var corpServices = angular.module('corpApp.corpServices', ['ngResource']);

(function () {
    //#region Common Service Methods

    var serviceRootPath = '/api/LogViewerPlus/';

    //handle Sitecore Page/Experience Editor
    var ensureSitecoreContext = function (url) {
        var mode = jsCommon.getUrlParameter('sc_mode');
        if (mode !== false) {
            url += '?sc_mode=' + encodeURIComponent(mode);
        }
        return url;
    }

    //add anti-forgery token to all Authenticated GET and POST requests
    var AntiForgeryRequest = function (enableCache) {
        var details =
        {
            'get': { method: 'GET', headers: { 'X-XSRF-Token': angular.element('input[name="__RequestVerificationToken"]').attr('value') }, cache: enableCache },
            'post': { method: 'POST', headers: { 'X-XSRF-Token': angular.element('input[name="__RequestVerificationToken"]').attr('value') } }
        };
        return details;
    }

    //regular request for unauthenticated users
    var AnonymousRequest = function (enableCache) {
        var details =
        {
            'get': { method: 'GET', cache: enableCache },
            'post': { method: 'POST' }
        };
        return details;
    }

    var newService = function (serviceRoute, parameterObj, enableCache, authenticatedOnly) {
        var service =
        [
            '$resource', function ($resource) {
                if (authenticatedOnly) {
                    return $resource(ensureSitecoreContext(serviceRoute), parameterObj, AntiForgeryRequest(enableCache));
                }
                else {
                    return $resource(ensureSitecoreContext(serviceRoute), parameterObj, AnonymousRequest(enableCache));
                }
            }
        ];
        return service;
    }

    //#endregion

    //#region Service Definitions
    //newService = function (serviceRoute, parameterObj, enableCache, authenticatedOnly)
    
    //#region LogViewerService
    corpServices.factory('LogViewerPlusService', newService(serviceRootPath + 'LogViewerPlusSearch/:id', { id: '@id' }, true, false));
    //#endregion

    //#endregion

})();