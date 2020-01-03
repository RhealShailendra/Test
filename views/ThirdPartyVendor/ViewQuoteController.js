angular.module('MetronicApp').controller('ViewQuoteController', function ($rootScope, $filter, $uibModal, $location, $scope, $translate, $translatePartialLoader
    , QuoteService, AuthHeaderService) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });
    //set language 
    $translatePartialLoader.addPart('ViewQuote');
    $translate.refresh();

    $scope.ddlStateList = [];
    $scope.IsQuoteCreated = false;
    $scope.CommonObject = {};
    $scope.PolicyholderDetails = {};
    $scope.VendorDetails = {};
    $scope.VendorQuoteDetails = {};
    $scope.Insurance
    $scope.ClaimContents;
    $scope.ReplacementItem = [];
    $scope.comparableItems = [];
    $scope.IsSubmit = true; //for disable the submit button
    $scope.InsuranceCompanyDetails = {company:{officeAddress:null} };

    function init() {
        $scope.CommonObject = {
            ClaimNumber: sessionStorage.getItem("ClaimNumber"),
            ClaimId: sessionStorage.getItem("ClaimId"),
            ItemId: sessionStorage.getItem("ItemId"),
            ItemNumber: sessionStorage.getItem("ItemNumber"),
            Items: JSON.parse(sessionStorage.getItem("Items")),
            Name: sessionStorage.getItem("UserLastName") + ", " + sessionStorage.getItem("UserFirstName"),
            AssignmentNumber: sessionStorage.getItem("AssignmentNumber"),
            AssignmentId: sessionStorage.getItem("AssignmentId"),
            ClaimDetailsPage: sessionStorage.getItem("ClaimDetailsPage"),
            LineDetailsPage: sessionStorage.getItem("LineDetailsPage"),
            BackPage: sessionStorage.getItem("BackPage")
        };
         
        GetQuoteDetails();//check here AssignementNumber have a quote created or not
        //disable coz if assignment Number having 2 line item & 1st item have comparable and quote created for that then 2nd item not able to display in the quote page
        //if ($scope.IsQuoteCreated == false) 
        {
        GetInsuranceCompanyDetails();
        GetPolicyHolderDetails();
        GetVendorDetails();
        GetReplacementItem();
        }

        var param = {
            "isTaxRate": false,
            "isTimeZone": false
        };
        var getStates = QuoteService.getStates(param);
        getStates.then(function (success) {
            $scope.ddlStateList = success.data.data;
        },
        function (error) {
            if (angular.isDefined(error.data) && error.data !== null) {
                toastr.error(error.data.errorMessage, "Error");
            }
            else {

                toastr.remove();
                toastr.error(AuthHeaderService.genericErrorMessage(), "Error");
            }
        });
        
    };
    init();

    $scope.GetInsuranceCompanyDetails = GetInsuranceCompanyDetails;
    function GetInsuranceCompanyDetails() {
        var param_CompanyDetails = {
            "claimNumber": $scope.CommonObject.ClaimNumber
        };
        $(".page-spinner-bar").removeClass("hide");
       
        var getDetails = QuoteService.GetClaimDetails(param_CompanyDetails);
        getDetails.then(function (success) {
            $scope.InsuranceCompanyDetails = success.data.data;
            $(".page-spinner-bar").addClass("hide");
        }, function (error) {
             
            toastr.remove();
            if (error.data.errorMessage != null && angular.isDefined(error.data.errorMessage)) {
                toastr.error(error.data.errorMessage, "Error")
            }
            else {
                toastr.error(AuthHeaderService.genericErrorMessage(), "Error")
            }
            $(".page-spinner-bar").addClass("hide");
        });
    };

    $scope.GetPolicyHolderDetails = GetPolicyHolderDetails;
    function GetPolicyHolderDetails() {
        param_PolicyHolder =
            {
                "policyNumber": null,
                "claimNumber": $scope.CommonObject.ClaimNumber
            };
        $(".page-spinner-bar").removeClass("hide");
        var getDetails = QuoteService.GetPolicyHolderDetails(param_PolicyHolder);
        getDetails.then(function (success) {
            $scope.PolicyholderDetails = success.data.data;
            $(".page-spinner-bar").addClass("hide");
        }, function (error) {
            toastr.remove();
            if (error.data.errorMessage != null && angular.isDefined(error.data.errorMessage)) {
                toastr.error(error.data.errorMessage, "Error")
            }
            else {
                toastr.error(AuthHeaderService.genericErrorMessage(), "Error")
            }
            $(".page-spinner-bar").addClass("hide");
        });
    };

    $scope.GetVendorDetails = GetVendorDetails;
    function GetVendorDetails() {
        $(".page-spinner-bar").removeClass("hide");
        var getVendorDetails = QuoteService.GetVendorDetails();
        getVendorDetails.then(function (success) {
            $scope.VendorDetails = success.data.data;           
            $(".page-spinner-bar").addClass("hide");
        }, function (error) {
            toastr.remove();
            if (error.data.errorMessage != null && angular.isDefined(error.data.errorMessage)) {
                toastr.error(error.data.errorMessage, "Error")
            }
            else {
                toastr.error(AuthHeaderService.genericErrorMessage(), "Error")
            }
            $(".page-spinner-bar").addClass("hide");
        });
    };
    $scope.SubTotal = "0";
    $scope.TaxRate = "0";
    $scope.Tax = "0";
    $scope.Total = "0";
    $scope.Shipping = "0";
    $scope.Deductible = "0";

    $scope.GetReplacementItem = GetReplacementItem;
    function GetReplacementItem() {
        param =  {"assignmentNumber": $scope.CommonObject.AssignmentNumber};
        var getReplacementItem = QuoteService.GetReplacementItem(param);
        getReplacementItem.then(function (success) {
            $scope.ReplacementItemDetails = success.data.data;
            $scope.comparableItems = [];
            var comparableItemsLength=0;
            angular.forEach($scope.ReplacementItemDetails, function (itemDetails) {
                angular.forEach($scope.CommonObject.Items, function (Itemid) {
                    if (angular.isDefined(itemDetails.claimItem) && itemDetails.claimItem != null) {
                        if (parseInt(Itemid) == itemDetails.claimItem.id) {
                            //itemDetails.claimItem.isReplaced = true; //This set to true for making item replaced before saving quote details
                            $scope.ReplacementItem.push(itemDetails);
                            $scope.TaxRate = parseFloat(itemDetails.claimItem.taxRate == null ? 0 : itemDetails.claimItem.taxRate);
                            angular.forEach(itemDetails.comparableItems, function (item) {
                                if (item.isReplacementItem === true) {
                                    $scope.comparableItems.push(item);
                                    $scope.SubTotal = parseFloat($scope.SubTotal) + parseFloat(item.unitPrice == null ? 0 : item.unitPrice);
                                    comparableItemsLength++;
                                }
                            });
                            $scope.Tax = parseFloat($scope.TaxRate / 100) * parseFloat($scope.SubTotal);
                            $scope.Total = parseFloat($scope.SubTotal) + parseFloat($scope.Tax) + parseFloat($scope.Shipping) + parseFloat($scope.Deductible);
                        }
                    }
                });
            });

            if ($scope.CommonObject.Items.length == comparableItemsLength) {
                $scope.IsSubmit = false;
            }
           
        }, function (error) {
            toastr.remove();
            if (error.data.errorMessage != null && angular.isDefined(error.data.errorMessage)) {
                toastr.error(error.data.errorMessage, "Error")
            }
            else {
                toastr.error(AuthHeaderService.genericErrorMessage(), "Error")
            }
        });
    };

    $scope.GetQuoteDetails = GetQuoteDetails;
    function GetQuoteDetails() {
        param = { "assignmentNumber": $scope.CommonObject.AssignmentNumber };               
        $(".page-spinner-bar").removeClass("hide");
        var getQuoteDetails = QuoteService.GetQuoteDetails(param);         
        getQuoteDetails.then(function (success) {          
            $scope.QuoteDetails = success.data.data;
            $scope.QuoteId = $scope.QuoteDetails.id;
            $scope.vendorComment = $scope.QuoteDetails.vendorComment;          
            $(".page-spinner-bar").addClass("hide");
        }, function (error) {
            $scope.IsQuoteCreated = false;
            toastr.remove();            
            $(".page-spinner-bar").addClass("hide");
        });
    };

    $scope.GoToClaimDetails = GoToClaimDetails;
    function GoToClaimDetails() {
        sessionStorage.setItem("ThirdPartyClaimNo", $scope.CommonObject.ClaimNumber);
        sessionStorage.setItem("ThirdPartyClaimId", $scope.CommonObject.ClaimId);
        role = sessionStorage.getItem('RoleList');
           if (role == 'GEMLAB ADMINISTRATOR')
            $location.url('GemlabClaimDetails');
        else
            $location.url($scope.CommonObject.ClaimDetailsPage)
      // 
    };

    $scope.GoToLineItem = GoToLineItem;
    function GoToLineItem(ItemId) {
        
        if ($scope.CommonObject.ClaimDetailsPage == "VendorAssociateClaimDetails") {
            sessionStorage.setItem("AssociatePostLostItemId", $scope.CommonObject.ItemId);
            sessionStorage.setItem("VendorAssociateClaimNo", $scope.CommonObject.ClaimNumber);
            sessionStorage.setItem("VendorAssociateClaimId", $scope.CommonObject.ClaimId);
            sessionStorage.setItem("Policyholder", $scope.PolicyholderDetails.policyHolder.firstName + " " + $scope.PolicyholderDetails.policyHolder.lastName);
            $location.url('VendorAssociateItemDetails');
        }
        else {
            sessionStorage.setItem("ThirdPartyClaimNo", $scope.CommonObject.ClaimNumber);
            sessionStorage.setItem("ThirdPartyClaimId", $scope.CommonObject.ClaimId);
            sessionStorage.setItem("ThirdPartyPostLostItemId", $scope.CommonObject.ItemId);
            sessionStorage.setItem("Policyholder", $scope.PolicyholderDetails.policyHolder.firstName + " " + $scope.PolicyholderDetails.policyHolder.lastName);
            $location.url($scope.CommonObject.LineDetailsPage);
        }
    };

    $scope.GoToBackPage = GoToBackPage;
    function GoToBackPage() {
        sessionStorage.setItem("ThirdPartyClaimNo", $scope.CommonObject.ClaimNumber);
        sessionStorage.setItem("ThirdPartyClaimId", $scope.CommonObject.ClaimId);
        sessionStorage.setItem("ThirdPartyPostLostItemId", $scope.CommonObject.ItemId);
        sessionStorage.setItem("Policyholder", $scope.PolicyholderDetails.policyHolder.firstName + " " + $scope.PolicyholderDetails.policyHolder.lastName);
        $location.url($scope.CommonObject.BackPage);
    }

    $scope.GoToHome = GoToHome;
    function GoToHome() {
        $location.url(sessionStorage.getItem('HomeScreen'));
    };

    $scope.SendToAdjusterPopUp = SendToAdjusterPopUp;
    function SendToAdjusterPopUp() {
        $scope.animationsEnabled = true;
        var AdjsuterDetails = {
            Name: $scope.InsuranceCompanyDetails.adjuster.lastName + ", " + $scope.InsuranceCompanyDetails.adjuster.firstName,
            Phone:$scope.InsuranceCompanyDetails.adjuster.cellPhone,
            Email: $scope.InsuranceCompanyDetails.adjuster.email
        };

        var vm = this;
        var out = $uibModal.open(
            {
                animation: $scope.animationsEnabled,
                templateUrl: "views/ThirdPartyVendor/SendToAdjusterPopUp.html",
                controller: "SendToAdjusterPopUpController",
                resolve:
                {
                    objItemDetails: function () {
                        objItemDetails = AdjsuterDetails;
                        return objItemDetails;
                    }
                }
            });
        out.result.then(function (value) {
            if (value == "success") {

            }
        }, function () {

        });
        return {
            open: open
        };
    };

    $scope.SaveReplacementItem = SaveReplacementItem;
    function SaveReplacementItem() {
        angular.forEach($scope.ReplacementItemDetails, function (itemDetails) {
            angular.forEach($scope.CommonObject.Items, function (Itemid) {
                if (angular.isDefined(itemDetails.claimItem) && itemDetails.claimItem != null) {
                    //if (angular.isDefined(itemDetails.claimItem.id) && itemDetails.claimItem.id != null) {
                    if (parseInt(Itemid) == itemDetails.claimItem.id) {
                        angular.forEach(itemDetails.comparableItems, function (item) {
                            if (item.isReplacementItem === true) {
                                angular.forEach($scope.comparableItems, function (comparableItems) {
                                    if (comparableItems.id == item.id)
                                    {
                                        itemDetails.comparableItems = [];
                                        itemDetails.comparableItems[0] = comparableItems;
                                    }
                                });
                            }
                        });
                    }
                }
            });
        });

        param =
            {
                "id": angular.isDefined($scope.QuoteDetails)?(angular.isDefined($scope.QuoteDetails.id) && $scope.QuoteDetails.id!=null ? $scope.QuoteDetails.id:null):null,
                "claimNumber": $scope.CommonObject.ClaimNumber,
                "assignmentNumber": $scope.CommonObject.AssignmentNumber,
                "companyDetails": {
                    "crn": $scope.InsuranceCompanyDetails.company.companyCrn
                },
                "subTotal": $scope.SubTotal,
                "taxRate": $scope.TaxRate,
                "tax": $scope.Tax,
                "shippingCost": $scope.Shipping,
                "deductible": $scope.Deductible,
                "total": $scope.Total,
                "vendorComment": $scope.vendorComment,
                "adjusterNotificationDetails": {
                    "companyRegistrationNumber": $scope.InsuranceCompanyDetails.company.companyCrn,
                    "vendorRegistrationNumber": $scope.VendorDetails.registrationNumber,
                    "assignmentNumber": $scope.CommonObject.AssignmentNumber,
                    "adjusterEmail": $scope.InsuranceCompanyDetails.adjuster.email
                },
                "itemComparables": $scope.ReplacementItem
            };
         
        $(".page-spinner-bar").removeClass("hide");
        var ReplacementItemDetails = QuoteService.SaveReplacementItem(param);     
        ReplacementItemDetails.then(function (success) {
            toastr.remove();
            toastr.success(success.data.message, "Confirmation");            
            $location.url($scope.CommonObject.BackPage);
            $(".page-spinner-bar").addClass("hide");
        }, function (error) {
            toastr.remove()
            toastr.error((error.data) ? error.data.message : "Failed to saved the order details.", "Error");
            $(".page-spinner-bar").addClass("hide");
        });          
    };

    $scope.CreatePDF = CreatePDF;
    function CreatePDF() {
        ////Get the HTML of div
        //var divElements = document.getElementById('PrintableDiv').innerHTML;
        ////Get the HTML of whole page
        //var oldPage = document.body.innerHTML;

        ////Reset the page's HTML with div's HTML only
        //document.body.innerHTML =
        //  "<html><head><title></title></head><body>" +
        //  divElements + "</body>";
        ////Print Page
        //window.print();
        ////Restore orignal HTML
        //document.body.innerHTML = oldPage;

        var printContents = document.getElementById('PrintableDiv').innerHTML;
        var popupWin = window.open('', '_blank', 'width=300,height=300');
        popupWin.document.open();
        popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + printContents + '</body></html>');
        popupWin.document.close();

    }
   
});