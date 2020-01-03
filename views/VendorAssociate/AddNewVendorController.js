angular.module('MetronicApp').controller('AddNewVendorController', function ($rootScope, VendorAssociateClaimDetailsService, $uibModal, $scope, settings, 
    $location,$filter, $translate, $filter, $translatePartialLoader, AuthHeaderService, ddlParticipantTypeList) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });
    
    $translatePartialLoader.addPart('AdjustorAddNewVendor');
    $translate.refresh();
    $scope.ErrorMessage = "";
    $scope.cancel = function () {
        $scope.$close();
    };
    $scope.ok = function () {
        $scope.$close();
    };
    $scope.ContactDeatils = [{ id: null, email: '', firstName: '', lastName: '', phoneNumber: '' }];
    $scope.counter = 0;
    $scope.PhoneNumbers = [{ Type: '', PhoneNo: '' }];
    $scope.phonecounter = 0;
    $scope.ddlParticipantTypeList = [];
    $scope.ddlStateList = [];
    $scope.existingVendorSearchResult = [];
    $scope.InternalEmployeeSearchResult = [];
    $scope.SelectedExistingVendors = null;
    $scope.SelectedInternalEmployees = null;

    $scope.ErrorMessage = "";
    $scope.commObj =
       {
           ParticipantType: "Select",
           ExistingVendorText: '',
           InternalText: '',
           ExternalText: '',
           ShippingState: '',
           BillingState: '',
           ExternalPartState: '',
           ClaimNumber:sessionStorage.getItem("VendorAssociateClaimNo"),
           ClaimId: sessionStorage.getItem("VendorAssociateClaimId")

       }
    $scope.ExternalParticipant = {
        FirstName: '',
        LastName: '',
        PhoneNo: '',
        Email: '',
        ResonForInclusion: '',
        AddressLine1: '',
        AddressLine2: '',
        City: '',
        ZipCode: ''
    }

    $scope.IsPermanent = false;
    $scope.NewVendor = {};

    $scope.displayNewVendor = false;
    $scope.displayInternalParticipant = false;
    $scope.displayExistingVendor = false;
    $scope.displayExternalParticipant = false;
    $scope.displayAddVendorBtn = false;
    $scope.displayAddParticipantBtn = true;
    $scope.displaySearchExistingResult = false;
    $scope.displaySearchInternalResult = false;
    $scope.ShowExistingVendorError = false;
    $scope.IsExistingVendorSelected = false;
    $scope.ActiveAddBtn = true;//making add participant btn disabled for validation

    $scope.AddContactPerson = function (index, contact) {
        $scope.ContactDeatils.push({ id: null, email: '', firstName: '', lastName: '', phoneNumber: '' });
    };

    $scope.RemoveContactPerson = function (index, contact) {
        $scope.ContactDeatils.splice(index, 1);
    };
    $scope.RemovePhone = function (index) {
        $scope.PhoneNumbers.splice(index, 1)
    };

    $scope.AddPhone = function () {
        $scope.PhoneNumbers.push({ Type: '', PhoneNo: '' });
    };


    //selecting participants based on selection of dropdown
    $scope.selectParticipant = function () {
        $scope.ResetNewVendor();
        $scope.ClearExistingVendorResult();
        $scope.ClearInternalEmployeeResult();
        $scope.ClearExternalParticipant();

        if ($scope.commObj.ParticipantType == "Select") {
            $scope.displayNewVendor = false;
            $scope.displayInternalParticipant = false;
            $scope.displayExistingVendor = false;
            $scope.displayExternalParticipant = false;
            $scope.displayAddVendorBtn = false;
            $scope.displayAddParticipantBtn = true;
            $scope.ActiveAddBtn = true;

        }
        else if ($scope.commObj.ParticipantType == "INTERNAL") {
            $scope.displayNewVendor = false;
            $scope.displayInternalParticipant = true;
            $scope.displayExistingVendor = false;
            $scope.displayExternalParticipant = false;
            $scope.displayAddVendorBtn = false;
            $scope.displayAddParticipantBtn = true;
            $scope.ActiveAddBtn = true;

        }
        else if ($scope.commObj.ParticipantType == "EXTERNAL") {
            $scope.displayNewVendor = false;
            $scope.displayInternalParticipant = false;
            $scope.displayExistingVendor = false;
            $scope.displayExternalParticipant = true;
            $scope.displayAddVendorBtn = false;
            $scope.displayAddParticipantBtn = false;
            $scope.ActiveAddBtn = true;

        }
        else if ($scope.commObj.ParticipantType == "EXISTING VENDOR") {
            $scope.displayNewVendor = false;
            $scope.displayInternalParticipant = false;
            $scope.displayExistingVendor = true;
            $scope.displayExternalParticipant = false;
            $scope.displayAddVendorBtn = false;
            $scope.displayAddParticipantBtn = true;
            $scope.ActiveAddBtn = true;

        }
        else if ($scope.commObj.ParticipantType == "NEW VENDOR") {
            $scope.displayNewVendor = true;
            $scope.displayInternalParticipant = false;
            $scope.displayExistingVendor = false;
            $scope.displayExternalParticipant = false;
            $scope.displayAddVendorBtn = true;
            $scope.displayAddParticipantBtn = false;
            $scope.ActiveAddBtn = true;

        }

        else {
            $scope.displayNewVendor = false;
            $scope.displayInternalParticipant = false;
            $scope.displayExistingVendor = false;
            $scope.displayExternalParticipant = false;
            $scope.displayAddVendorBtn = false;
            $scope.displayAddParticipantBtn = true;
            $scope.ActiveAddBtn = true;

        }

    }


    function init() {
        $scope.ddlParticipantTypeList = ddlParticipantTypeList;
        //Allowing to add only "internal participants"- hence removing other participnt types from participants list 
        $scope.ddlParticipantTypeList = $filter('filter')($scope.ddlParticipantTypeList, "INTERNAL");
        GetStateList();
    };
    init();

    $scope.GetStateList =GetStateList;
    function GetStateList() {
        $(".page-spinner-bar").removeClass("hide");
        var stateparam = {
            "isTaxRate": false,
            "isTimeZone": false
        };
        var StateList = VendorAssociateClaimDetailsService.getStates(stateparam)
        StateList.then(function (success) {
            $scope.ddlStateList = success.data.data;
            $(".page-spinner-bar").addClass("hide");
        }, function (error) {
            $(".page-spinner-bar").addClass("hide");
            toastr.remove();
            toastr.error((angular.isDefined(error.data) && angular.isDefined(error.data.errorMessage) ? error.data.errorMessage : AuthHeaderService.genericErrorMessage()), "Error")
        });
    };

    //search existing vendor
    //$scope.searchExistingVendor = function () {
    //    var param = {
    //        "searchString": $scope.commObj.ExistingVendorText
    //    };
    //    var getResult = VendorAssociateClaimDetailsService.searchExistingEmployee(param)
    //    getResult.then(function (success) {

    //        $scope.existingVendorSearchResult = success.data.data;
    //        $scope.displaySearchExistingResult = true;

    //    }, function (error) {
    //        toastr.remove();
    //        toastr.error(error.data.errorMessage, "Error");
    //    });

    //}

    //search internal employee
    $scope.searchInternalEmployee = function () {
        $(".page-spinner-bar").removeClass("hide");
        if ($scope.commObj.InternalText.length) {
            var param = {
                "searchString": $scope.commObj.InternalText,
                "companyId": sessionStorage.getItem("VendorId").toString()
            };
            var getResult = VendorAssociateClaimDetailsService.searchInternalEmployee(param)
            getResult.then(function (success) {
                $(".page-spinner-bar").addClass("hide");
                $scope.InternalEmployeeSearchResult = success.data.data;
                $scope.displaySearchInternalResult = true;

            }, function (error) {
                $(".page-spinner-bar").addClass("hide");
                toastr.remove();
                toastr.error((angular.isDefined(error.data) && angular.isDefined(error.data.errorMessage) ? error.data.errorMessage : AuthHeaderService.genericErrorMessage()), "Error")
            });
        }
    };

    $scope.selectInternalEmployee = function (employee) {
        angular.forEach($scope.InternalEmployeeSearchResult, function (obj) {
            if (employee.id != obj.id) {
                obj.IsSelected = false;
                $scope.ActiveAddBtn = true;
            }
        })
        if (employee.id != null) {
            if ($scope.SelectedInternalEmployees === employee.id) {
                $scope.SelectedInternalEmployees = null;
            }
            else {
                $scope.SelectedInternalEmployees = employee.id;
                $scope.ShowInternalEmployeeError = false;
                $scope.ActiveAddBtn = false;
            }
        }
    };

    $scope.selectExistingVendor = function (vendor, index) {
        angular.forEach($scope.existingVendorSearchResult, function (obj) {
            if (vendor.vendorId != obj.vendorId) {
                obj.Selected = false;
                $scope.ActiveAddBtn = true;
            }
        });

        if (vendor.vendorId != null) {
            if ($scope.SelectedExistingVendors === vendor.vendorId) {
                $scope.SelectedExistingVendors = null;
            }
            else {
                $scope.SelectedExistingVendors = vendor.vendorId;
                $scope.ShowExistingVendorError = false;
                $scope.ActiveAddBtn = false;
            }
        }
    };

    //clear result
    $scope.ClearExistingVendorResult = ClearExistingVendorResult;
    function ClearExistingVendorResult() {
        $scope.commObj.ExistingVendorText = '';
        $scope.existingVendorSearchResult = [];
        $scope.SelectedExistingVendors = null;
        $scope.displaySearchExistingResult = false;
        $scope.ShowExistingVendorError = false;
    };

    $scope.ClearInternalEmployeeResult = ClearInternalEmployeeResult;
    function ClearInternalEmployeeResult() {
        $scope.commObj.InternalText = '';
        $scope.InternalEmployeeSearchResult = [];
        $scope.SelectedInternalEmployees = null;
        $scope.displaySearchInternalResult = false;
        $scope.ShowInternalEmployeeError = false;
    };

    //adding participant to system
    $scope.AddParticipantToClaim = function () {
        if ($scope.commObj.ParticipantType == "EXTERNAL") {
            $scope.AddExternalParticipant();
        }
        else if ($scope.commObj.ParticipantType == "EXISTING VENDOR") {
            if ($scope.SelectedExistingVendors == null) {
                $scope.ShowExistingVendorError = true;
            }
            else {

                $scope.AddExistingVendorAgainstClaim();
            }
        }
        else if ($scope.commObj.ParticipantType == "INTERNAL") {
            if ($scope.SelectedInternalEmployees == null) {
                $scope.ShowInternalEmployeeError = true;
            }
            else {
                $scope.AddInternalEmployeeAgainstClaim();
            }
        }
    };

    $scope.AddExternalParticipant = AddExternalParticipant;
    function AddExternalParticipant() {
        $scope.StateName = '';
        $scope.SelectedState = $filter('filter')($scope.ddlStateList, { id: $scope.commObj.ExternalPartState });
        angular.forEach($scope.SelectedState, function (obj) { $scope.StateName = obj.state });
        var param ={
                "claimNumber": sessionStorage.getItem("ThirdPartyClaimNo"),
                "firstName": $scope.ExternalParticipant.FirstName,
                "lastName": $scope.ExternalParticipant.LastName,
                "phoneNumber": $scope.ExternalParticipant.PhoneNo,
                "email": $scope.ExternalParticipant.Email,
                "reasonForInclusion": $scope.ExternalParticipant.ResonForInclusion,
                "address": {
                    "streetAddressOne": $scope.ExternalParticipant.AddressLine1,
                    "streetAddressTwo": $scope.ExternalParticipant.AddressLine2,
                    "city": $scope.ExternalParticipant.City,
                    "state": {
                        "id": $scope.commObj.ExternalPartState,
                        "state": $scope.StateName
                    },
                    "zipcode": $scope.ExternalParticipant.ZipCode
                }
            };

        var addExternalParticipant = VendorAssociateClaimDetailsService.addExternalParticipant(param);
        addExternalParticipant.then(function (success) {
            $scope.Status = success.data.status;
            if ($scope.Status == 200) {
                toastr.remove();
                toastr.success(success.data.message, "Confirmation");
            }            
        }, function (error) {
            
        });

    }

    $scope.ClearExternalParticipant = ClearExternalParticipant;
    function ClearExternalParticipant() {
        $scope.ExternalParticipant = {}; //clear data
    }

    $scope.AddExistingVendorAgainstClaim = AddExistingVendorAgainstClaim;
    function AddExistingVendorAgainstClaim() {
        var param = {
            "claimId": sessionStorage.getItem("VendorAssociateClaimId").toString(),
            "assignedUserId": $scope.SelectedExistingVendors,
            "claimStatusId": 2
        };
        var addExistingVendor = VendorAssociateClaimDetailsService.assignClaim(param);
        addExistingVendor.then(function (success) {

            $scope.Status = success.data.status;
            if ($scope.Status == 200) {
                toastr.remove();
                toastr.success(success.data.message, "Confirmation");
                $scope.ClearExistingVendorResult(); //clear data
            }
            else if ($scope.Status == 400) {

            }
        }, function (error) {
            toastr.remove();
            toastr.error(error.data.errorMessage, "Error");
        });

    }

    $scope.AddInternalEmployeeAgainstClaim = AddInternalEmployeeAgainstClaim;
    function AddInternalEmployeeAgainstClaim() {
        $(".page-spinner-bar").removeClass("hide");
        var param = {
            "claimId": sessionStorage.getItem("VendorAssociateClaimId").toString(),
            "assignedUserId": $scope.SelectedInternalEmployees,
            "claimStatusId": 2
        };
        var addInternalEmployee = VendorAssociateClaimDetailsService.assignClaim(param);
        addInternalEmployee.then(function (success) {
            $scope.Status = success.data.status;
            $(".page-spinner-bar").addClass("hide");
            if ($scope.Status == 200) {
                toastr.remove();
                toastr.success(success.data.message, "Confirmation");
                $scope.ClearInternalEmployeeResult(); //clear data
            }
        }, function (error) {
            $(".page-spinner-bar").addClass("hide");
            toastr.remove();
            toastr.error((angular.isDefined(error.data) && angular.isDefined(error.data.errorMessage) ? error.data.errorMessage : AuthHeaderService.genericErrorMessage()), "Error")
        });
    };

    $scope.AssignClaimToVendor = AssignClaimToVendor;
    function AssignClaimToVendor(VendorId) {       
        var param = {
            "vendorId": VendorId,
            "claims": [{ "id": $scope.commObj.ClaimId }]
        };
        var addVendorToClaim = VendorAssociateClaimDetailsService.AddParticipantAgainstClaim(param);
        addVendorToClaim.then(function (success) {
            $scope.Status = success.data.status;           
        }, function (error) {
            toastr.remove();
            toastr.error(error.data.errorMessage, "Error");
        });

    }

    $scope.AddNewVendor = function () {
        $scope.DayTime = null;
        $scope.EveningTime = null;
        $scope.Cell = null;
        angular.forEach($scope.PhoneNumbers, function (phone) {
            if (phone.Type == "Work") {
                $scope.DayTime = phone.PhoneNo
            }
            else if (phone.Type == "Mobile") {
                $scope.EveningTime = phone.PhoneNo
            }
            else if (phone.Type == "Other") {
                $scope.Cell = phone.PhoneNo;
            }
        });
        var param = {
            "vendorId": null,
            "vendorName": $scope.NewVendor.SupplierName,
            "address": {
                "id": null,
                "streetAddressOne": null,
                "streetAddressTwo": null,
                "city": null,
                "state": {
                    "id": null
                },
                "zipcode": null
            },
            "billingAddress": {
                "id": null,
                "streetAddressOne": $scope.NewVendor.BillingAddressLine1,
                "streetAddressTwo": $scope.NewVendor.BillingAddressLine2,
                "city": $scope.NewVendor.BillingCity,
                "state": {
                    "id": $scope.commObj.BillingState
                },
                "zipcode": $scope.NewVendor.BillingZipCode
            },
            "shippingAddress": {
                "id": null,
                "streetAddressOne": $scope.NewVendor.ShippingAddressLine1,
                "streetAddressTwo": $scope.NewVendor.ShippingAddressLine2,
                "city": $scope.NewVendor.ShippingCity,
                "state": {
                    "id": $scope.commObj.ShippingState
                },
                "zipcode": $scope.NewVendor.ShippingZipCode
            },
            "contactPersons": $scope.ContactDeatils,
            "dayTimePhone": $scope.DayTime,
            "eveningTimePhone": $scope.EveningTime,
            "cellPhone": $scope.Cell,
            "isActive": true,
            "isTemporary": $scope.IsPermanent === true ? false : true,
            "website": $scope.NewVendor.Website
        }


        var addNewVendor = VendorAssociateClaimDetailsService.addVendor(param);
        addNewVendor.then(function (success) {
            $scope.Status = success.data.status;
            if ($scope.Status == 200) {
                toastr.remove();
                toastr.success(success.data.message, "Confirmation");
                $scope.AssignClaimToVendor(success.data.data.vendorId);//assigning newly added vendor against claim
                $scope.ResetNewVendor();//clear data
            }
            else if ($scope.Status == 400) {

            }
        }, function (error) {
            toastr.remove();
            toastr.error(error.data.errorMessage, "Error");
        });


    }

    $scope.ResetNewVendor = ResetNewVendor;
    function ResetNewVendor() {
        $scope.NewVendor = {};
        $scope.ContactDeatils = [{ id: null, email: '', firstName: '', lastName: '' }];
        $scope.PhoneNumbers = [{ Type: '', PhoneNo: '' }];
        $scope.IsPermanent = false;
        $scope.commObj.BillingState = "";
        $scope.commObj.ShippingState = "";
    }

    //making vendor permanent/temprary
    $scope.MakePermanent = function () {
        $scope.IsPermanent = !$scope.IsPermanent;
    };
});