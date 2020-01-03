angular.module('MetronicApp').controller('CreateServiceInvoiceController', function ($rootScope, $filter, $uibModal, $window, $scope, settings, $http, $timeout, $location, $translate,
   $translatePartialLoader, CreateServiceInvoiceService) {
    //set language
    $translatePartialLoader.addPart('CreateServiceInvoice');
    $translate.refresh();
    $scope.pagesize = $rootScope.settings.pagesize;
    $scope.StateList = [];
    $scope.SelectedItems = [];   
    $scope.VendorInvoiceDetails = { invoiceDetails: {}, billingAddress: { state: {} }, shippingAddress: { state: {} }, vendorRemitAddress: { state: {} }, InvoiceItems: [] };
    $scope.commonobject = {};
    $scope.commonobject = JSON.parse(sessionStorage.getItem("ClaimDetailsForInvoice"));
    $scope.VendorInvoiceDetails.invoiceDetails.taxRate = $scope.commonobject.taxRate; 
    $scope.VendorInvoiceDetails.claimNumber = $scope.commonobject.ClaimNoForInvice;    
    $scope.VendorInvoiceDetails.invoiceDetails.createDate = $filter('TodaysDate')();
    $scope.VendorInvoiceDetails.invoiceDetails.invoiceAmount = 0;
    $scope.SelectedItemForInvoice = [];
    $scope.Details =
        {
            Page: sessionStorage.getItem("DetailsPageURL"),
            ClaimDetails: JSON.parse(sessionStorage.getItem("ClaimDetailsForInvoice"))
        }; 
    function init() {
        $(".page-spinner-bar").removeClass("hide");
        $scope.VendorInvoiceDetails.invoiceDetails.currency = "USD";
        GetInsuranceCompanyDetails();
        //get StateList
        var param =
           {
               "isTaxRate": true,
               "isTimeZone": true
           }
        var getstate = CreateServiceInvoiceService.getStates(param);
        getstate.then(function (success) { $scope.StateList = success.data.data; }, function (error) { });
        $scope.PaymenttermsList = [];
        var GetPaymentTerms = CreateServiceInvoiceService.GetPaymentTerms();
        GetPaymentTerms.then(function (success) { $scope.PaymenttermsList = success.data.data; }, function (error) { });        
       
       
        var getVendorDetails = CreateServiceInvoiceService.getVendorDetails();
        getVendorDetails.then(function (success) {
            $scope.VendorDetails = success.data.data;
             
            $scope.VendorInvoiceDetails.name = $scope.VendorDetails.vendorName;
            //$scope.VendorInvoiceDetails.billingAddress = $scope.VendorDetails.billingAddress;
            $scope.VendorInvoiceDetails.vendorRemitAddress = (angular.isDefined($scope.VendorDetails.billingAddress) && $scope.VendorDetails.billingAddress !== null
                ? $scope.VendorDetails.billingAddress : null);
            //$scope.VendorInvoiceDetails.shippingAddress = $scope.VendorDetails.shippingAddress;
            $(".page-spinner-bar").addClass("hide");
        }, function (error) {
            $(".page-spinner-bar").addClass("hide");
        });
    }
    init();
   
    $scope.GetInsuranceCompanyDetails = GetInsuranceCompanyDetails;
    function GetInsuranceCompanyDetails() {
        var param = {
            "claimNumber": $scope.commonobject.ClaimNoForInvice
        };

        var getDetails = CreateServiceInvoiceService.GetClaimDetails(param);
        getDetails.then(function (success) {
            $scope.InsuranceCompanyDetails = success.data.data;
            $scope.VendorInvoiceDetails.billingAddress = $scope.InsuranceCompanyDetails.company.officeAddress;
            $scope.VendorInvoiceDetails.shippingAddress = $scope.InsuranceCompanyDetails.policyHolder.address;
            sessionStorage.setItem("CompanyId", $scope.InsuranceCompanyDetails.company.companyId);
            $scope.AdjusterName = $scope.InsuranceCompanyDetails.adjuster.lastName + ", " + $scope.InsuranceCompanyDetails.adjuster.firstName;
            $scope.InsuredName = $scope.InsuranceCompanyDetails.policyHolder.lastName + ", " + $scope.InsuranceCompanyDetails.policyHolder.firstName;
            $scope.InsuranceCompanyName = $scope.InsuranceCompanyDetails.company.companyName;
            //    $scope.BranchID = 123;

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
    //File Upload
    $scope.AddAttachment = function () {
        angular.element('#FileUpload').trigger('click');
    }
    $scope.InvoiceList = [];
    $scope.getInvoiceFileDetails = function (e) {
        $scope.$apply(function () {
            var files = event.target.files;
            $scope.filed = event.target.files;
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                var reader = new FileReader();
                reader.file = file;
                reader.fileName = files[i].name;
                reader.fileType = files[i].type;
                reader.fileExtension = files[i].name.substr(files[i].name.lastIndexOf('.'));
                reader.onload = $scope.LoadFileInList;
                reader.readAsDataURL(file);
            }
        });
    };
    $scope.LoadFileInList = function (e) {
        $scope.$apply(function () {
            $scope.InvoiceList.push(
                {
                    "FileName": e.target.fileName, "FileExtension": e.target.fileExtension, "FileType": e.target.fileType,
                    "Image": e.target.result, "File": e.target.file
                })
        });
    }
    //End File Upload

    //CreateNew invoice
    $scope.createInvoice = createInvoice;
    function createInvoice() {
        var paramInvoice = new FormData();
       // var ItemListForInvoiceSubmit = [];
        //angular.forEach($scope.SelectedItemForInvoice, function (item) { ItemListForInvoiceSubmit.push({ "id": item }) });

        var materialCharges = [];
        var laborCharges = [];
        angular.forEach($scope.MaterialCharges, function (item) {
            materialCharges.push({
                "description": item.description,
                "totalCharges": item.totalCost,
                "units": item.unit,
                "unitCost":item.unitCost,
                "type": "material"
            });
        });

        angular.forEach($scope.LabourCharges, function (item) {
            laborCharges.push({
                "description": item.description,
                "totalCharges": item.totalCost,
                "units": item.workedHour,
                "costPerHour":item.costPerHour,
                "type": "labor"
            });
        });
        var paramInvoice = new FormData();
        
       
        paramInvoice.append("invoiceDetails",JSON.stringify({
            "serviceRequestId": $scope.Details.ClaimDetails.ServiceRequestId,
            "registrationNumber":sessionStorage.getItem("CompanyCRN"),
            "serviceRequestInvoices": [{
                "isDraft": false,
                "currency": $scope.VendorInvoiceDetails.invoiceDetails.currency,
                "dueDate": $filter('DatabaseDateFormatMMddyyyy')($scope.VendorInvoiceDetails.invoiceDetails.dueDate),//null
                "invoiceDescription": $scope.VendorInvoiceDetails.invoiceDetails.vendorNote,
                "taxRate": 10,//$scope.VendorInvoiceDetails.invoiceDetails.taxRate,
                "invoiceAmount": $scope.VendorInvoiceDetails.invoiceDetails.invoiceAmount,
                "totalAmount": $scope.VendorInvoiceDetails.invoiceDetails.invoiceAmount,
                "remitAddress": {
                    "streetAddressOne": angular.isDefined($scope.VendorInvoiceDetails.vendorRemitAddress) && $scope.VendorInvoiceDetails.vendorRemitAddress != null ? $scope.VendorInvoiceDetails.vendorRemitAddress.streetAddressOne : null,
                    "streetAddressTwo": angular.isDefined($scope.VendorInvoiceDetails.vendorRemitAddress) && $scope.VendorInvoiceDetails.vendorRemitAddress != null ? $scope.VendorInvoiceDetails.vendorRemitAddress.streetAddressTwo : null,
                    "city": angular.isDefined($scope.VendorInvoiceDetails.vendorRemitAddress) && $scope.VendorInvoiceDetails.vendorRemitAddress != null ? $scope.VendorInvoiceDetails.vendorRemitAddress.city : null,
                    "state": {
                        "id": angular.isDefined($scope.VendorInvoiceDetails.vendorRemitAddress) && $scope.VendorInvoiceDetails.vendorRemitAddress != null ? $scope.VendorInvoiceDetails.vendorRemitAddress.state.id : null
                    },
                    "zipcode": angular.isDefined($scope.VendorInvoiceDetails.vendorRemitAddress) && $scope.VendorInvoiceDetails.vendorRemitAddress != null ? $scope.VendorInvoiceDetails.vendorRemitAddress.zipcode : null
                },
                "billingAddress": {
                    "streetAddressOne": $scope.VendorInvoiceDetails.billingAddress.streetAddressOne,
                    "streetAddressTwo": $scope.VendorInvoiceDetails.billingAddress.streetAddressTwo,
                    "city": $scope.VendorInvoiceDetails.billingAddress.city,
                    "state": {
                        "id": $scope.VendorInvoiceDetails.billingAddress.state.id
                    },
                    "zipcode": $scope.VendorInvoiceDetails.billingAddress.zipcode
                },
                "shippingAddress": {
                    "streetAddressOne": $scope.VendorInvoiceDetails.shippingAddress.streetAddressOne,
                    "streetAddressTwo": $scope.VendorInvoiceDetails.shippingAddress.streetAddressTwo,
                    "city": $scope.VendorInvoiceDetails.shippingAddress.city,
                    "state": {
                        "id": $scope.VendorInvoiceDetails.shippingAddress.state.id
                    },
                    "zipcode": $scope.VendorInvoiceDetails.shippingAddress.zipcode
                },
                "paymentTerm": {
                    "id": $scope.VendorInvoiceDetails.invoiceDetails.paymentTrem
                },
                "materialCharges": materialCharges,
                "laborCharges": laborCharges               
            }]
        }));

        //Adding File details
        if ($scope.InvoiceList.length > 0) {
            var filesDetails = [];
            angular.forEach($scope.InvoiceList, function (item) {
              
                filesDetails.push({
                    "fileName": item.FileName, "fileType": item.FileType, "extension": item.FileExtension,
                    "filePurpose": "SERVICE_REQUEST_INVOICE"
                });
                
            });
         
            paramInvoice.append("filesDetails", JSON.stringify(filesDetails));

            angular.forEach($scope.InvoiceList, function (item) {
                paramInvoice.append("file", item.File)
            });
        }
        else {
            paramInvoice.append("file",null);
            paramInvoice.append("filesDetails", null);
        }
        var AddInvoice = CreateServiceInvoiceService.SaveServiceInvoiceDetails(paramInvoice);
        AddInvoice.then(function (success) {
            toastr.remove();
            toastr.success(success.data.message, "Confirmation");
            $scope.GoBack();
        }, function (error) {
            toastr.remove();
            toastr.error(error.data.errorMessage, "Error");
        });
    }

    $scope.GoBack = GoBack;
    function GoBack() {       
        if (sessionStorage.getItem("DetailsPageURL")==="ThirdParty")
        {
            $location.url('ThirdPartyServiceRequestEdit');
        }
        if (sessionStorage.getItem("DetailsPageURL")==="Associate"){
            $location.url('AssociateServiceRequestEdit'); 
        }
    }

    $scope.GoToClaimDetails = GoToClaimDetails;
    function GoToClaimDetails()
    {
        if (sessionStorage.getItem("DetailsPageURL") === "ThirdParty") {
            $location.url('ThirdPartyClaimDetails');
        }
        if (sessionStorage.getItem("DetailsPageURL") === "Associate") {
            $location.url('VendorAssociateClaimDetails');
        }
    }
    $scope.goToDashboard = goToDashboard;
    function goToDashboard() {
        if (sessionStorage.getItem("DetailsPageURL") === "ThirdParty") {
            $location.url('ThirdPartyVendorDashboard');
        }
        if (sessionStorage.getItem("DetailsPageURL") === "Associate") {
            $location.url('VendorAssociateDashboard');
        }
    }
   
    //Handle laboyr chagres and its UI
  
    $scope.LabourCharges = [{ "description": '', "costPerHour": '', "workedHour": '', "totalCost": '' }];
   
    $scope.MaterialCharges = [{ "description": '', "unitCost": '', "unit": '', "totalCost": '' }];
   
    $scope.AddLabourAndMaterial = AddLabourAndMaterial;
    function AddLabourAndMaterial(list, objType)
    {
        if (objType==='Material')
            $scope.MaterialCharges.push({ "description": '', "unitCost": '', "unit": '', "totalCost": '' });
        if (objType === 'Labour')
            $scope.LabourCharges.push({ "description": '', "costPerHour": '', "workedHour": '', "totalCost": '' });
    }
    $scope.RemoveLabourAndMaterial = RemoveLabourAndMaterial;
    function RemoveLabourAndMaterial(list, index)
    {
        list.splice(index, 1);
        ClaculateInvoiceAmount();
    }

   $scope.CalculateMaterialCost = CalculateMaterialCost;
   function CalculateMaterialCost(index) {
       if ($scope.MaterialCharges[index].unit > 0 && $scope.MaterialCharges[index].unitCost > 0)
           $scope.MaterialCharges[index].totalCost = (parseFloat($scope.MaterialCharges[index].unit) * parseFloat($scope.MaterialCharges[index].unitCost)).toFixed(2);
       ClaculateInvoiceAmount();
   }
   $scope.CalculateLabourCost = CalculateLabourCost;
   function CalculateLabourCost(index) {
       if ($scope.LabourCharges[index].costPerHour > 0 && $scope.LabourCharges[index].workedHour > 0)
           $scope.LabourCharges[index].totalCost = (parseFloat($scope.LabourCharges[index].costPerHour) * parseFloat($scope.LabourCharges[index].workedHour)).toFixed(2);
       ClaculateInvoiceAmount();
   };

   $scope.ClaculateInvoiceAmount = ClaculateInvoiceAmount;
   function ClaculateInvoiceAmount() {
       var total = 0;
       angular.forEach($scope.MaterialCharges, function (value) {
           if (value.totalCost != null && value.totalCost != "" && angular.isDefined(value.totalCost))
                total += parseInt(value.totalCost);
       });
       angular.forEach($scope.LabourCharges, function (value) {
           if (value.totalCost!= null && value.totalCost != "" && angular.isDefined(value.totalCost))
               total += parseInt(value.totalCost);
       });
       $scope.VendorInvoiceDetails.invoiceDetails.invoiceAmount = total

   };
   $scope.GetInvoiceDueDate = GetInvoiceDueDate;
   function GetInvoiceDueDate() {    
    
       var termName = null
       angular.forEach($scope.PaymenttermsList, function (term) {
           if (term.id == $scope.VendorInvoiceDetails.invoiceDetails.paymentTrem) {
               termName = term.name
           }

       });

       if (termName != null) {
           if (termName == "PAY 30") {


               $scope.VendorInvoiceDetails.invoiceDetails.dueDate = getDateForDueDate("PAY 30");
           }
           else if (termName == "PAY 60") {
               $scope.VendorInvoiceDetails.invoiceDetails.dueDate = getDateForDueDate("PAY 60");
           }
           else if (termName == "PAY 90") {
               $scope.VendorInvoiceDetails.invoiceDetails.dueDate = getDateForDueDate("PAY 90");
           }
       }
   };

    function getDateForDueDate( term)
    {
        date = $filter('TodaysDate')();
        var result = new Date(date);
        if (term == "PAY 30") {
            result.setDate(result.getDate() + 30);
        }
        else if (term == "PAY 60") {
            result.setDate(result.getDate() + 60);
        }
        else if (term == "PAY 90") {
            result.setDate(result.getDate() + 90);
        }
        var dd = result.getDate();
        var mm = result.getMonth() + 1; //January is 0!
        var yyyy = result.getFullYear();

        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        var today = mm + '/' + dd + '/' + yyyy;
        return today
    }
});