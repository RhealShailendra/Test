angular.module('MetronicApp').service('VendorApprisalService', ['$http', 'AuthHeaderService', function ($http, AuthHeaderService) {
    // Service to get the gender list for appraisal 581.
    this.getgenderList = function () {
        var response = $http({
            method: "Get",
            url: AuthHeaderService.getApiURL() + "web/genders",             
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }

    // Service to get the appraisal type list for appraisal 582.
    this.getAppraisalTypeList = function () {
        var response = $http({
            method: "Get",
            url: AuthHeaderService.getApiURL() + "web/appraisal/types",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }

    //Service to get the custom type for appraisal 583.
    this.getCustomTypeList = function () {
        var response = $http({
            method: "Get",
            url: AuthHeaderService.getApiURL() + "web/custom",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }

    //Service to get appraisal by vendor contact person or vendor associate 584
    this.getAppraisalList = function (param) {
        var response = $http({
            method: "POST",
            data:param,
            url: AuthHeaderService.getApiURL() + "web/appraisal/list",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }

    //Service to get the metal type list to fill the drop down value 512
    this.getMetalList = function (param) {
        var response = $http({
            method: "Get",
            url: AuthHeaderService.getApiURL() + "web/metal/type",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }
    //Service to get the metal color list to fill the drop down value 513
    this.getMetaColorList = function (param) {
        var response = $http({
            method: "Get",
            url: AuthHeaderService.getApiURL() + "web/metal/color",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }
    //Service for get the list of jewellery category 539
    this.getjewelleryTypeList = function (param) {
        var response = $http({
            method: "Get",
            url: AuthHeaderService.getApiURL() + "web/jewellery/category/list ",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }
    //Service to get the stone shape list to fill the drop down value 516
    this.getStoneShapeList = function (param) {
        var response = $http({
            method: "Get",
            url: AuthHeaderService.getApiURL() + "web/stone/shape",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }
  
    //Service to get the stone color grade list to fill the drop down value 515
    this.getStoneColorList = function (param) {
        var response = $http({
            method: "Get",
            url: AuthHeaderService.getApiURL() + "web/stone/color",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }

    //Service to get the stone clarity list to fill the drop down value 517
    this.getStoneclarityList = function (param) {
        var response = $http({
            method: "Get",
            url: AuthHeaderService.getApiURL() + "/web/stone/clarity",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }

    //Service to add appraisal by vendor contact person or vendor associate 584
    this.addAppraisal = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/add/appraisal",
            data: param,
            headers: AuthHeaderService.getFileHeader()
        });
        return response;
    };


    //Service to get the appraisal details against appraisal number by vendor contact person or vendor associate 586
    this.getAppraisalDetails = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/appraisal/details",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };

    //Service to delete item appraisal by appraisal number from vendor company side. 587
    this.deleteAppraisal = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/delete/appraisal",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };

    this.GetPolicyHolderDetails = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/policy/info",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };
}]);