angular.module('MetronicApp').controller('MERController', function ($translate, $translatePartialLoader, $rootScope, $log, $scope, $window,
    settings, $http, $timeout, $uibModal, $location, $filter,ThirdPartyLineItemDetailsService) {

 
    $translatePartialLoader.addPart('MER');
    $translate.refresh();
    $scope.CommonObj = {};
    $scope.comparableMarkAsReplacement = [];
    $scope.ReplacementDescription = "";
    function init() {

        $scope.CommonObj = {            
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
         
        $scope.currentDate = new Date();

        var param = {
            "itemId": $scope.CommonObj.ItemId
        };
        $(".page-spinner-bar").removeClass("hide");
        var getItemDetailsOnId = ThirdPartyLineItemDetailsService.gteItemDetails(param);
        getItemDetailsOnId.then(function (success) {
            $scope.ItemDetails = success.data.data;
            $scope.ItemDetails.acv = ($scope.ItemDetails.acv !== null && angular.isDefined($scope.ItemDetails.acv)) ? parseFloat($scope.ItemDetails.acv.toFixed(2)) : $scope.ItemDetails.acv;
            $scope.ItemDetails.holdOverValue = ($scope.ItemDetails.holdOverValue !== null && angular.isDefined($scope.ItemDetails.holdOverValue)) ? parseFloat($scope.ItemDetails.holdOverValue.toFixed(2)) : $scope.ItemDetails.holdOverValue;
            $scope.ItemDetails.totalTax = ($scope.ItemDetails.totalTax !== null && angular.isDefined($scope.ItemDetails.totalTax)) ? parseFloat($scope.ItemDetails.totalTax.toFixed(2)) : $scope.ItemDetails.totalTax;
            $scope.ItemDetails.valueOfItem = ($scope.ItemDetails.valueOfItem !== null && angular.isDefined($scope.ItemDetails.valueOfItem)) ? parseFloat($scope.ItemDetails.valueOfItem.toFixed(2)) : $scope.ItemDetails.valueOfItem;
            $scope.ItemDetails.rcv = ($scope.ItemDetails.rcv !== null && angular.isDefined($scope.ItemDetails.rcv)) ? parseFloat($scope.ItemDetails.rcv.toFixed(2)) : $scope.ItemDetails.rcv;
           
            $(".page-spinner-bar").removeClass("hide");
            var GetExistingComparablesFromDb = ThirdPartyLineItemDetailsService.GetExistingComparablesFromDb(param);
            GetExistingComparablesFromDb.then(function (successComparables) {
                $scope.Comparables = successComparables.data.data;              
                $(".page-spinner-bar").addClass("hide");
            }, function (error) {
                $scope.ErrorMessage = error.data.errorMessage;
            });
            
        }, function (error) {

        });
        GetInsuranceCompanyDetails();
    }init();

    $scope.GetInsuranceCompanyDetails = GetInsuranceCompanyDetails;
    function GetInsuranceCompanyDetails() {
        var param = { "claimNumber": $scope.CommonObj.ClaimNumber }
        var getCompanyDetails = ThirdPartyLineItemDetailsService.GetInsuranceCompanyDetails(param);
        getCompanyDetails.then(function (success) {
            $scope.InsuranceCompanyDetails = success.data.data;
        }, function (error) {
            toastr.remove();
            if (error.data.errorMessage != null && angular.isDefined(error.data.errorMessage)) {
                toastr.error(error.data.errorMessage, "Error")
            }
            else {
                toastr.error(AuthHeaderService.genericErrorMessage(), "Error")
            }
        });
    }
    $scope.GoToHome = function () {
        $location.url(sessionStorage.getItem('HomeScreen'));
    };

    //$scope.goToClaimDetails = function () {
    //    //$location.url('ThirdPartyClaimDetails');
    //};

    $scope.GoBack = function () {
        //$location.url('ThirdPartyLineItemDetails');
    };

    $scope.GoToClaimDetails = GoToClaimDetails;
    function GoToClaimDetails() {
        sessionStorage.setItem("ThirdPartyClaimNo", $scope.CommonObj.ClaimNumber);
        sessionStorage.setItem("ThirdPartyClaimId", $scope.CommonObj.ClaimId);
        role = sessionStorage.getItem('RoleList');
        if (role == 'GEMLAB ADMINISTRATOR')
            $location.url('GemlabClaimDetails');
        else
            $location.url($scope.CommonObj.ClaimDetailsPage)
    };

    $scope.GoToLineItem = GoToLineItem;
    function GoToLineItem(ItemId) {

        if ($scope.CommonObj.ClaimDetailsPage == "VendorAssociateClaimDetails") {
            sessionStorage.setItem("AssociatePostLostItemId", $scope.CommonObj.ItemId);
            sessionStorage.setItem("VendorAssociateClaimNo", $scope.CommonObj.ClaimNumber);
            sessionStorage.setItem("VendorAssociateClaimId", $scope.CommonObj.ClaimId);
            sessionStorage.setItem("Policyholder", $scope.CommonObj.Name);
            $location.url('VendorAssociateItemDetails');
        }
        else {
            sessionStorage.setItem("ThirdPartyClaimNo", $scope.CommonObj.ClaimNumber);
            sessionStorage.setItem("ThirdPartyClaimId", $scope.CommonObj.ClaimId);
            sessionStorage.setItem("ThirdPartyPostLostItemId", $scope.CommonObj.ItemId);
            sessionStorage.setItem("Policyholder", $scope.CommonObj.Name);
            $location.url($scope.CommonObj.LineDetailsPage);
        }
    };

    $scope.GoToBackPage = GoToBackPage;
    function GoToBackPage() {
        sessionStorage.setItem("ThirdPartyClaimNo", $scope.CommonObj.ClaimNumber);
        sessionStorage.setItem("ThirdPartyClaimId", $scope.CommonObj.ClaimId);
        sessionStorage.setItem("ThirdPartyPostLostItemId", $scope.CommonObj.ItemId);
        sessionStorage.setItem("Policyholder", $scope.PolicyholderDetails.policyHolder.firstName + " " + $scope.PolicyholderDetails.policyHolder.lastName);
        $location.url($scope.CommonObj.BackPage);
    }

    $scope.GoToHome = GoToHome;
    function GoToHome() {
        $location.url(sessionStorage.getItem('HomeScreen'));
    };

    $scope.MarkAsReplacement = MarkAsReplacement;
    function MarkAsReplacement(comp) {
        angular.forEach($scope.Comparables.comparableItems, function (item) {
            if (item.id == comp.id) {
                item.isReplacementItem = true;
            }
            else {
                item.isReplacementItem = false;
            }
        });
    };

    function calculateACVRCV(item) {
        //Toatal RCV if more than one comparable is added
        $scope.replacementCost = item.unitPrice;
        $scope.ActualCashValue = 0.0;
        //Get age of item
        if ($scope.ItemDetails.ageMonths !== null && angular.isDefined($scope.ItemDetails.ageMonths) && $scope.ItemDetails.ageMonths > 0) {
            if ($scope.ItemDetails.ageYears !== null && angular.isDefined($scope.ItemDetails.ageYears) && $scope.ItemDetails.ageYears !== "")
                age = parseFloat($scope.ItemDetails.ageYears) + (parseFloat($scope.ItemDetails.ageMonths) / 12);
            else
                age = (parseFloat($scope.ItemDetails.ageMonths) / 12);
        }
        else {
            if ($scope.ItemDetails.ageYears !== null && angular.isDefined($scope.ItemDetails.ageYears))
                age = parseFloat($scope.ItemDetails.ageYears);
            else
                age = 1;
        }

        var frequency = parseFloat(12);
        var DepereciationAmount
        //Get Depereciation rate
        if ($scope.ItemDetails.depriciationRate !== null && angular.isDefined($scope.ItemDetails.depriciationRate) && $scope.ItemDetails.depriciationRate > 0) {
            Depereciation = $scope.ItemDetails.depriciationRate;
            DepereciationAmount = parseFloat($scope.replacementCost) * (Math.pow((1 + (parseFloat(Depereciation) / (100 * frequency))), (frequency * age)));
            $scope.ActualCashValue = (parseFloat($scope.replacementCost) - (DepereciationAmount - parseFloat($scope.replacementCost)));
        }
        else {
            $scope.ActualCashValue = parseFloat($scope.replacementCost);
        }
        $scope.replacementCost = ($scope.replacementCost).toFixed(2);
        $scope.ActualCashValue = ($scope.ActualCashValue).toFixed(2);
        if (isNaN($scope.replacementCost)) {
            $scope.replacementCost = 0;
        }
        if (isNaN($scope.ActualCashValue)) {
            $scope.ActualCashValue = 0;
        }
    }
    //$scope.downloadPdf = downloadPdf;
    //function downloadPdf() {
    //    window.print();
    //}

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