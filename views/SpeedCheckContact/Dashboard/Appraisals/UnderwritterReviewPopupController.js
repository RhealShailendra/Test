angular.module('MetronicApp').controller('UnderwritterReviewPopupController', function ($rootScope,$filter,$location, AdjusterPropertyClaimDetailsService, $uibModal, $scope, $translate, $translatePartialLoader,
    AuthHeaderService, UnderWriterReviewService, AppraisalService, appraisalData) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });
    //set language 
    $translatePartialLoader.addPart('UnderwritterReview');
    $translate.refresh();
   
    //Ok 
    $scope.ok = function (e) {     
        var appraisalId = sessionStorage.getItem("appraisalId");
                
                console.log(appraisalData);
                               
                //comparable                 
                var ComparableList = [];
                angular.forEach(appraisalData.AddedComparables, function (item) {
                    if (item.id === null) {
                        ComparableList.push({
                            "id": item.id,
                            "originalItemId": appraisalData.ItemDetails.id,
                            "isvendorItem": item.isvendorItem,
                            "description": item.description,
                            "itemName": appraisalData.ItemDetails.itemName,
                            "unitPrice": item.price,
                            "taxRate": null,
                            "brand": item.brand,
                            "model": item.model,
                            "supplier": item.supplier,
                            "itemType": appraisalData.ItemDetails.itemType,
                            "isReplacementItem": (appraisalData.ItemDetails.isReplacementItem) ? appraisalData.ItemDetails.isReplacementItem : false,
                            "buyURL": item.buyURL,
                            "isDataImage": item.isDataImage,
                            "imageData": (item.isDataImage) ? item.imageURL : null,
                            "imageURL": (!item.isDataImage) ? item.imageURL : null,
                            "delete": false
                        });
                    }
                });
                
                if (appraisalData.Comparables !== null && angular.isDefined(appraisalData.Comparables)) {
                    if (appraisalData.Comparables.comparableItems !== null) {
                        angular.forEach(appraisalData.Comparables.comparableItems, function (item) {
                            item.delete=false;
                            ComparableList.push(item);                            
                        });
                    }
                }
                angular.forEach(appraisalData.DeletedComparables, function (item) {
                    item.delete = true;
                    ComparableList.push(item);
                });             
            //end comparable

            // var policyNum = sessionStorage.getItem("policyNumber");
            // var createdBy = sessionStorage.getItem("UserId");
            console.log(appraisalData.Appraisal);
            var mountingDetails = {
                "id": appraisalData.Appraisal.Mounting.id,
                "metalWeight": appraisalData.Appraisal.Mounting.MetalWeight.weight,
                "metalUnitWeight": appraisalData.Appraisal.Mounting.MetalWeight.MetalUnit,
                "length": appraisalData.Appraisal.Mounting.MetalLength,
                "width": appraisalData.Appraisal.Mounting.MetalWidth,
                //check
                "metalUnitWeight": appraisalData.Appraisal.Mounting.MetalWeight.MetalUnit,
                "metalColor": appraisalData.Appraisal.Mounting.MetalColor,
                "typeOfMetal": appraisalData.Appraisal.Mounting.MetalType
            };
            var diamondDetails = appraisalData.diamondItems;
            var stoneDetails = appraisalData.gemstoneItems;
            var appraisalDocuments = appraisalData.attachmentList;
            //console.log(appraisalData.Appraisal.AppraisalDate);
            var details = {
                "id": sessionStorage.getItem("id"),
                "appraisalNumber": sessionStorage.getItem("appraisalNumber"),
                "original_appraisal_description": appraisalData.Appraisal.OriginalDescription,
                //"createdDate": $filter('date')(new Date("08/23/2018"), 'MM/dd/yyyy'),
                "createdDate": ((appraisalData.Appraisal.AppraisalDate !== null && angular.isDefined(appraisalData.Appraisal.AppraisalDate)) ? $filter('DatabaseDateFormatMMddyyyy')(appraisalData.Appraisal.AppraisalDate) : null),

                "appraisalOldValue": appraisalData.Appraisal.AppraisalValue,
                "policyNumber": sessionStorage.getItem("policyNumber"),
                "createdBy": sessionStorage.getItem("createdBy"),

                "gender": appraisalData.Appraisal.Gender,

                "isCustom": appraisalData.Appraisal.Custom,
                "designer": appraisalData.Appraisal.Designer,
                "itemCategory": appraisalData.Appraisal.ItemCategory,
                "type": appraisalData.Appraisal.ItemType,

                "mountingDetails": mountingDetails,
                "stoneDetails": stoneDetails,
                "diamondDetails": diamondDetails,
                "appraisalId" : appraisalData.Appraisal.appraisalId,
                
                "comparableItems":ComparableList,
                
                "speedCheckUserName":sessionStorage.getItem("Name"),

                 //speedcheck values
                 "sc_salvageValue": appraisalData.sc_salvageValue,
                 "sc_jwelersCost": appraisalData.sc_jwelersCost,
                 "sc_artigemReplacementValue": appraisalData.sc_artigemReplacementValue,
                 "sc_insuranceReplacementValue": appraisalData.sc_insuranceReplacementValue,
                 "sc_retailValue": appraisalData.sc_retailValue,
                 "sc_totalMountingPrice":appraisalData.sc_totalMountingPrice,
                 "sc_totalDiamondPrice": appraisalData.sc_totalDiamondPrice,
                 "sc_totalGemStonePrice": appraisalData.sc_totalGemStonePrice,
                 "sc_labourCost": appraisalData.sc_labourCost,
                 "insurancePremiumCost": appraisalData.insurancePremiumCost,
                 "sc_finalEstimate": appraisalData.sc_finalEstimate,
                 "speedcheckAppraisalDate": appraisalData.speedcheckAppraisalDate,
                 "comparablesUpdatedDate" : appraisalData.comparablesUpdatedDate
            };
            //"appraisalDocuments":appraisalDocuments
            $scope.details = details;


            var data = new FormData();
            angular.forEach(appraisalData.attachmentList, function (ItemFile) {
                //data.append('filesDetails', JSON.stringify([{ "fileName": ItemFile.FileName, "fileType": ItemFile.FileType, "extension": ItemFile.FileExtension, "filePurpose": "ITEM_APPRAISAL", "latitude": 41.403528, "longitude": 2.173944 }]));
                data.append('file', ItemFile.File);

            });

          data.append("details", angular.toJson(details));
          data.append("userType", "UNDERWRITER");
          console.log(data);
          var promis = AppraisalService.UpdateAppraisal(data);
          promis.then(function (success) {
              toastr.remove();
              toastr.success("The appraisal was submitted to Underwriter for approval", "Success");
              $location.path('/OpenAssignments');
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
     // console.log("UnderWritter Review");
      $scope.$close();
  }
  //Cancel
  $scope.cancel = function () {
      $scope.$close();
  };


});
