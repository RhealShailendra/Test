angular.module('MetronicApp').controller('VendorApprisalController', function ($rootScope, $scope, settings, $location, $translate, $translatePartialLoader, $window,
$filter, AuthHeaderService, VendorApprisalService, $uibModal) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });

    //set language
    $translatePartialLoader.addPart('VendorApprisal');
    $translate.refresh();
    $scope.PageSize = settings.pagesize;
    $scope.UserType = sessionStorage.getItem("RoleList");
    $scope.UserName = sessionStorage.getItem("UserLastName") + ", " + sessionStorage.getItem("UserFirstName")
    $scope.ApprisalOrderAddEdit = false;
    $scope.ApprisalList = [];
    $scope.MyLength;
    $scope.Desc = { "description": "" }

    $scope.genderList = [];
    $scope.Custom = [];
    $scope.appraisals = [];
    $scope.Metal = [];
    $scope.MetalColor = [];
    $scope.JewellaryType = [];
    $scope.shape = [];
    $scope.color = [];
    $scope.attachmentList = [];
    $scope.attachmentEditList = [];
    $scope.clarity = [];
    $scope.typeofAppraisal = [];
    $scope.isReplacement = false;
    $scope.showAttachmentErro = false;
    $scope.Appraisal =
        {
            "selectedGender": "",
            "SelectedCustom": "",
            "selectedMetal": "",
            "metalcolor": "",
            "jewellarytype": "",
            "lengthInInches": "",
            "WaightInGrams": "",
            "shapes": "",
            "measurement1": "",
            "measurement2": "",
            "measurement3": "",
            "WaightInCarats": "",
            "color1": "",
            "Clarity1": "",
            "GIA": "",
            "Quantity": "",
            "shp": "",
            "WeightCTW": "",
            "color2": "",
            "Clarity2": "",
            "Quantity1": "",
            "shapes": "",
            "weightctw1": "",
            "color3": "",
            "Clarity3": "",
            "shapes1": ""
        };
    $scope.Desc.description = "";
    $scope.init = init;
    function init() {
        //$scope.isReplacement = false;
        $scope.date = new Date();
        var appraisalNumber = sessionStorage.getItem("appraisalNumber");
        if (angular.isDefined(appraisalNumber) && appraisalNumber != null) {
            GotoDetails(appraisalNumber)
        } else {
            $scope.Appraisal.replacementDescription = $scope.ItemDetails.adjusterDescription;
            GetAppraisalList();
            GetPolicyHolderDetails();
        }
    }
    init();

    //Service to get the appraisal list against line item by vendor contact person or vendor associate
    $scope.GetAppraisalList = GetAppraisalList;
    function GetAppraisalList() {
        $scope.appraisals = [];
        $(".page-spinner-bar").removeClass("hide");
        var param = {
            "itemUID": $scope.CommonObj.ItemUID
        };
        var promis = VendorApprisalService.getAppraisalList(param);
        promis.then(function (success) {
            angular.forEach(success.data.data, function (value) {
                $scope.appraisals.push(value);
            })
            $(".page-spinner-bar").addClass("hide");
        });
    }

    //to get the appraisal details 
    $scope.GetAppraisalDetails = GetAppraisalDetails;
    function GetAppraisalDetails(appraisalNumber) {
        $(".page-spinner-bar").removeClass("hide");
        var param = {
            "appraisalNumber": appraisalNumber
        }
        var promis = VendorApprisalService.getAppraisalDetails(param);
        promis.then(function (success) {
            var result = success.data.data;
            $scope.Appraisal =
       {
           "appraisalNumber": result.appraisalNumber,
           "selectedGender": angular.isDefined(result.gender) ? result.gender : null,
           "SelectedCustom": result.customType,
           "selectedMetal": result.metalType,
           "metalcolor": result.metalColor,
           "jewellarytype": result.jewelryType,
           "lengthInInches": result.length,
           "WaightInGrams": result.metalWeight,
           "shapes": result.centerStoneShape,
           "measurement1": result.measurement,
           "measurement2": result.measurement,
           "measurement3": result.measurement,
           "WaightInCarats": result.centerStoneWeight,
           "color1": result.centerStoneColor,
           "Clarity1": result.centerStoneClarity,
           "GIA": result.giaCerticicate,
           "Quantity": result.sideStoneQuantity,
           "shp": result.sideStoneShape,
           "WeightCTW": result.sideStoneWeight,
           "color2": result.sideStoneColor,
           "Clarity2": result.sideStoneClarity,
           "Quantity1": result.additionalSideStoneQuantity,
           "shapes1": result.additionalSideStoneShape,
           "weightctw1": result.additionalSideStoneWeight,
           "color3": result.additionalSideStoneColor,
           "Clarity3": result.additionalSideStoneClarity,
           "TypeofAppraisal": result.appraisalType,
           "appraisalValue": result.dollarAmount
       };
            // GenerateDescription();
            angular.forEach(result.attachments, function (value) {
                $scope.attachmentEditList.push(value);
            });
            $scope.isReplacement = result.isReplacementDescription;
            $scope.Desc.description = result.description;
            $scope.Appraisal.replacementDescription = result.lineItem.adjusterDescription
            $(".page-spinner-bar").addClass("hide");
        },
        function (error) {
            toastr.remove();
            if (error.data.errorMessage != null && angular.isDefined(error.data.errorMessage)) {
                toastr.error(error.data.errorMessage, "Error")
            }
            else {
                toastr.error(AuthHeaderService.genericErrorMessage(), "Error")
            }
            $(".page-spinner-bar").addClass("hide");
        });
    }

    $scope.DeleteAppraisalDetails = DeleteAppraisalDetails;
    function DeleteAppraisalDetails(appraisalNumber) {
        var msg = "";
        if (angular.isDefined(appraisalNumber)) {
            msg = "Are you sure want to delete Appraisal# " + appraisalNumber + "?";
        }
        else {
            msg = "Are you sure want to delete this Appraisal?";
            appraisalNumber = $scope.Appraisal.appraisalNumber;
        }


        bootbox.confirm({
            size: "",
            title: "Delete Company Branch",
            message: msg, closeButton: false,
            className: "modalcustom", buttons: {
                confirm: {
                    label: "Yes",
                    className: 'btn-success'
                },
                cancel: {
                    label: "No", //$translate.instant('ClaimDetails_Delete.BtnNo'),
                    className: 'btn-danger'
                }
            },
            callback: function (result) {
                if (result) {
                    if (angular.isDefined(appraisalNumber) && appraisalNumber !== null) {
                        var param = {
                            "appraisalNumber": appraisalNumber
                        }
                        var promis = VendorApprisalService.deleteAppraisal(param);
                        promis.then(function (success) {
                            toastr.remove()
                            toastr.success(success.data.message);
                            $scope.Appraisal = {};
                            $scope.Desc.description = "";
                            $scope.ApprisalOrderAddEdit = false;
                            $scope.IsEditOrder = false;
                            GetAppraisalList();
                            $(".page-spinner-bar").addClass("hide");
                        },
                        function (error) {
                            toastr.remove();
                            if (error.data.errorMessage != null && angular.isDefined(error.data.errorMessage)) {
                                toastr.error(error.data.errorMessage, "Error")
                            }
                            else {
                                toastr.error(AuthHeaderService.genericErrorMessage(), "Error")
                            }
                        });

                    };
                }
            }
        });

    }

    //get Policy HolderDetails
    $scope.GetPolicyHolderDetails = GetPolicyHolderDetails;
    function GetPolicyHolderDetails() {
        $(".page-spinner-bar").removeClass("hide");
        param_PolicyHolder =
            {
                "policyNumber": null,
                "claimNumber": $scope.CommonObj.ClaimNumber
            };

        var getDetails = VendorApprisalService.GetPolicyHolderDetails(param_PolicyHolder);
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
    //get the gender list for appraisal
    $scope.GetGenderList = GetGenderList;
    function GetGenderList() {
        var promis = VendorApprisalService.getgenderList();
        promis.then(function (success) {
            $scope.genderList = [];
            angular.forEach(success.data.data, function (value) {
                $scope.genderList.push(value);
            })
        })
    }

    $scope.GetAppraisalTypeList = GetAppraisalTypeList;
    function GetAppraisalTypeList() {
        var promis = VendorApprisalService.getAppraisalTypeList();
        promis.then(function (success) {
            $scope.typeofAppraisal = [];
            angular.forEach(success.data.data, function (value) {

                $scope.typeofAppraisal.push(value);
            })
        })
    }
    $scope.GetCustomTypeList = GetCustomTypeList;
    function GetCustomTypeList() {
        var promis = VendorApprisalService.getCustomTypeList();
        promis.then(function (success) {
            $scope.Custom = [];
            angular.forEach(success.data.data, function (value) {
                $scope.Custom.push(value);
            })
        })
    }
    $scope.GetMetalList = GetMetalList;
    function GetMetalList() {
        var promis = VendorApprisalService.getMetalList();
        promis.then(function (success) {
            $scope.Metal = [];
            angular.forEach(success.data.data, function (value) {
                $scope.Metal.push(value);
            })
        })
    }
    $scope.GetMetaColor = GetMetaColor;
    function GetMetaColor() {
        var promis = VendorApprisalService.getMetaColorList();
        promis.then(function (success) {
            $scope.MetalColor = [];
            angular.forEach(success.data.data, function (value) {
                $scope.MetalColor.push(value);
            })
        })
    }
    $scope.GetjewelleryTypeList = GetjewelleryTypeList;
    function GetjewelleryTypeList() {
        var promis = VendorApprisalService.getjewelleryTypeList();
        promis.then(function (success) {
            $scope.JewellaryType = [];
            angular.forEach(success.data.data, function (value) {
                $scope.JewellaryType.push(value);
            })
        })
    }
    $scope.GetStoneShapeList = GetStoneShapeList;
    function GetStoneShapeList() {
        var promis = VendorApprisalService.getStoneShapeList();
        promis.then(function (success) {
            $scope.shape = [];
            angular.forEach(success.data.data, function (value) {
                $scope.shape.push(value);
            })
        })
    }
    $scope.GetStoneColorList = GetStoneColorList;
    function GetStoneColorList() {
        var promis = VendorApprisalService.getStoneColorList();
        promis.then(function (success) {
            $scope.color = [];
            angular.forEach(success.data.data, function (value) {
                $scope.color.push(value);
            })
        })
    }
    $scope.GetStoneclarityList = GetStoneclarityList;
    function GetStoneclarityList() {
        var promis = VendorApprisalService.getStoneclarityList();
        promis.then(function (success) {
            $scope.clarity = [];
            angular.forEach(success.data.data, function (value) {
                $scope.clarity.push(value);
            })
        })
    }
    $scope.IntialiseComponent = IntialiseComponent;
    function IntialiseComponent() {
        $scope.ApprisalOrderAddEdit = false;
        SetInitialApprisalDetails();
    };
    $scope.SetInitialApprisalDetails = SetInitialApprisalDetails;
    function SetInitialApprisalDetails() {
    }
    //File Upload for attachment
    $scope.AddAttachment = function () {
        angular.element('#FileUpload1').trigger('click');
    }
    $scope.displayAddImageButton = false;
    $scope.getAttachmentDetails = function (e) {
        $scope.$apply(function () {
            if (e.files.length <= 4) {
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
                    $scope.showAttachmentErro = false;
                }
            }
            else {
                $scope.showAttachmentErro = true;
            }
        });
    };
    $scope.LoadFileInList = function (e) {
        $scope.$apply(function () {
            if ($scope.attachmentList.length < 4) {
                $scope.attachmentList.push(
               {
                   "FileName": e.target.fileName, "FileExtension": e.target.fileExtension, "FileType": e.target.fileType,
                   "Image": e.target.result, "File": e.target.file
               })
            }
            else {
                $scope.showAttachmentErro = true;
            }
        });
    }

    $scope.RemoveAttachment = RemoveAttachment;
    function RemoveAttachment(index) {
        if ($scope.attachmentList.length > 0) {
            $scope.attachmentList.splice(index, 1);
        }
    };
    //End File Upload 
    $scope.NewApprisal = NewApprisal;
    function NewApprisal() {
        $scope.Appraisal = {};
        $scope.Appraisal.replacementDescription = $scope.ItemDetails.adjusterDescription;
        $scope.Desc.description = "";
        $scope.ApprisalOrderAddEdit = true;
        $scope.IsEditOrder = false;
        $scope.attachmentList = [];
        $scope.attachmentEditList = [];
        //dropDown Apis
        GetGenderList();
        GetAppraisalTypeList();
        GetCustomTypeList();
        GetMetalList();
        GetMetaColor();
        GetjewelleryTypeList();
        GetStoneShapeList();
        GetStoneColorList();
        GetStoneclarityList();
    }

    $scope.btnCancel = btnCancel;
    function btnCancel() {
        var appraisalNumber = sessionStorage.getItem("appraisalNumber");// appraisalNumber set on the globalsearch page 
        if (angular.isDefined(appraisalNumber) && appraisalNumber != null) {
            $location.url('AdjusterGlobalSearch');
        } else {
            this.ApprisalForm.$setUntouched();
            $scope.Appraisal = {};
            $scope.Desc.description = "";
            $scope.attachmentList = [];
            angular.element("input[type='file']").val(null);
            $scope.ApprisalOrderAddEdit = false;
            $scope.IsEditOrder = false;
        }
    }

    $scope.GotoDetails = GotoDetails;
    function GotoDetails(appraisalNumber) {
        GetAppraisalDetails(appraisalNumber);
        $scope.ApprisalOrderAddEdit = true;
        $scope.IsEditOrder = true;
        //dropDown Apis
        GetGenderList();
        GetAppraisalTypeList();
        GetCustomTypeList();
        GetMetalList();
        GetMetaColor();
        GetjewelleryTypeList();
        GetStoneShapeList();
        GetStoneColorList();
        GetStoneclarityList();
    }

    $scope.DeleteAppraisal = DeleteAppraisal;
    function DeleteAppraisal(item) {
        DeleteAppraisalDetails(item.appraisalNumber);
    }
    //Strat of Preview
    $scope.ApprisalPreivew = ApprisalPreivew;
    function ApprisalPreivew($event) {
        {
            var obj = {
                "Description": $scope.Desc.description,
                "policyholderDetails": $scope.PolicyholderDetails,
                "isReplacement": $scope.isReplacement,
                "replacementDescription": $scope.Appraisal.replacementDescription,
                //"claim": {
                //    "id": $scope.ItemDetails.claimId
                //},
                //"item": {
                //    "id": $scope.ItemDetails.id
                //},
                //"selectedGender": $scope.Appraisal.selectedGender,
                //"SelectedCustom": $scope.Appraisal.SelectedCustom,
                //"selectedMetal": $scope.Appraisal.selectedMetal,
                //"metalcolor": $scope.Appraisal.metalcolor,
                //"jewellarytype": $scope.Appraisal.jewellarytype,
                //"lengthInInches": $scope.Appraisal.lengthInInches,
                //"WaightInGrams": $scope.Appraisal.WaightInGrams,
                //"shapes": $scope.Appraisal.shapes,
                //"measurement1": $scope.Appraisal.measurement1,
                //"measurement2": $scope.Appraisal.measurement2,
                //"measurement3": $scope.Appraisal.measurement3,
                //"WaightInCarats": $scope.Appraisal.WaightInCarats,
                //"color1": $scope.Appraisal.color1,
                //"Clarity1": $scope.Appraisal.Clarity1,
                //"GIA": $scope.Appraisal.GIA,
                //"Quantity": $scope.Appraisal.Quntity1,
                //"shp": $scope.Appraisal.shp,
                //"WeightCTW": $scope.Appraisal.WeightCTW,
                //"color2": $scope.Appraisal.color2,
                //"Clarity2": $scope.Appraisal.Clarity2,
                //"Quantity1": $scope.Appraisal.Quantity1,
                //"shapes1": $scope.Appraisal.shapes1,
                //"weightctw1": $scope.Appraisal.weightctw1,
                //"color3": $scope.Appraisal.color3,
                //"Clarity3": $scope.Appraisal.Clarity3,
                //"attachmentList": $scope.attachmentList,
                "appraisalValue": $scope.Appraisal.appraisalValue,
                "attachmentList": $scope.attachmentList,
                "editAttachmentList":$scope.attachmentEditList
            };
            var out = $uibModal.open(
             {
                 animation: $scope.animationsEnabled,
                 templateUrl: "views/VendorApprisal/ApprisalPreview.html",
                 controller: "ApprisalPreviewController",
                 resolve: {
                     objClaim: function () {
                         objClaim = obj;
                         return objClaim;
                     }
                 }

             });
            out.result.then(function (value) {

            }, function (res) {
                //Call Back Function close
            });
            return {
                open: open
            };
        };
    }
    //End of Preview 

    //Start of generate description
    $scope.GenerateDescription = GenerateDescription;
    function GenerateDescription() {
        $scope.Desc.description =
              (angular.isDefined($scope.Appraisal.selectedGender) && $scope.Appraisal.selectedGender != null ? $scope.Appraisal.selectedGender.gender : "") + " " +
              (angular.isDefined($scope.Appraisal.SelectedCustom) && $scope.Appraisal.SelectedCustom != null ? ($scope.Appraisal.SelectedCustom.customType == "Yes" ? "custom " : "") : "") +
           (angular.isDefined($scope.Appraisal.selectedMetal) && $scope.Appraisal.selectedMetal != null ? $scope.Appraisal.selectedMetal.type : "") + " "
            + (angular.isDefined($scope.Appraisal.metalcolor) && $scope.Appraisal.metalcolor != null ? $scope.Appraisal.metalcolor.metalColor : "") + " " +
            (angular.isDefined($scope.Appraisal.jewellarytype) && $scope.Appraisal.jewellarytype != null ? $scope.Appraisal.jewellarytype.type : "") + " " +
            ((angular.isDefined($scope.Appraisal.lengthInInches) && $scope.Appraisal.lengthInInches != "" && $scope.Appraisal.lengthInInches != null) ? $scope.Appraisal.lengthInInches + " inches " : "") +
          ((angular.isDefined($scope.Appraisal.WaightInGrams) && $scope.Appraisal.WaightInGrams != null && $scope.Appraisal.WaightInGrams != "") ? $scope.Appraisal.WaightInGrams + " " + "grams" : "")
            + "\n Center Stone:(1) " +
            ((angular.isDefined($scope.Appraisal.shapes) && $scope.Appraisal.shapes != null) ? $scope.Appraisal.shapes.name + ", " : "") +
           ((angular.isDefined($scope.Appraisal.measurement1) && $scope.Appraisal.measurement1 != null && $scope.Appraisal.measurement1 != "") ? $scope.Appraisal.measurement1 + " X " : "") +
          ((angular.isDefined($scope.Appraisal.measurement2) && $scope.Appraisal.measurement2 != null && $scope.Appraisal.measurement2 != "") ? $scope.Appraisal.measurement2 + " X " : "") +
           ((angular.isDefined($scope.Appraisal.measurement3) && $scope.Appraisal.measurement3 != null && $scope.Appraisal.measurement3 != "") ? $scope.Appraisal.measurement3 + "mm, " : "") +
          ((angular.isDefined($scope.Appraisal.WaightInCarats) && $scope.Appraisal.WaightInCarats != null && $scope.Appraisal.WaightInCarats != "") ? $scope.Appraisal.WaightInCarats + " carats, " : "") +
            ((angular.isDefined($scope.Appraisal.color1) && $scope.Appraisal.color1 != null) ? $scope.Appraisal.color1.name + ", " : "") +
            ((angular.isDefined($scope.Appraisal.Clarity1) && $scope.Appraisal.Clarity1 != null) ? $scope.Appraisal.Clarity1.name != "" ? $scope.Appraisal.Clarity1.name + ", " : "" : "")
           + ((angular.isDefined($scope.Appraisal.GIA) && $scope.Appraisal.GIA != null && $scope.Appraisal.GIA != "") ? "GIA # " + $scope.Appraisal.GIA : "") +
            "\n Side Stones:\n  " +
           ((angular.isDefined($scope.Appraisal.Quntity1) && $scope.Appraisal.Quntity1 != "" && $scope.Appraisal.Quntity1 != null) ? "Side Stones " + $scope.Appraisal.Quntity1 + ", " : "") +
             (angular.isDefined($scope.Appraisal.shp) && $scope.Appraisal.shp != null ? ($scope.Appraisal.shp.name != "" ? $scope.Appraisal.shp.name + ", " : "") : "") +
            ((angular.isDefined($scope.Appraisal.WeightCTW) && $scope.Appraisal.WeightCTW != null && $scope.Appraisal.WeightCTW != "") ? $scope.Appraisal.WeightCTW + " carat total weight, " : "") +
             (angular.isDefined($scope.Appraisal.color2) && $scope.Appraisal.color2 != null ? ($scope.Appraisal.color2.name != "" ? $scope.Appraisal.color2.name + ", " : "") : "") +
            ((angular.isDefined($scope.Appraisal.Clarity2) && $scope.Appraisal.Clarity2 != null) ? ($scope.Appraisal.Clarity2.name != "" ? $scope.Appraisal.Clarity2.name + " Clarity," : "") : "") +
            "\n  " +
            ((angular.isDefined($scope.Appraisal.Quantity) && $scope.Appraisal.Quantity != null && $scope.Appraisal.Quantity != "") ? "Side Stones:" + $scope.Appraisal.Quantity + ", " : "") +
           ((angular.isDefined($scope.Appraisal.shapes1) && $scope.Appraisal.shapes1 != null) ? ($scope.Appraisal.shapes1.name != "" ? $scope.Appraisal.shapes1.name + ", " : "") : "") +
            ((angular.isDefined($scope.Appraisal.weightctw1) && $scope.Appraisal.weightctw1 != null && $scope.Appraisal.weightctw1 != "") ? $scope.Appraisal.weightctw1 + " carat total weight, " : "") +
           ((angular.isDefined($scope.Appraisal.color3) && $scope.Appraisal.color3 != null) ? ($scope.Appraisal.color3.name != "" ? $scope.Appraisal.color3.name + ", " : "") : "") +
            ((angular.isDefined($scope.Appraisal.Clarity3) && $scope.Appraisal.Clarity3 != null) ? ($scope.Appraisal.Clarity3.name != "" ? $scope.Appraisal.Clarity3.name + " clarity" : "") : "")
    }
    //end of generate description

    $scope.saveApprisalOrder = saveApprisalOrder;
    function saveApprisalOrder() {
        $(".page-spinner-bar").removeClass("hide");
        var param = new FormData();
        var FileDetails = [];
        angular.forEach($scope.attachmentList, function (ItemFile) {
            FileDetails.push({ "fileName": ItemFile.FileName, "fileType": ItemFile.FileType, "extension": ItemFile.FileExtension, "filePurpose": "ITEM_APPRAISAL", "latitude": 41.403528, "longitude": 2.173944 });
            param.append('file', ItemFile.File);

        });
        if ($scope.attachmentList.length == 0 || $scope.attachmentList == null) {
            param.append('filesDetails', null);
            param.append('file', null);
        }
        else {
            param.append('filesDetails', JSON.stringify(FileDetails));
        }

        param.append("appraisalDetails", JSON.stringify(
           {
               "appraisalNumber": angular.isDefined($scope.Appraisal.appraisalNumber) ? $scope.Appraisal.appraisalNumber : null,
               "gender": {
                   "id": ((angular.isDefined($scope.Appraisal.selectedGender) && $scope.Appraisal.selectedGender != null) ? $scope.Appraisal.selectedGender.id : null)
               },
               "description": $scope.Desc.description,
               "isReplacementDescription": $scope.isReplacement,
               "customType": {
                   "id": (angular.isDefined($scope.Appraisal.SelectedCustom) && $scope.Appraisal.SelectedCustom != null) ? $scope.Appraisal.SelectedCustom.id : null
               },
               "metalType": {
                   "id": (angular.isDefined($scope.Appraisal.selectedMetal) && $scope.Appraisal.selectedMetal != null) ? $scope.Appraisal.selectedMetal.id : null
               },
               "metalColor": {
                   "id": ((angular.isDefined($scope.Appraisal.metalcolor) && $scope.Appraisal.metalcolor != null) ? $scope.Appraisal.metalcolor.id : null)
               },
               "jewelryType": {
                   "id": (angular.isDefined($scope.Appraisal.jewellarytype) && $scope.Appraisal.jewellarytype != null) ? $scope.Appraisal.jewellarytype.id : null
               },
               "length": angular.isDefined($scope.Appraisal.lengthInInches) ? $scope.Appraisal.lengthInInches : null,
               "metalWeight": angular.isDefined($scope.Appraisal.WaightInGrams) ? $scope.Appraisal.WaightInGrams : null,
               "centerStoneShape": {
                   "id": angular.isDefined($scope.Appraisal.shapes) && $scope.Appraisal.shapes != null ? $scope.Appraisal.shapes.id : null
               },
               "measurement": angular.isDefined($scope.Appraisal.measurement1) ? $scope.Appraisal.measurement1 : null,
               "centerStoneWeight": angular.isDefined($scope.Appraisal.WaightInCarats) ? $scope.Appraisal.WaightInCarats : null,
               "centerStoneColor": {
                   "id": (angular.isDefined($scope.Appraisal.color1) && $scope.Appraisal.color1 != null) ? $scope.Appraisal.color1.id : null
               },
               "centerStoneClarity": {
                   "id": angular.isDefined($scope.Appraisal.Clarity1) && $scope.Appraisal.Clarity1 != null ? $scope.Appraisal.Clarity1.id : null
               },
               "giaCerticicate": angular.isDefined($scope.Appraisal) ? $scope.Appraisal.GIA : null,
               "sideStoneQuantity": (angular.isDefined($scope.Appraisal.Quantity1) ? $scope.Appraisal.Quantity1 : null),
               "sideStoneShape": {
                   "id": (angular.isDefined($scope.Appraisal.shp) && $scope.Appraisal.shp != null ? $scope.Appraisal.shp.id : null)
               },
               "sideStoneWeight": (angular.isDefined($scope.Appraisal.WeightCTW) ? $scope.Appraisal.WeightCTW : null),
               "sideStoneColor": {
                   "id": (angular.isDefined($scope.Appraisal.color2) && $scope.Appraisal.color2 != null ? $scope.Appraisal.color2.id : null)
               },
               "sideStoneClarity": {
                   "id": (angular.isDefined($scope.Appraisal.Clarity2) && $scope.Appraisal.Clarity2 != null ? $scope.Appraisal.Clarity2.id : null)
               },
               "additionalSideStoneQuantity": angular.isDefined($scope.Appraisal.Quantity) ? $scope.Appraisal.Quantity : null,
               "additionalSideStoneShape": {
                   "id": (angular.isDefined($scope.Appraisal.shapes1) && $scope.Appraisal.shapes1 != null ? $scope.Appraisal.shapes1.id : null)
               },
               "additionalSideStoneWeight": (angular.isDefined($scope.Appraisal.weightctw1) ? $scope.Appraisal.weightctw1 : null),
               "additionalSideStoneColor": {
                   "id": (angular.isDefined($scope.Appraisal.color3) && $scope.Appraisal.color3 != null ? $scope.Appraisal.color3.id : null)
               },
               "additionalSideStoneClarity": {
                   "id": (angular.isDefined($scope.Appraisal.Clarity3) && $scope.Appraisal.Clarity3 != null ? $scope.Appraisal.Clarity3.id : null)
               },
               "appraisalType": {
                   "id": (angular.isDefined($scope.Appraisal.TypeofAppraisal) && $scope.Appraisal.TypeofAppraisal != null ? $scope.Appraisal.TypeofAppraisal.id : null)
               },
               "policyHolder": {
                   "email": (angular.isDefined($scope.PolicyholderDetails.policyHolder) && $scope.PolicyholderDetails.policyHolder != null ? $scope.PolicyholderDetails.policyHolder.email : null)
               },
               "dollarAmount": (angular.isDefined($scope.Appraisal.appraisalValue) ? $scope.Appraisal.appraisalValue : null),
               "lineItem": {
                   "itemUID": (angular.isDefined($scope.CommonObj.ItemUID) ? $scope.CommonObj.ItemUID : null),
               }
           }));

        var promis = VendorApprisalService.addAppraisal(param);
        promis.then(function (success) {
            toastr.remove()
            toastr.success(success.data.message);
            GetAppraisalList();
            $scope.ApprisalOrderAddEdit = false;
            $scope.IsEditOrder = false;
            $scope.attachmentList = [];
            $scope.attachmentEditList = [];
            angular.element("input[type='file']").val(null);
            $(".page-spinner-bar").addClass("hide");
        }, function (error) {
            toastr.remove();
            $(".page-spinner-bar").addClass("hide");
            if (error.data.errorMessage != null && angular.isDefined(error.data.errorMessage)) {
                toastr.error(error.data.errorMessage, "Error")
            }
            else {
                toastr.error(AuthHeaderService.genericErrorMessage(), "Error")

            }

        });

    }

    $scope.setGender = setGender;
    function setGender() {
        angular.forEach($scope.genderList, function (value) {
            if (value.id == $scope.Appraisal.selectedGender.id) {
                $scope.Appraisal.selectedGender.id = value.id;
                $scope.Appraisal.selectedGender.gender = value.gender;
            }
        });
    }

    $scope.setCustom = setCustom;
    function setCustom() {
        angular.forEach($scope.Custom, function (value) {
            if (value.id == $scope.Appraisal.SelectedCustom.id) {

                $scope.Appraisal.SelectedCustom.id = value.id;
                $scope.Appraisal.SelectedCustom.customType = value.customType;
            }
        });
    }

    $scope.setMetal = setMetal;
    function setMetal() {
        angular.forEach($scope.Metal, function (value) {
            if (value.id == $scope.Appraisal.selectedMetal.id) {
                $scope.Appraisal.selectedMetal.id = value.id;
                $scope.Appraisal.selectedMetal.type = value.name;
            }
        });
    }

    $scope.setMetalcolor = setMetalcolor;
    function setMetalcolor() {
        angular.forEach($scope.MetalColor, function (value) {
            if (value.id == $scope.Appraisal.metalcolor.id) {
                $scope.Appraisal.metalcolor.id = value.id;
                $scope.Appraisal.metalcolor.metalColor = value.name;
            }
        });
    }

    $scope.setJewellarytype = setJewellarytype;
    function setJewellarytype() {
        angular.forEach($scope.JewellaryType, function (value) {
            if (value.id == $scope.Appraisal.jewellarytype.id) {
                $scope.Appraisal.jewellarytype.id = value.id;
                $scope.Appraisal.jewellarytype.type = value.name;
            }
        });
    }

    $scope.setShapes = setShapes;
    function setShapes() {
        angular.forEach($scope.shape, function (value) {
            if (value.id == $scope.Appraisal.shapes.id) {
                $scope.Appraisal.shapes.id = value.id;
                $scope.Appraisal.shapes.name = value.name;
            }
        });
    }

    $scope.setColor1 = setColor1;
    function setColor1() {
        angular.forEach($scope.clarity, function (value) {
            if (value.id == $scope.Appraisal.color1.id) {
                $scope.Appraisal.color1.id = value.id;
                $scope.Appraisal.color1.name = value.name;
            }
        });
    }

    $scope.setClarity1 = setClarity1;
    function setClarity1() {
        angular.forEach($scope.clarity, function (value) {
            if (value.id == $scope.Appraisal.Clarity1.id) {
                $scope.Appraisal.Clarity1.id = value.id;
                $scope.Appraisal.Clarity1.name = value.name;
            }
        });
    }

    $scope.setShp = setShp;
    function setShp() {
        angular.forEach($scope.shape, function (value) {
            if (value.id == $scope.Appraisal.shp.id) {
                $scope.Appraisal.shp.id = value.id;
                $scope.Appraisal.shp.name = value.name;
            }
        });
    }

    $scope.setColor2 = setColor2;
    function setColor2() {
        angular.forEach($scope.color, function (value) {
            if (value.id == $scope.Appraisal.color2.id) {
                $scope.Appraisal.color2.id = value.id;
                $scope.Appraisal.color2.name = value.name;
            }
        });
    }

    $scope.setClarity2 = setClarity2;
    function setClarity2() {
        angular.forEach($scope.clarity, function (value) {
            if (value.id == $scope.Appraisal.Clarity2.id) {
                $scope.Appraisal.Clarity2.id = value.id;
                $scope.Appraisal.Clarity2.name = value.name;
            }
        });
    }

    $scope.setShapes1 = setShapes1;
    function setShapes1() {
        angular.forEach($scope.shape, function (value) {
            if (value.id == $scope.Appraisal.shapes1.id) {
                $scope.Appraisal.shapes1.id = value.id;
                $scope.Appraisal.shapes1.name = value.name;
            }
        });
    }

    $scope.setColor3 = setColor3;
    function setColor3() {
        angular.forEach($scope.color, function (value) {
            if (value.id == $scope.Appraisal.color3.id) {
                $scope.Appraisal.color3.id = value.id;
                $scope.Appraisal.color3.name = value.name;
            }
        });
    }

    $scope.setClarity3 = setClarity3;
    function setClarity3() {
        angular.forEach($scope.clarity, function (value) {
            if (value.id == $scope.Appraisal.Clarity3.id) {
                $scope.Appraisal.Clarity3.id = value.id;
                $scope.Appraisal.Clarity3.name = value.name;
            }
        });
    }

    $scope.setTypeofAppraisal = setTypeofAppraisal;
    function setTypeofAppraisal() {
        angular.forEach($scope.typeofAppraisal, function (value) {
            if (value.id == $scope.Appraisal.TypeofAppraisal.id) {

                $scope.Appraisal.TypeofAppraisal.id = value.id;
                $scope.Appraisal.TypeofAppraisal.type = value.type;
            }
        });
    }

    $scope.changeReplacememnt = changeReplacememnt;
    function changeReplacememnt(value) {
        $scope.isReplacement = value;
    }


    $scope.printAppraisal = printAppraisal;
    function printAppraisal() {
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
        var popupWin = window.open('', '_blank', 'width=600,height=600');
        popupWin.document.open();
        popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + printContents + '</body></html>');
        popupWin.document.close();

    }
});