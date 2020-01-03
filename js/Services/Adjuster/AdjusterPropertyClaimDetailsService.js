angular.module('MetronicApp').service('AdjusterPropertyClaimDetailsService', ['$http', '$rootScope', 'AuthHeaderService', function ($http, $rootScope, AuthHeaderService) {
    
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
    }


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
            method: "post",
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
            url: AuthHeaderService.getApiURL() + "web/add/itemtopostloss",
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
            url: AuthHeaderService.getApiURL() + "web/remove/postlossitem",
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
            url: AuthHeaderService.getApiURL() + "web/specialist/assign/items",
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
            //url: AuthHeaderService.getApiURL() + "web/claim/tasks/status",
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
            url: AuthHeaderService.getApiURL() + "web/company/invoicelist",//web/vendor/invoicelist  
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;

    };

    //get vendor list who cretaed invocies against claim #401
  
    this.getAllVendorListForClaim= function (param) {

        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/claim/vendor/list",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;

    };

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
            url: AuthHeaderService.getApiURL() + "web/update/speciality",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }

    //GetItemsTobesettle
    this.GetItemsTobesettle = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/claim/settle/items",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    } 
    //Payment using Debit
        this.PaymentDebitCard = function (param) {
            var response = $http({
                method: "Post",
                url: AuthHeaderService.getApiURL() + "web/items/payment",
                data: param,
                headers: AuthHeaderService.getHeader()
            });
            return response;
        }
    //Save services requested for Post loss items
        this.SaveServiceRequested = function (param) {
            var response = $http({
                method: "Post",
                url: AuthHeaderService.getApiURL() + "web/assign/items/vendor",
                data: param,
                headers: AuthHeaderService.getHeader()
            });
            return response;
        }

    //Invite third party vendor
    this.inviteThirdPartyVendor = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/invite/vendor", 
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }

    //Get vendor Details
    this.getVendorDetails = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/assignment/vendor/details",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }
    this.AddParticipantAgainstClaim = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/add/claim/participant",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }

    //get list of service request API #226
    

    this.getServiceRequestList = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/servicerequests",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }

    //Delete service request
    this.DeleteServiceRequest = function (param) {
        var servicerequest = $http({
            method: "DELETE",
            url: AuthHeaderService.getApiURL() + "web/delete/servicerequest",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return servicerequest;
    }

    //Add note against claim with participant
    this.addClaimNoteWithParticipant = function (param) {
        var Addnote = $http({
            method: "POST",
            url: AuthHeaderService.getApiURL() + "web/push/note", 
            data: param,
            headers: AuthHeaderService.getFileHeader()
        });
        return Addnote;
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

    //Get claim status list
    this.GetClaimInovicesByStatus = function (param) {
        var list = $http({
            method: "POST",
            data:param,
            url: AuthHeaderService.getApiURL() + "web/claim/invoices",
            headers: AuthHeaderService.getHeader()
        });
        return list;
    };
    //Invoice aprove
    this.ApproveInvoice = function (param) {
        var Result = $http({
            method: "POST",
            data:param,
            url: AuthHeaderService.getApiURL() + "web/invoice/approval",
            headers: AuthHeaderService.getHeader()
        });
        return Result;
    };

    
    //Vendors on claim
    this.getVendorWorkingonClaim = function (param) {
        var Result = $http({
            method: "POST",
            data: param,
            url: AuthHeaderService.getApiURL() + "web/claim/vendors",
            headers: AuthHeaderService.getHeader()
        });
        return Result;
    };

    //Add note against claim with participant
    this.ReplyClaimNote = function (param) {
        var Addnote = $http({
            method: "POST",
            url: AuthHeaderService.getApiURL() + "web/reply/notegroup",
            data: param,
            headers: AuthHeaderService.getFileHeader()
        });
        return Addnote;
    };

    this.getContentService = function () {
        var GetContentService = $http({
            method: "GET",
            url: AuthHeaderService.getApiURL() + "web/contentservices",
            headers: AuthHeaderService.getHeader()
        });
        return GetContentService;
    };
    this.getSelectedVendorDetails = function (param) {
        var VendorDetails = $http({
            method: "POST",
            data:param,
            url: AuthHeaderService.getApiURL() + "web/assignment/vendor/details",
            headers: AuthHeaderService.getHeader()
        });
        return VendorDetails;
    };
    this.AssignItemToVendor = function (param) {
        var Assign = $http({
            method: "POST",
            data: param,
            url: AuthHeaderService.getApiURL() + "web/assignment/vendor",
            headers: AuthHeaderService.getHeader()
        });
        return Assign;
    }; 

    this.getVendorList = function () {
        var Assign = $http({
            method: "Get",           
            url: AuthHeaderService.getApiURL() + "web/registered/vendors ",
            headers: AuthHeaderService.getHeader()
        });
        return Assign;
    };

    //Get Vendor assignment list
    this.getVendorAssignmnetList = function (param) {
        var Assign = $http({
            method: "post",
            data:param,
            url: AuthHeaderService.getApiURL() + "web/claim/assignment/vendorassignments",
            headers: AuthHeaderService.getHeader()
        });
        return Assign;
    };

    //Get Vendor assignment Details
    this.GetVendorassignmentDetails = function (param) {
        var Assign = $http({
            method: "post",
            data: param,
            url: AuthHeaderService.getApiURL() + "web/vendor/assignment/details",
            headers: AuthHeaderService.getHeader()
        });
        return Assign;
    };

    //Get Vendor assignment Details
    this.GetVendorassignmentItems = function (param) {
        var Assign = $http({
            method: "post",
            data: param,
            url: AuthHeaderService.getApiURL() + "web/vendor/assignment/items",
            headers: AuthHeaderService.getHeader()
        });
        return Assign;
    };
    //Get Vendor assignment Details
    this.getCompanyBranchList = function (param) {
        var List = $http({
            method: "post",
            data: param,
            url: AuthHeaderService.getApiURL() + "web/company/details",
            headers: AuthHeaderService.getHeader()
        });
        return List;
    };

    //Get Vendor assignment Details
    this.getQuoteDetails = function (param) {
        var List = $http({
            method: "post",
            data: param,
            url: AuthHeaderService.getApiURL() + "web/vendor/quote/details",
            headers: AuthHeaderService.getHeader()
        });
        return List;
    };

    this.GetQuoteDetails = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/adjuster/quote/details",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    }; 
    this.getInvocieContents = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/claim/invoice/contents",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };

}]);