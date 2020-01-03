angular.module('MetronicApp').filter('DateFilter', function ($filter) {
    return function (input) {
        if (input == null) { return ""; }
        return $filter('date')(new Date(getDateOUrFormat(input)), 'dd-MM-yyyy');
    };
});
angular.module('MetronicApp').filter('TimeFilter', function ($filter) {
    return function (input) {
        if (input == null) { return ""; }
        return $filter('date')(new Date(getDateOUrFormat(input)), 'HH:mm:ss');
    };
});
angular.module('MetronicApp').filter('TimeFilterHHmm', function ($filter) {
    return function (input) {
        if (input == null) { return ""; }
        return $filter('date')(new Date(getDateOUrFormat(input)), 'HH:mm');
    };
});
angular.module('MetronicApp').filter('TimeFilterAMPM', function ($filter) {
    return function (input) {
        if (input == null) { return ""; }
        return $filter('date')(new Date(getDateOUrFormat(input)), 'hh:mma');
    };
});
angular.module('MetronicApp').filter('DateTimeFilter', function ($filter) {
    return function (input) {
        if (input == null) { return ""; }
        var _date = $filter('date')(new Date(getDateOUrFormat(input)), 'dd-MM-yyyy hh:mm');
        return _date;
    };
});
angular.module('MetronicApp').filter('DateTimeFilterAMPM', function ($filter) {
    return function (input) {
        if (input == null) { return ""; }
        var _date = $filter('date')(new Date(getDateOUrFormat(input)), 'dd-MM-yyyy hh:mma');
        return _date;
    };
});

//Convert date and time in acceptable format
function getDateOUrFormat(input) {
    var datetemp = input.split('T')[0];
    var dt = new Date(datetemp);
    var year = dt.getFullYear();
    var date = dt.getDate();
    if (parseInt(date) < 10)
        date = '0' + date;
    var month = parseInt(dt.getMonth()) + 1;
    if (parseInt(month) < 10)
        month = '0' + month;
    var time = (input.split('T')[1]).split('Z')[0];
    time = time + '.000Z';
    return year + '-' + month + '-' + date + 'T' + time;
}

angular.module('MetronicApp').filter('DatabaseDateFormat', function ($filter) {
    return function (input) {
        if (input == null || input === "") { return "00-00-1971T00:00:00Z"; }
        if (input.indexOf('-') > -1) {
            input = input.split('-')[2] + '-' + input.split('-')[1] + '-' + input.split('-')[0];
        }
        else {
            input = input.split('/')[2] + '-' + input.split('/')[1] + '-' + input.split('/')[0];
        }
        var dt = new Date(input);
        var year = dt.getFullYear();
        var date = dt.getDate();
        if (parseInt(date) < 10)
            date = '0' + date;
        var month = parseInt(dt.getMonth()) + 1;
        if (parseInt(month) < 10)
            month = '0' + month;
        return month + '-' + date + '-' + year + 'T' + '00:00:00Z';
    };
});

//use to send as parameter for database
angular.module('MetronicApp').filter('DatabaseDateFormatMMddyyyy', function ($filter) {
    return function (input) {
        if (input === null || input === "" || angular.isUndefined(input)) { return null; }
        else {
            var dt = new Date(input);
            var ISODate = new Date(dt.toISOString());
            var year = ISODate.getFullYear();
            var date = ISODate.getDate();
            if (parseInt(date) < 10)
                date = '0' + date;
            var month = parseInt(ISODate.getMonth()) + 1;
            if (parseInt(month) < 10)
                month = '0' + month;
            return month + '-' + date + '-' + year + 'T' + '00:00:00Z';
        }
        //if (input.indexOf('-') > -1) {
        //    input = input.split('-')[2] + '-' + input.split('-')[0] + '-' + input.split('-')[1];
        //}
        //else {
        //    input = input.split('/')[2] + '-' + input.split('/')[0] + '-' + input.split('/')[1];
        //}
       
    };
});

// to get only date from databse date
angular.module('MetronicApp').filter('DateFormatMMddyyyy', function ($filter) {
    return function (input) {
        if (input === null || input === "" || angular.isUndefined(input)) { return ""; }
        if (input.indexOf(':') > -1) {
            //input = (input.split('-')[2]).split('T')[0] + '-' + input.split('-')[0] + '-' + input.split('-')[1] + 'T' + (input.split('-')[2]).split('T')[1];
            //input = (input.split('-')[2]).split('T')[0] + '-' + input.split('-')[0] + '-' + input.split('-')[1];
            var a = input.split('T');
            var localDate = new Date(a[0]);
            var dt = new Date(localDate.toLocaleString());
            return $filter('date')(dt, "MM/dd/yyyy");
        }
        else
        {
            var localDate = new Date(input);
            var dt = new Date(localDate.toLocaleString());
            return $filter('date')(dt, "MM/dd/yyyy");
        }
    };
});
// to get date and time from databse date
angular.module('MetronicApp').filter('DateFormatMMddyyyyHHmm', function ($filter) {
    return function (input) {
        if (input === null || input === "" || angular.isUndefined(input)) { return ""; }
        if (input.indexOf('-') > -1) {
            input = (input.split('-')[2]).split('T')[0] + '-' + input.split('-')[0] + '-' + input.split('-')[1] + 'T' + (input.split('-')[2]).split('T')[1];
            var localDate = new Date(input);
            var dt = new Date(localDate.toLocaleString());
            return $filter('date')(dt, "MM/dd/yyyy h:mm:ssa");
            //return $filter('date')(dt, "MM/dd/yyyy hh:mm:ss");
        }

    };
});


// to get time from databse date
angular.module('MetronicApp').filter('DateFormatTime', function ($filter) {
    return function (input) {
        if (input === null || input === "" || angular.isUndefined(input)) { return ""; }
        if (input.indexOf('-') > -1) {
            input = (input.split('-')[2]).split('T')[0] + '-' + input.split('-')[0] + '-' + input.split('-')[1] + 'T' + (input.split('-')[2]).split('T')[1];
            var localDate = new Date(input);
            var dt = new Date(localDate.toLocaleString());
            return $filter('date')(dt, "h:mma");
        }

    };
});

// to get time from databse date
angular.module('MetronicApp').filter('DateFormatTimeOne', function ($filter) {
    return function (input) {
        if (input === null || input === "" || angular.isUndefined(input)) { return ""; }
        if (input.indexOf(':') > -1) {
            input = (input.split('-')[2]).split('T')[0] + '-' + input.split('-')[0] + '-' + input.split('-')[1] + 'T' + (input.split('-')[2]).split('T')[1];
            var localDate = new Date(input);
            var dt = new Date(localDate.toLocaleString());
            return $filter('date')(dt, "HH:mm");
        }

    };
});


//Todays date
angular.module('MetronicApp').filter('TodaysDate', function ($filter) {
    return function () {
        var dt = new Date();
        var year = dt.getFullYear();
        var date = dt.getDate();
        if (parseInt(date) < 10)
            date = '0' + date;
        var month = parseInt(dt.getMonth()) + 1;
        if (parseInt(month) < 10)
            month = '0' + month;
        return month + '/' + date + '/' + year;
    }
});
angular.module('MetronicApp').filter('TodaysDateCal', function ($filter) {
    return function () {
        var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];;
        var dt = new Date();
        var year = dt.getFullYear();
        var date = dt.getDate();
        if (parseInt(date) < 10)
            date = '0' + date;

        return  date +'/'+ monthNames[dt.getMonth()] + '/' + year;
    }
});

// Date format for get time for event details
angular.module('MetronicApp').filter('DateFormatMMddyyyyHHmmTime', function ($filter) {
    return function (input) {
        if (input === null || input === "" || angular.isUndefined(input)) { return ""; }
        if (input.indexOf('-') > -1) {
            input = (input.split('-')[2]).split('T')[0] + '-' + input.split('-')[0] + '-' + input.split('-')[1] + 'T' + (input.split('-')[2]).split('T')[1];
            var localDate = new Date(input);
            var dt = new Date(localDate.toLocaleString());
            //return $filter('date')(dt, "MM/dd/yyyy h:mma");
            return $filter('date')(dt, "MM/dd/yyyy HH:mm:ss");
        }

    };
});

// Date format for calender 
angular.module('MetronicApp').filter('DateFormatyyyyMMddHHmmTime', function ($filter) {
    return function (input) {
        if (input === null || input === "" || angular.isUndefined(input)) { return ""; }
        if (input.indexOf('-') > -1) {
            input = (input.split('-')[2]).split('T')[0] + '-' + input.split('-')[0] + '-' + input.split('-')[1] + 'T' + (input.split('-')[2]).split('T')[1];
            var localDate = new Date(input);
            var dt = new Date(localDate.toLocaleString());
            //return $filter('date')(dt, "MM/dd/yyyy h:mma");
            return $filter('date')(dt, "yyyy-MM-dd HH:mm:ss");
        }

    };
});