angular.module('MetronicApp').service('GemLabClaimDetailsService', ['$http', '$rootScope', 'AuthHeaderService', function ($http, $rootScope, AuthHeaderService) {


    //-------------------------------Newly Added copied from adjuster property claim detials service---------------------------------------------------------------------------------------------------//

    //get claim status details for content section- API #158
    this.getClaimsStatusContentDetails = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/adjuster/claim/contents",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }

    //get claim status details for invoice section- API #155
    this.getClaimsStatusInvoiceDetails = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/claim/invoice/contents",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }

    //get post lost items - API #78
    this.getLostOrDamagedContent = function (param) {

        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/claim/postloss/items",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }

    //get Category List - API #161
    this.getCategories = function () {
        var response = $http({
            method: "Get",
            url: AuthHeaderService.getApiURL() + "web/categories",
            //data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }

    //get Vendors List Against Claim with status details - API #173
    this.getVendorsAgainstClaimDetails = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/claim/participants/status",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
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

    //Save post lost item against claim    
    //this.AddPostLostItem = function (param) {
    //    var response = $http({
    //        method: "Post",
    //        url: AuthHeaderService.getApiURL() + "web/add/itemtopostloss",
    //        data: param,
    //        headers: AuthHeaderService.getHeader()
    //    });
    //    return response;
    //}


    //Remove post lost item  API #93
    this.removePostLostItem = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/remove/postlossitem",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }

    //get claim notes API New- #126
    this.getClaimNotes = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/notes",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }

    //add claim notes API #120
    this.addClaimNoteWithOptionalAttachment = function (param) {

        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/claim/push/note",
            data: param,
            headers: AuthHeaderService.getFileHeader()
            //headers: { "X-Auth-Token": sessionStorage.getItem("AccessToken"),"Content-Type":undefined }
        });
        return response;
    }


    //add claim attachment  API #157
    this.addClaimAttachment = function (param) {

        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/add/claim/attachments",
            data: param,
            headers: AuthHeaderService.getFileHeader()
            //headers: { "X-Auth-Token": sessionStorage.getItem("AccessToken") }
        });
        return response;
    }

    //add vendor API New #56
    this.addVendor = function (param) {

        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/add/vendor",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }


    //get claim attachment #156

    this.getClaimAttachments = function (param) {

        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/claim/attachments",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }

    //get participant type #171

    this.getParticipantType = function () {
        var response = $http({
            method: "Get",
            url: AuthHeaderService.getApiURL() + "web/partcipant/types",
            //data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };


    //get serach result for existing employee#166
    this.searchExistingEmployee = function (param) {

        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/search/vendors",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }


    //get serach result for internal employee#147
    this.searchInternalEmployee = function (param) {

        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/search/employees",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }

    //get all states #123
    this.getStates = function (param) {

        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/states",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }


    this.getSubCategory = function (param) {

        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/item/subcategories",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }


    this.getPricingSpecialist = function (param) {

        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/price/specialist",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }


    this.getPostLostItemsWithComparables = function (param) {

        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/claim/line/items",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }

    //Post loss
    this.AddPostLossItem = function (param) {
        var AddPostLoss = $http({
            method: "Post",
            data: param,
            url: AuthHeaderService.getApiURL() + "web/vendor/add/item",
            headers: AuthHeaderService.getFileHeader()
        });
        return AddPostLoss;
    }

    this.UpdatePostLoss = function (param) {
        var UpdatePostLoss = $http({
            method: "post",
            url: AuthHeaderService.getApiURL() + "web/claim/update/postlossitem",
            data: param,
            headers: AuthHeaderService.getFileHeader()
        });
        return UpdatePostLoss;
    }
    //Delete Post Loss Item API #93
    this.DeleteLostDamageItem = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/remove/item",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }

    this.getLostDamagedItemList = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/claim/postloss/items",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }

    this.getVendorServiceList = function () {
        var response = $http({
            method: "Get",
            url: AuthHeaderService.getApiURL() + "web/vendor/services",
            //data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }

    //assign multiple post lost items to pricing specialist
    this.assignPostLostItem = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/assign/items/vendor",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }
    //get Event List
    this.GetEventList = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/claim/events",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }
    //Get pending task for user
    this.GetPendingTask = function (param) {
        var task = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/claim/pendingtasklist",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return task;
    }
    //Creating a pending task against a claim
    this.CreatePendingtask = function (param) {
        var task = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/claim/create/task",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return task;
    }

    //add external particiapnt

    this.addExternalParticipant = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/claim/add/external/participant",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;

    }

    //get all vendor invoices
    this.getAllVendorInvoices = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/vendor/invoicelist",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }

    //get invoices to be paid
    this.getInvoicesToBePaid = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/unpaid/invoices/value",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;

    }

    //get policy details
    this.getPolicyDetails = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/policy/info",
            data: param,
            headers: AuthHeaderService.getHeader()
        })
        return response;
    }

    //Add Existing Vendor/ Internal Vendor against claim 
    this.assignClaim = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/claim/assign",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }


    //get vendor with service cost 
    this.getVendorWithServiceCost = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/vendor/service/rate",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;

    }

    //get all vendors with service list and cost

    this.getVendorWithSelectedService = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/potential/cost",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;

    }

    //CreateEvent
    this.CreateEvent = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/schedule/event",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }
    //InvoicePayment
    this.MakePayment = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/invoice/payment",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }

    //Assign Speciality to vendor
    this.assignSpeciality = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/update/speciality/",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }

    //get insurance details
    this.GetInsuranceDetails = function (param) {
        var response = $http({
            method: "POST",
            url: AuthHeaderService.getApiURL() + "web/get/claim/insuracecompany/detail",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };

    //get policyholders details
    this.GetPolicyHolderDetails = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/policy/info",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };

    //get content details function
    this.GetContentDetails = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/vendor/claim/content",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };


    //vendor list to Assign line item
    this.getVendorForAssignItems = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/company/vendors",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }

    //get post loss item list for vendor
    this.getPostLostItemsForVendor = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/claim/vendor/assigneditems",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }

    //getservice reuqested list for 3rd party API#234
    this.getServiceRequestedList = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/servicerequests",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };


    //Get claim status list
    this.GetClaimStatusList = function (param) {
        var list = $http({
            method: "GET",
            url: AuthHeaderService.getApiURL() + "web/claim/statuslist",
            headers: AuthHeaderService.getHeader()
        });
        return list;
    };

    //Get vendor associate list
    this.getVendorAssociateList = function () {
        var response = $http({
            method: "GET",
            url: AuthHeaderService.getApiURL() + "web/vendor/associates",
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };

    //Assign line item to vendor associate by vendor

    this.assignPostLostItemToAssociate = function (param) {
        var response = $http({
            method: "POST",
            url: AuthHeaderService.getApiURL() + "web/associate/assign/items",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };

    //Get Vendor assignment Details
    this.GetVendorassignmentDetails = function (param) {
        var Assign = $http({
            method: "post",
            data: param,
            url: AuthHeaderService.getApiURL() + "web/insurance/company/assignmentdetails",
            headers: AuthHeaderService.getHeader()
        });
        return Assign;
    };


    this.GetAssignmentInvoices = function (param) {
        var Assign = $http({
            method: "post",
            data: param,
            url: AuthHeaderService.getApiURL() + "web/item/invoices",
            headers: AuthHeaderService.getHeader()
        });
        return Assign;
    };

    this.getInvoiceDetails = function (param) {
        var Assign = $http({
            method: "post",
            data: param,
            url: AuthHeaderService.getApiURL() + "web/vendor/invoice/details",
            headers: AuthHeaderService.getHeader()
        });
        return Assign;
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

    this.SendClaimForSupervisorReview = function (param) {
        var response = $http({
            method: "POST",
            url: AuthHeaderService.getApiURL() + "web/review/claim/supervisor",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };
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


    //API#628  Service to change the tax-rate of the claim-assignment.
    this.changeTaxRate = function (param) {
        var response = $http({
            method: "POST",
            url: AuthHeaderService.getApiURL() + "web/update/taxrate/assignment",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };

    //API#634 Service to update policy holder details by Vendor contact or vendor associate
    this.updatePolicyHolder = function (param) {
        var response = $http({
            method: "POST",
            url: AuthHeaderService.getApiURL() + "web/update/policyholder",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };

    //API#627 Service for re-Open a claim-assignment even after it is closed
    this.reOpenClaim = function (param) {
        var response = $http({
            method: "POST",
            url: AuthHeaderService.getApiURL() + "web/reopen/claim/assignment",
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