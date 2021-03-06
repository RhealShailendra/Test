﻿angular.module('MetronicApp').service('GemLabLineItemDetailsService', ['$http', '$rootScope', 'AuthHeaderService', function ($http, $rootScope, AuthHeaderService) {

    //get item notes API #127
    this.getItemNotes = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/notes",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }
    this.getInvoiceList = function (param) {
        var getreceipt = $http({
            method: "POST",
            url: AuthHeaderService.getApiURL() + "web/item/invoice",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return getreceipt;
    }
    //Get receipt list 276
    this.getReceiptList = function (param) {
        var getreceipt = $http({
            method: "POST",
            url: AuthHeaderService.getApiURL() + "web/item/mapped/receipt",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return getreceipt;
    }
    //Add item notes with attachment API #20
    this.addItemNote = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/item/push/note",
            data: param,
            headers: AuthHeaderService.getFileHeader()
        });
        return response;
    }

    //Get category API #29
    this.getCategory = function () {
        var response = $http({
            method: "Get",
            url: AuthHeaderService.getApiURL() + "web/claim//get/category",
            //data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }

    //Add item notes API #30
    this.getSubCategory = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "/web/item/subcategories",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };


    this.GetComparableListFromGoogle = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/vendor/search/replacement", //"web/claim/search/replacement",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };

    //API New #34
    this.deleteLineItem = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/remove/postlossitem",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }


    //get participant against line item - API #172    
    this.getVendorsListAgainstClaim = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/claim/participants",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }

    //Get item single details on id #144
    this.gteItemDetails = function (param) {
        var details = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/claim/itemdetails",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return details;
    }
    ////Get image of items on id
    //this.gteItemImagess = function (param) {
    //    var details = $http({
    //        method: "Post",
    //        url: AuthHeaderService.getApiURL() + "web/item/images",
    //        data: param,
    //        headers: AuthHeaderService.getHeader()
    //    });
    //    return details;
    //}

    //Get compairables for item
    this.gteItemImagess = function (param) {

        var details = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/item/images",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return details;
    }

    //Save line item details
    this.SaveItemDetails = function (param) {
        var details = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/claim/update/postlossitem",
            data: param,
            headers: AuthHeaderService.getFileHeader()
        });
        return details;
    }
    //Get replacement Suppliers (Google, Amazon)
    this.GetReplacementSupplier = function (param) {
        var list = $http({
            method: "Get",
            url: AuthHeaderService.getApiURL() + "web/claim/replacementsuppliers",
            data: param,
            headers: AuthHeaderService.getFileHeader()
        });
        return list;
    }

    //Get Comparables form DB
    this.GetExistingComparablesFromDb = function (param) {
        var list = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/item/comparables",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return list;
    }

    //Save New comparables form Gooogle
    this.SaveNewComparables = function (param) {
        var list = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/vendor/save/item/comparables",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return list;
    }
    //Accept item accept button click
    this.AcceptItem = function (param) {
        var Accept = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/item/approve",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return Accept;
    }
    //Add note against claim with participant 
    this.addClaimNoteWithParticipant = function (param) {
        var Addnote = $http({
            method: "POST",
            url: AuthHeaderService.getApiURL() + "web/push/note", //web/private/note  
            data: param,
            headers: AuthHeaderService.getFileHeader()
        });
        return Addnote;
    }


    //Add note against claim with participant 
    this.AddCustomItem = function (param) {
        var response = $http({
            method: "POST",
            url: AuthHeaderService.getApiURL() + "web/add/custom/item",
            data: param,
            headers: AuthHeaderService.getFileHeader()
        });
        return response;
    };
    //Add note against claim with participant 
    this.GetCustomItemsList = function (param) {
        var response = $http({
            method: "POST",
            url: AuthHeaderService.getApiURL() + "web/get/custom/item",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };

    this.DeleteCustomItem = function (param) {
        var response = $http({
            method: "POST",
            url: AuthHeaderService.getApiURL() + "web/delete/custom/item",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };

    this.DeleteCustomSubItem = function (param) {
        var response = $http({
            method: "POST",
            url: AuthHeaderService.getApiURL() + "web/delete/custom/subitem",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };

    this.ChangeStatusOfCustomItem = function (param) {
        var response = $http({
            method: "PUT",
            url: AuthHeaderService.getApiURL() + "web/update/status/custom/item",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };

    this.SaveSalvageItem = function (param) {
        var response = $http({
            method: "POST",
            url: AuthHeaderService.getApiURL() + "web/mark/item/salvage",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };

}]);