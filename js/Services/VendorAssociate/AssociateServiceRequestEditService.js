angular.module('MetronicApp').service('AssociateServiceRequestEditService', ['$http', '$rootScope', 'AuthHeaderService', function ($http, $rootScope, AuthHeaderService) {

    //Update service request API #217
    this.UpdateServiceRequest = function (param) {
        var saveDetails = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/update/servicerequest",
            data: param,
            headers: AuthHeaderService.getFileHeader()
        });
        return saveDetails;
    }

    this.addNoteWithOptionalAttachment = function (param) {

        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/push/note",//web/servicerequest/note
            data: param,
            headers: AuthHeaderService.getFileHeader()
            //headers: { "X-Auth-Token": sessionStorage.getItem("AccessToken"),"Content-Type":undefined }
        });
        return response;
    }

    //List of service request category API#222
    this.getCategoriesList = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/servicerequest/categories",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }

    this.GetNoteList = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/notes",//web/servicerequest/notes
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }

    //Get status list for service
    this.GetStatusList = function () {
        var statusList = $http({
            method: "GET",
            url: AuthHeaderService.getApiURL() + "web/servicerequest/status",
            headers: AuthHeaderService.getHeader()
        });
        return statusList;
    }
    //Get details on serviceId
    this.GetServiceDetails = function (param) {
        var serviceDetails = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/servicerequest/details",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return serviceDetails;

    }
    this.DeleteServiceRequest = function (param) {
       
    }
    //Reject service request
    this.RejectServiceRequest = function (param) {
        var servicerequest = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/reject/servicerequest",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return servicerequest;
    }
    //get Vendors List Against Claim  - API #172
    this.getVendorsListAgainstClaim = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/claim/participants",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }

    //API#624 Service to delete media file from Vendor side schema
    this.deleteMediaFile = function (param) {
        var response = $http({
            method: "POST",
            url: AuthHeaderService.getApiURL() + "web/delete/mediafiles",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };
    //API#5 Service to update claim status
    this.DeleteNote = function (param) {
        var response = $http({
            method: "POST",
            url: AuthHeaderService.getApiURL() + "web/delete/note",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };
}]);
