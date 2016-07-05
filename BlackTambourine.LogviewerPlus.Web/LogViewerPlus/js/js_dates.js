window.jsDates = window.jsDates || {};

(function (jsDates) {
    //#region Dates

    //today as dd/mm/yyyy
    jsDates.getCurrentDateString = function () {
        return moment().format('DD/MM/YYYY');
    }

    // parse a date in dd/mm/yyyy format or dd/mm/yyyy HH:mm:ss
    // return new Date(year, month [, day [, hours[, minutes[, seconds[, ms]]]]])
    jsDates.parseDate = function (input) {
        var dateTimeSplit = input.split(' ');

        //return date with time
        if (dateTimeSplit.length > 1) {
            return moment(input, 'DD/MM/YYYY HH:mm:ss').toDate();
        }
        return moment(input, 'DD/MM/YYYY').toDate();
    }

    //Json changes the offset when using a data object, so pass as a string formatted yyyy-mm-dd
    // return new string(year, month [, day [, hours[, minutes[, seconds[, ms]]]]])
    jsDates.parseDateForJson = function (input) {
        var dateTimeSplit = input.split(' ');

        //return date with time
        if (dateTimeSplit.length > 1) {
            return moment(input, 'DD/MM/YYYY HH:mm:ss').format(input, 'YYYY-MM-DD HH:mm:ss');
        }
        return moment(input, 'DD/MM/YYYY').format('YYYY-MM-DD');
    }

    //parse a date object to dd/mm/yyyy
    jsDates.parseDateObjectFromJson = function (input, includeTime) {
        if (input == "0001-01-01T00:00:00")
            return "";

        var dateTimeSplit = input.split('T');

        //return date with time
        if (dateTimeSplit.length > 1 && includeTime == true) {
            return moment(input, moment.ISO_8601).format(input, 'DD/MM/YYYY HH:mm:ss');
        }
        return moment(input, moment.ISO_8601).format('DD/MM/YYYY');
    }

    //parse a date object to '2010-01-09T12:30:00' format
    jsDates.parseDateToCalendarDateFromJson = function (input, includeTime) {
        if (input == "0001-01-01T00:00:00")
            return "";

        var dateTimeSplit = input.split('T');

        //return date with time
        if (dateTimeSplit.length > 1 && includeTime == true) {
            return input.replace('Z', '');
        }
        return moment(input, moment.ISO_8601).format('YYYY-MM-DD');
    }

    //return whether a dd/mm/yyyy string is a valid date
    jsDates.isValidDate = function (dateStr) {
        if (dateStr == undefined)
            return false;

        return moment(dateStr, 'DD/MM/YYYY').isValid();
    };

    //difference in days
    jsDates.getDateDifference = function (fromDate, toDate) {
        return jsDates.parseDate(toDate) - jsDates.parseDate(fromDate);
    };

    //from date < to date
    jsDates.isValidDateRange = function (fromDate, toDate) {
        if (fromDate == "" || toDate == "" || fromDate == undefined || toDate == undefined)
            return true;

        if (jsDates.isValidDate(fromDate) == false) {
            return false;
        }

        if (jsDates.isValidDate(toDate) == true) {
            var days = jsDates.getDateDifference(fromDate, toDate);
            if (days < 0) {
                return false;
            }
        }
        return true;
    };
    //#endregion Dates

    //#region Datapicker defaults
    //From Date has midnight as default from time
    jsDates.getDefaultDatepickerFromDate = function () {
        var dateToday = new Date();
        var d = new Date(dateToday.getFullYear(), dateToday.getMonth(), dateToday.getDate(), 0, 0, 0, 0);
        return d;
    };

    //To Date has 11:59pm as the default to time
    jsDates.getDefaultDatepickerToDate = function () {
        var dateToday = new Date();
        var d = new Date(dateToday.getFullYear(), dateToday.getMonth(), dateToday.getDate(), 23, 59, 59, 999);
        return d;
    };
    //#endregion

})(window.jsDates);