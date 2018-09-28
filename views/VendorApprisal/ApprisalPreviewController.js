angular.module('MetronicApp').controller('ApprisalPreviewController', function ($rootScope, $filter, $uibModal, $scope, $translate, $translatePartialLoader,  objClaim) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });
    //$translatePartialLoader.addPart('AdjusterPropertyClaimDetails');
    //$translate.refresh();

    var AllData = objClaim;
    
    $scope.appraisalValue = AllData.appraisalValue;
    $scope.Appraisal = { "Description": "" };
    $scope.attachmentList=[];
    angular.forEach(AllData.attachmentList, function (file) {
        $scope.attachmentList.push(file);
    });
    $scope.editAttachmentList = [];
    angular.forEach(AllData.editAttachmentList, function (file) {
        $scope.editAttachmentList.push(file);
    });
    if (AllData.isReplacement == true)
    {
        $scope.Appraisal.Description = AllData.replacementDescription;
    }
    else
        $scope.Appraisal.Description = AllData.Description;
          //(angular.isDefined(AllData.selectedGender.gender)?AllData.selectedGender.gender:"") + " " + (AllData.SelectedCustom.customType == "Yes" ? "custom " : "") +
          //  (angular.isDefined(AllData.selectedMetal.type)?AllData.selectedMetal.type:"") + " "
          //  +(angular.isDefined(AllData.metalcolor.metalColor)?AllData.metalcolor.metalColor:"") + " " + (angular.isDefined(AllData.jewellarytype.type)?AllData.jewellarytype.type:"") + " " +
          //  ((angular.isDefined(AllData.lengthInInches) && AllData.lengthInInches != "") ? AllData.lengthInInches + " inches " : "") +
          //((angular.isDefined(AllData.WaightInGrams) && AllData.WaightInGrams != "") ? AllData.WaightInGrams + " " + "grams" : "")
          //  + "\n Center Stone:(1) " +
          //  ((angular.isDefined(AllData.shapes.name) && AllData.shapes.name != "") ? AllData.shapes.name + ", " : "") +
          // ((angular.isDefined(AllData.measurement1) && AllData.measurement1 != "") ? AllData.measurement1 + " X " : "") +
          //((angular.isDefined(AllData.measurement2) && AllData.measurement2 != "") ? AllData.measurement2 + " X " : "") +
          // ((angular.isDefined(AllData.measurement3) && AllData.measurement3 != "") ? AllData.measurement3 + "mm, " : "") +
          //((angular.isDefined(AllData.WaightInCarats) && AllData.WaightInCarats != "") ? AllData.WaightInCarats + " carats, " : "") +
          //  ((angular.isDefined(AllData.color1.name) && AllData.color1.name != "") ? AllData.color1.name + ", " : "") +
          //  ((angular.isDefined(AllData.Clarity1.name) && AllData.Clarity1.name != "") ? AllData.Clarity1.name + ", " : "")
          // + ((angular.isDefined(AllData.GIA) && AllData.GIA != "") ? "GIA #" + AllData.GIA : "") +
          //  "\n Side Stones:\n  " +
          // ((angular.isDefined(AllData.Quntity1) && AllData.Quntity1 != "") ? "Side Stones " + AllData.Quntity1 + ", " : "") +
          //   ((angular.isDefined(AllData.shp.name) && AllData.shp.name != "") ? AllData.shp.name + ", " : "") +
          //  ((angular.isDefined(AllData.WeightCTW) && AllData.WeightCTW != "") ? AllData.WeightCTW + "carat total weight, " : "") +
          //   ((angular.isDefined(AllData.color2.name) && AllData.color2.name != "") ? AllData.color2.name + ", " : "") +
          //  ((angular.isDefined(AllData.Clarity2.name) && AllData.Clarity2.name != "") ? AllData.Clarity2.name + " Clarity," : "") +
          //  "\n  " +
          //  ((angular.isDefined(AllData.Quantity) && AllData.Quantity != "") ? "Side Stones:" + AllData.Quantity + ", " : "") +
          // ((angular.isDefined(AllData.shapes1.name) && AllData.shapes1.name != "") ? AllData.shapes1.name + ", " : "") +
          //  ((angular.isDefined(AllData.weightctw1) && AllData.weightctw1 != "") ? AllData.weightctw1 + "carat total weight, " : "") +
          // ((angular.isDefined(AllData.color3.name) && AllData.color3.name != "") ? AllData.color3.name + ", " : "") +
          //  ((angular.isDefined(AllData.Clarity3.name) && AllData.Clarity3.name != "") ? AllData.Clarity3.name + " clarity" : "")
           

    if (AllData.policyholderDetails != null) {
        $scope.PoDetails =
        {
            Id: AllData.policyholderDetails.policyHolder.policyHolderId,
            Name: (angular.isDefined(AllData.policyholderDetails.policyHolder.lastName) ? AllData.policyholderDetails.policyHolder.lastName : "") + ", " + (angular.isDefined(AllData.policyholderDetails.policyHolder.firstName) ? AllData.policyholderDetails.policyHolder.firstName : ""),
            CellPhone: AllData.policyholderDetails.policyHolder.cellPhone,
            Description: ""
        }
    }
    
    $scope.URLDetails;
    $scope.ok = ok;
    function ok() {
        var param = {
            "claim": {
                "id": AllData.claim.id
            },
            "item": {
                "id": AllData.item.id
            },
            "vendorAssociate": {
                "id": sessionStorage.getItem("UserId")
            }
        };
        var sendData = VendorAssociateItemDetailsService.sendDataToPolicyholder(param);
        sendData.then(function (success) {
            $scope.URLDetails = success.data.data;
            $scope.SendSMSToPH()
        }, function (error) {
            toastr.remove()
            toastr.error(error.data.errorMessage, $translate.instant("ErrorHeading"));
            $(".page-spinner-bar").addClass("hide");
        });
    };


    //$scope.SendSMSToPH = SendSMSToPH;
    //function SendSMSToPH() {
    //    var param = {
    //        "mobileNumber": $scope.PoDetails.CellPhone,
    //        "messageContents": $scope.PoDetails.Description + " " + $scope.URLDetails.url,
    //        "claim": {
    //            "id": AllData.claim.id
    //        },
    //        "item": {
    //            "id": AllData.item.id
    //        },
    //        "policyHolder": {
    //            "id": $scope.PoDetails.Id
    //        },
    //        "vendorAssociate": {
    //            "id": sessionStorage.getItem("UserId")
    //        }
    //    };
    //    var sendSMS = VendorAssociateItemDetailsService.sendSMSToPolicyholder(param);
    //    sendSMS.then(function (success) {
    //        $(".page-spinner-bar").addClass("hide");
    //        toastr.remove()
    //        toastr.success(success.data.message, "Confirmation");
    //        $scope.$close();
    //    }, function (error) {
    //        toastr.remove()
    //        toastr.error(error.data.errorMessage, "Error");
    //        $(".page-spinner-bar").addClass("hide");
    //    });
    //};

    $scope.cancel = function () {
        $scope.$close();
    }

    $scope.date = new Date();
  
});
