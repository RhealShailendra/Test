angular.module('MetronicApp').service('QuoteService', ['$http', '$rootScope', 'AuthHeaderService', function ($http, $rootScope, AuthHeaderService) {

    //get all states #123
    this.getStates = function (param) {

        var response = $http({
            method: "post",
            url: AuthHeaderService.getApiURL() + "web/states",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };

    //get claim status details for content section- API #158
    this.getClaimContents = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/adjuster/claim/contents",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };

    this.GetPolicyHolderDetails = function (param) {
        var response = $http({
            method: "post",
            data:param,
            url: AuthHeaderService.getApiURL() + "web/policy/info",           
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };

    this.GetVendorDetails = function () {
        var response = $http({
            method: "Get",
            //data:param,
            url: AuthHeaderService.getApiURL() + "web/vendor/company/details",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }; 

        //this.GetVendorDetails = function (param) {
        //    var response = $http({
        //        method: "Post",
        //        url: AuthHeaderService.getApiURL() + "web/vendor/details",
        //        data: param,
        //        headers: AuthHeaderService.getHeader()
        //    });
        //    return response;
        //};

        this.GetClaimDetails = function (param) {
            var response = $http({
                method: "Post",
                url: AuthHeaderService.getApiURL() + "web/get/claim/insuracecompany/detail",
                data: param,
                headers: AuthHeaderService.getHeader()
            });
            return response;
        };
        
        this.SaveVendorQuoteDetails = function (param) {
            var response = $http({
                method: "Post",
                url: AuthHeaderService.getApiURL() + "web/save/vendor/quote",
                data: param,
                headers: AuthHeaderService.getHeader()
            });
            return response;
        };

        this.GetReplacementItem = function (param) {
            var response = $http({
                method: "Post",
                url: AuthHeaderService.getApiURL() + "web/replacement/items",
                data: param,
                headers: AuthHeaderService.getHeader()
            });
            return response;
        };

        
        this.SaveReplacementItem = function (param) {
            var response = $http({
                method: "Post",
                url: AuthHeaderService.getApiURL() + "web/save/vendor/quote",
                data: param,
                headers: AuthHeaderService.getHeader()
            });
            return response;
        };

        this.GetQuoteDetails = function (param) {
            var response = $http({
                method: "Post",
                url: AuthHeaderService.getApiURL() + "web/vendor/quote/details",
                data: param,
                headers: AuthHeaderService.getHeader()
            });
            return response;
        };

}]);