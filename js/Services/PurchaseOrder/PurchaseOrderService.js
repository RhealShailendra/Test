angular.module('MetronicApp').service('PurchaseOrderService', ['$http', 'AuthHeaderService', function ($http,AuthHeaderService) {
    this.GetOrderTypes = function () {
        var response = $http({
            method: "GET",
            url: AuthHeaderService.getApiURL() + "web/orderstype",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };
    this.SaveBoxInBox = function (param) {
        var response = $http({
            method: "POST",
            data: param,
            url: AuthHeaderService.getApiURL() + "web/add/purchase/order",
            headers: AuthHeaderService.getFileHeader()
        });
        return response;
    };

    this.SaveGemlabRequest = function (param) {
        var response = $http({
            method: "POST",
            data: param,
            url: AuthHeaderService.getApiURL() + "web/save/gemlab/purchase/order",
            headers: AuthHeaderService.getFileHeader()
        });
        return response;
    };
   
    this.GetStates = function (Shipment) {
        var States = $http({
            method: "Post",
            data: Shipment,
            url: AuthHeaderService.getApiURL() + "web/states",
            headers: AuthHeaderService.getHeader()
        });
        return States;
    };

    this.GetPurchaseOrderDetails = function (paramId) {
        var response = $http({
            method: "POST",
            data: paramId,
            url: AuthHeaderService.getApiURL() + "web/purchase/order",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };
    this.GetAllPurchaseOrder = function (paramId) {
        var response = $http({
            method: "POST",
            data: paramId,
            url: AuthHeaderService.getApiURL() + "web/purchase/orders",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };
    this.CancelPurchaseOrder = function (paramId) {
        var response = $http({
            method: "POST",
            data: paramId,
            url: AuthHeaderService.getApiURL() + "web/cancel/purchase/order",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };
    this.GetPurchaseOrderMethod = function () {
        var response = $http({
            method: "GET",
            url: AuthHeaderService.getApiURL() + "web/purchase/order/methods",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };
    this.GetLaborCode = function () {
        var LaborCode = $http({
            method: "GET",
            url: AuthHeaderService.getApiURL() + "web/get/vendor/laborcodes",
            headers: AuthHeaderService.getHeader()
        });
        return LaborCode;
    };
    this.GetVendorList = function () {
        var GetVendor = $http({
            method: "GET",
            url: AuthHeaderService.getApiURL() + "web/all/vendor/suppliers",
            headers: AuthHeaderService.getHeader()
        });
        return GetVendor;
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
    this.GetPurchaseOrderByAssignment = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/vendor/assignment/purchase/orders",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };

    this.GetPackingSlipList = function () {      
        var response = $http({
            method: "Get",
            url: AuthHeaderService.getApiURL() + "web/packingslip/attaches",
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

    //get payment terms list
    this.getPaymentTerms = function () {
        var response = $http({
            method: "Get",
            url: AuthHeaderService.getApiURL() + "web/paymentterms",
            // data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };
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
    
    this.GetClaimReasonList = function () {
        var response = $http({
            method: "Get",
            url: AuthHeaderService.getApiURL() + "web/claim/reason",           
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };
    this.GetItemTypeList = function () {
        var response = $http({
            method: "Get",
            url: AuthHeaderService.getApiURL() + "web/gemlab/itemtype",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };
    this.GetMetalTypeList = function () {
        var response = $http({
            method: "Get",
            url: AuthHeaderService.getApiURL() + "web/metal/type",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };
    this.GetMetalColorList = function () {
        var response = $http({
            method: "Get",
            url: AuthHeaderService.getApiURL() + "web/metal/color",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };
    this.GetStoneTypeList = function () {
        var response = $http({
            method: "Get",
            url: AuthHeaderService.getApiURL() + "web/stone/type",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };

    this.GetStoneColorList = function () {
        var response = $http({
            method: "Get",
            url: AuthHeaderService.getApiURL() + "web/stone/color",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };

    this.GetStoneShapeList = function () {
        var response = $http({
            method: "Get",
            url: AuthHeaderService.getApiURL() + "web/stone/shape",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };
    this.GetStoneClarityList = function () {
        var response = $http({
            method: "Get",
            url: AuthHeaderService.getApiURL() + "web/stone/clarity",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };

    this.GetGemLabAssignmentList = function () {
        var response = $http({
            method: "Get",
            url: AuthHeaderService.getApiURL() + "web/gemlab/department/assignments",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };
    //Add Item Return
    this.SaveReturnItems = function (param) {
        var response = $http({
            method: "Post",
            data:param,
            url: AuthHeaderService.getApiURL() + "web/add/return/purchase/order",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };
    //Update Item Return
    this.UpdateReturnItems = function (param) {
        var response = $http({
            method: "Post",
            data: param,
            url: AuthHeaderService.getApiURL() + "web/update/return/purchase/order",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };
    this.getReturnItems = function (param) {
        var response = $http({
            method: "Post",
            data:param,
            url: AuthHeaderService.getApiURL() + "web/purchase/order/return",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };
    //Send Notification to GemlabAdmin
    this.sendNotification_admin = function (param) {
        var response = $http({
            method: "Post",
            data: param,
            url: AuthHeaderService.getApiURL() + "web/send/notification/gemlab/admin",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };

    //Send Notification to Associate
    this.sendNotification_associate = function (param) {
        var response = $http({
            method: "Post",
            data: param,
            url: AuthHeaderService.getApiURL() + "web/send/notification/associate",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }; 

   
    this.getStatusList = function (param) {
        var response = $http({
            method: "post",
            data: param,
            url: AuthHeaderService.getApiURL() + "web/purchase/order/statuslist",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };

    
    this.ChangeOrderStatus = function (param) {
        var response = $http({
            method: "post",
            data: param,
            url: AuthHeaderService.getApiURL() + "web/update/status/purchase/order",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };

    this.GetAllGemlabPurchaseOrder = function (param) {
        var response = $http({
            method: "POST",
            data: param,
            url: AuthHeaderService.getApiURL() + "web/item/gemlab/purchaseorders",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };

    this.GemlabOrderDetails = function (param) {
        var response = $http({
            method: "POST",
            data: param,
            url: AuthHeaderService.getApiURL() + "web/gemlab/purchase/order/details",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };
}]);