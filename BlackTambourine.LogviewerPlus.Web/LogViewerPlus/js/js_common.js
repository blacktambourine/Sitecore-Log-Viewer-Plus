window.jsCommon = window.jsCommon || {};

(function (jsCommon) {
    //get a URL parameter
    jsCommon.getUrlParameter = function (theParameter) {
        var params = window.location.search.substr(1).split('&');

        for (var i = 0; i < params.length; i++) {
            var p = params[i].split('=');
            if (p[0] == theParameter) {
                return decodeURIComponent(p[1]);
            }
        }
        return false;
    };

    //add a parameter to a URL
    jsCommon.addUrlParameter = function (url, theParameterName, theParameterValue) {
        var parameterVal = encodeURIComponent(theParameterValue);

        if (window.location.pathname.indexOf('?') >= 0) {
            url = url + '&';
        }
        else {
            url = url + '?';
        }
        return url + theParameterName + '=' + parameterVal;
    }

    //change a parameter
    jsCommon.changeUrlParameter = function (uri, key, value) {
        var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
        var separator = uri.indexOf('?') !== -1 ? "&" : "?";
        if (uri.match(re)) {
            return uri.replace(re, '$1' + key + "=" + value + '$2');
        }
        else {
            return uri + separator + key + "=" + value;
        }
    }

    //redirect back to the return url specified in url parameters
    jsCommon.redirectToReturnUrl = function () {
        var returnUrl = jsCommon.getUrlParameter("returnUrl");
        if (returnUrl) {
            window.location.replace(returnUrl);
        }
        else {
            location.reload(true);
        }
    };



    //Finds y value of given object
    jsCommon.findPos = function (obj) {
        var curtop = 0;
        if (obj.offsetParent) {
            do {
                curtop += obj.offsetTop;
            } while (obj = obj.offsetParent);
            return [curtop];
        }
        return 0;
    }

    //find an objects index in an array by a property value 
    jsCommon.findIndexInObjectArray = function (array, prop, value) {
        for (var i = 0, len = array.length; i < len; i++)
            if (array[i][prop] === value) return i;

        return -1;
    }

    //To make upper the first letter of first word and lower the rest words - Sentence case
    jsCommon.toSentanceCase = function (inputString) {
        var n = inputString.split(".");
        var vfinal = "";
        for (i = 0; i < n.length; i++) {
            var spaceput = "";
            var spaceCount = n[i].replace(/^(\s*).*$/, "$1").length;
            n[i] = n[i].replace(/^\s+/, "");
            var newstring = n[i].charAt(n[i]).toUpperCase() + n[i].slice(1);
            for (j = 0; j < spaceCount; j++)
                spaceput = spaceput + " ";
            vfinal = vfinal + spaceput + newstring + ".";
        }
        vfinal = vfinal.substring(0, vfinal.length - 1);
        return vfinal;
    }

    jsCommon.toTitleCase = function (str) {
        return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); }).replace(' And ', ' and ').replace(' Of ', ' of ');
    }

    //#region Browser detection
    jsCommon.GetBrowserDetect = function () {
        var BrowserDetect = {
            init: function () {
                this.browser = this.searchString(this.dataBrowser) || "Other";
                this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || "Unknown";
            },
            searchString: function (data) {
                for (var i = 0; i < data.length; i++) {
                    var dataString = data[i].string;
                    this.versionSearchString = data[i].subString;

                    if (dataString.indexOf(data[i].subString) !== -1) {
                        return data[i].identity;
                    }
                }
            },
            searchVersion: function (dataString) {
                var index = dataString.indexOf(this.versionSearchString);
                if (index === -1) {
                    return;
                }

                var rv = dataString.indexOf("rv:");
                if (this.versionSearchString === "Trident" && rv !== -1) {
                    return parseFloat(dataString.substring(rv + 3));
                } else {
                    return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
                }
            },

            dataBrowser: [
                { string: navigator.userAgent, subString: "Chrome", identity: "Chrome" },
                { string: navigator.userAgent, subString: "MSIE", identity: "Explorer" },
                { string: navigator.userAgent, subString: "Trident", identity: "Explorer" },
                { string: navigator.userAgent, subString: "Firefox", identity: "Firefox" },
                { string: navigator.userAgent, subString: "Safari", identity: "Safari" },
                { string: navigator.userAgent, subString: "Opera", identity: "Opera" }
            ]

        };

        BrowserDetect.init();
        return BrowserDetect;
    }

    jsCommon.isBrowserCompatible = function () {
        var browserDetect = jsCommon.GetBrowserDetect();
        if (browserDetect.browser == "Explorer" && browserDetect.version <= 8) {
            return false;
        }
        return true;
    }
    //#endregion

})(window.jsCommon);