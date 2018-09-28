angular.module('MetronicApp').service('VendorAssociateItemDetailsService', ['$http', '$rootScope', 'AuthHeaderService', function ($http, $rootScope, AuthHeaderService) {

    //get item notes API #127
    this.getItemNotes = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/notes",//web/item/notes
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
    }


    this.GetComparableListFromGoogle = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() +"web/vendor/search/replacement", //"web/claim/search/replacement",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }

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
    //Get image of items on id
    this.gteItemImagess = function (param) {
        var details = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/item/images",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return details;
    }

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


    //get Appraisal by pooja
    // this.GetExistingComparablesFromDb = function (param) {
    //     var list = $http({
    //         method: "GET",
    //         url: AuthHeaderService.getApiURL() + "web/get/appraisal/1",
    //         headers: AuthHeaderService.getHeader()
    //     });
    //     return list;
    // }


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
    // this.SaveNewComparables = function (param) {
    //     var list = $http({
    //         method: "PUT",
    //         url: AuthHeaderService.getApiURL() + "web/appraisal/update",
    //         data: param,
    //         headers: AuthHeaderService.getHeader()
    //     });
    //     return list;
    // }
    //Add note against claim with participant 
    this.addClaimNoteWithParticipant = function (param) {
        var Addnote = $http({
            method: "POST",
            url: AuthHeaderService.getApiURL() + "web/push/note",
            data: param,
            headers: AuthHeaderService.getFileHeader()
        });
        return Addnote;
    }

    this.SaveSalvageItem = function (param) {
        var response = $http({
            method: "POST",
            url: AuthHeaderService.getApiURL() + "web/mark/item/salvage",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };
    this.GetInsuranceCompanyDetails = function (param) {
        var response = $http({
            method: "POST",
            url: AuthHeaderService.getApiURL() + "web/get/claim/insuracecompany/detail",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };
    this.GetItemTypeList = function () {
        var response = $http({
            method: "GET",
            url: AuthHeaderService.getApiURL() + "web/jewellery/category/list ",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };

    this.GetSubItemType = function (param) {
        var response = $http({
            method: "POST",
            url: AuthHeaderService.getApiURL() + "web/jewellery/category/type/list",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };
    this.GetUnitMeasure = function () {
        var response = $http({
            method: "GET",
            url: AuthHeaderService.getApiURL() + "web/jewellery/weightunits",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };
    this.GetSemiMountingColor = function () {
        var response = $http({
            method: "GET",
            url: AuthHeaderService.getApiURL() + "web/jewellery/semi/mounting/colors",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };

    this.GetSemiMountingClarity = function () {
        var response = $http({
            method: "GET",
            url: AuthHeaderService.getApiURL() + "web/jewellery/semi/mounting/clarity",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };

    this.GetSemiMountingShape = function () {
        var response = $http({
            method: "GET",
            url: AuthHeaderService.getApiURL() + "web/jewellery/semi/mounting/shapes",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };
    this.GetSemiMountingMetalType = function () {
        var response = $http({
            method: "GET",
            url: AuthHeaderService.getApiURL() + "web/jewellery/semi/mounting/metaltypes",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };

    this.GetMountingMetalType = function () {
        var response = $http({
            method: "GET",
            url: AuthHeaderService.getApiURL() + "web/mounting/metaltypes",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };
    this.GetChainMetalType = function () {
        var response = $http({
            method: "GET",
            url: AuthHeaderService.getApiURL() + "web/chain/metaltypes",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };
    this.GetDiamondShape = function () {
        var response = $http({
            method: "GET",
            url: AuthHeaderService.getApiURL() + "web/diamond/shape",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };
    this.GetDiamondColor = function () {
        var response = $http({
            method: "GET",
            url: AuthHeaderService.getApiURL() + "web/diamond/color",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };
    this.GetDiamondClarity = function () {
        var response = $http({
            method: "GET",
            url: AuthHeaderService.getApiURL() + "web/diamond/clarity",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };
    this.GetDiamondGemlabs = function () {
        var response = $http({
            method: "GET",
            url: AuthHeaderService.getApiURL() + "web/diamond/gemlabs",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };
    this.GetDiamondCutgrades = function () {
        var response = $http({
            method: "GET",
            url: AuthHeaderService.getApiURL() + "web/diamond/cutgrades",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };

    this.GetGemstoneShape = function () {
        var response = $http({
            method: "GET",
            url: AuthHeaderService.getApiURL() + "web/gemstone/shape",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };

    this.GetGemstoneType = function () {
        var response = $http({
            method: "GET",
            url: AuthHeaderService.getApiURL() + "web/gemstone/types",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };
    this.GetGemstoneQuality = function () {
        var response = $http({
            method: "GET",
            url: AuthHeaderService.getApiURL() + "web/gemstone/quality",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };
    this.GetFilterComparableSearch = function (param) {
        var response = $http({
            method: "POST",
            url: AuthHeaderService.getApiURL() + "web/jewellery/last/filter",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };
    this.UpdatePostLoss = function (param) {
        var UpdatePostLoss = $http({
            method: "post",
            url: AuthHeaderService.getApiURL() + "web/claim/update/postlossitem",
            data: param,
            headers: AuthHeaderService.getFileHeader()
        });
        return UpdatePostLoss;
    }

    this.speedCheckLogin = function (param) {
        var response = $http({
            method: "post",
            url: sessionStorage.getItem("SpeedcheckLoginUrl"),
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };

    this.getSpeedcheck = function (param) {
        var response = $http({
            method: "post",
            //url: AuthHeaderService.getApiURL() + "web/get/speedcheck/value",
            url: sessionStorage.getItem("SpeedcheckUrl"),
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };
    this.saveAttachmentList = function (param) {
        var response = $http({
            method: "post",
            url: AuthHeaderService.getApiURL() + "web/add/item/attachments",
            data: param,
            headers: AuthHeaderService.getFileHeader()
        });
        return response;
    };
    this.getAttachmentList = function (param) {
        var response = $http({
            method: "post",
            url: AuthHeaderService.getApiURL() + "web/get/item/attachments",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };
    this.getComponents = function (param) {
        var response = $http({
            method: "post",
            url: AuthHeaderService.getApiURL() + "web/jewellery/itemtype/components",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };

    //Sending comparables to review for policyhoder
    this.sendDataToPolicyholder = function (param) {
        var response = $http({
            method: "post",
            url: AuthHeaderService.getApiURL() + "web/generate/sms/url",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };

    //sending SMS to pH
    this.sendSMSToPolicyholder = function (param) {
        var response = $http({
            method: "post",
            url: AuthHeaderService.getApiURL() + "web/send/plivo/sms",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };

    //Get sub item type option API #592
    this.getCutomeTypeOption = function () {
        var response = $http({
            method: "Get",
            url: AuthHeaderService.getApiURL() + "web/customitem/type",
            //data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };

    this.getPolicyholderURLToSendSMS = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/generate/sms/url",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };
}]); 