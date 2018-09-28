angular.module('MetronicApp')
    .directive('ngFileModel', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var model = $parse(attrs.ngFileModel);
                var isMultiple = attrs.multiple;
                var modelSetter = model.assign;
                element.bind('change', function () {
                    var values = [];
                    angular.forEach(element[0].files, function (item) {
                        var value = {
                            // File Name
                            name: item.name,
                            //File Size
                            size: item.size,
                            //File URL to view
                            url: URL.createObjectURL(item),
                            // File Input Value
                            _file: item
                        };
                        values.push(value);
                    });
                    scope.$apply(function () {
                        if (isMultiple) {
                            modelSetter(scope, values);
                        } else {
                            modelSetter(scope, values[0]);
                        }
                    });
                });
            }
        };
    }])

    .directive('stringToNumber', function () {
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, ngModel) {
                ngModel.$parsers.push(function (value) {
                    return '' + value;
                });
                ngModel.$formatters.push(function (value) {
                    if (value == '0.0') {
                        return value = null;
                    } else {
                        return parseFloat(value, 100);
                    }
                });
            }
        };
    })

    .filter('titleCase', function () {
        return function (input) {
            input = input || '';
            return input.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
        };
    })

    .controller('AppraisalDetailsController', function ($rootScope, $scope, settings, $location, $translate, $translatePartialLoader, $window,
        $filter, AuthHeaderService, AppraisalService, $uibModal, VendorAssociateClaimDetailsService,
        VendorAssociateItemDetailsService, ThirdPartyLineItemDetailsService, PurchaseOrderService) {
        $scope.$on('$viewContentLoaded', function () {
            // initialize core components
            App.initAjax();
        });

        //set language
        $translatePartialLoader.addPart('AddAppraisal');
        $translate.refresh();
        $scope.PageSize = settings.pagesize;
        $scope.UserType = sessionStorage.getItem("RoleList");
        $scope.UserName = sessionStorage.getItem("UserLastName") + ", " + sessionStorage.getItem("UserFirstName")
        $scope.isEditAppraisal = false;
        $scope.ApprisalOrderAddEdit = true;
        $scope.ApprisalList = [];
        $scope.MyLength;
        $scope.Desc = { "description": "" }
        $scope.comparableReport = false;

        sessionStorage.setItem("comparableReport", false);

        //comparable start here

        $scope.tab = 'Contents';
        $scope.NoImagePath = $rootScope.settings.NoImagePath;
        $scope.Compairableslist;
        $scope.ItemDetails = {};

        $scope.ErrorMessage = "";
        $scope.ClaimParticipantsList = [];
        $scope.ParticipantName = "";


        $scope.Comparables = [];
        $scope.AddedComparables = [];
        //From google
        $scope.ReplacementSuplier = [];
        $scope.GoogleComparableList = [];
        //Sort options for dropdown
        $scope.SortOptions = [{ Id: false, Value: "Price-Low TO High" }, { Id: true, Value: "Price-High To Low" }];
        $scope.CustomItemType;
        //$scope.CustomItemType = [{ Id: 1, Name: "QuickAdd" }, { Id: 2, Name: "View/Build custom Item" }];
        $scope.sortcolumn = 'false';
        // Item details object and image object

        $scope.images = [];
        //Serch variables for google 
        $scope.displayEmptyPart = true;
        $scope.displaycomparables = false;
        $scope.displayReplacement = false;
        $scope.dispalyAddedComparables = false;
        $scope.statuslist = [{ id: true, status: 'Yes' }, { id: false, status: 'No' }]
        $scope.sortNote = 'createDate';
        $scope.sortNoteReverse = true;
        //Comparables
        $scope.itemTypeList = [];
        $scope.subItemList = [];
        $scope.componentsList = [];
        $scope.NextStep = true;
        $scope.PrevStep = true;
        $scope.attachmentListEdit = [];
        $scope.attachmentList = [];
        $scope.deletedAttachmentList = [];

        //comparable ends here

        var details = {};

        $scope.files = [];
        $rootScope.tempFiles = [];
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
        var stoneDetails = [];
        $scope.isDesc = false;


          //dynamic form population
          $scope.showDiamond = false;
          $scope.showGemstone = false;
          $scope.showMounting = false;
          $scope.showSpeedcheckInfo = false;


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
        $scope.AppraisalDropdowns = [];
        $scope.diamond = {};
        $scope.init = init;
        function init() {

            GetAppraisalDropdowns();
            $scope.IsEditOrder = sessionStorage.getItem("EditAppraisal") == "true";
            if ($scope.IsEditOrder) {
                $scope.isEditAppraisal = sessionStorage.getItem("isEditAppraisal") == "false";
            }
            getAppraisalDetails();
            getMappingData();
            getAssociatesList();

            $scope.submit = false;
            $scope.itemTypeList = [];
            $scope.subItemList = [];
            $scope.componentsList = [];
            $scope.AddedComparables = [];
            $scope.displayEmptyPart = true;
            $scope.displaycomparables = false;
            $scope.displayReplacement = false;
            $scope.dispalyAddedComparables = false;
            $scope.statuslist = [{ id: true, status: 'Yes' }, { id: false, status: 'No' }];



            $scope.CommonObj = {
                ClaimNumber: sessionStorage.getItem("VendorAssociateClaimNo"),
                ClaimId: sessionStorage.getItem("VendorAssociateClaimId"),
                ItemNote: "",
                SearchComparables: "",
                ItemId: sessionStorage.getItem("AssociatePostLostItemId"),
                ParticipantId: null,
                OrderType: "0",
                PolicyHolder: sessionStorage.getItem("Policyholder"),
                PurchaseClaimNumber: sessionStorage.getItem("VendorAssociateClaimNo"),
                PurchaseClaimId: sessionStorage.getItem("VendorAssociateClaimId"),
                PurchaseItemId: sessionStorage.getItem("AssociatePostLostItemId"),
                ThisPage: "ItemDetails",
                RegistrationNumber: sessionStorage.getItem("RegistrationNumber"),
                PurchaseItemNumber: null,
                ItemDescription: "",
                OrigionalItemDescription: "",
                AssignmentId: sessionStorage.getItem("AssignmentId"),
                AssignmentNumber: sessionStorage.getItem("AssignmentNumber"),
                CompanyCRN: sessionStorage.getItem("CompanyCRN")
            };



            $("#comparableReport").addClass("hide");
            // get active vendors against claim for autocomplete textbox

            //GetReplacementSupplier
            $scope.SelectedSupplier;
            var GetReplacementSuplier = VendorAssociateItemDetailsService.GetReplacementSupplier();
            GetReplacementSuplier.then(function (success) { $scope.ReplacementSuplier = success.data.data; }, function (error) { $scope.ErrorMessage = error.data.errorMessage; });

        }
        init();


        function getMappingData() {
            $scope.diamondClarityMap = {};
            $scope.cutGradeMap = {};
            $scope.metalTypeMap = {};
            $scope.metalWeightMap = {};

            var data = AppraisalService.getSpeedcheMapping();
            data.then(function (success) {
                // console.log(success.data);
                $scope.diamondClarityMap = success.data.DiamondClarities;
                $scope.cutGradeMap = success.data.CutGrades;
                $scope.metalTypeMap = success.data.MetalTypes;
                $scope.metalWeightMap = success.data.MetalWeights;
            }, function (error) {
                toastr.remove();

            });
        }

        //getAppraisalDetails
        $scope.getAppraisalDetails = getAppraisalDetails;
        function getAppraisalDetails() {
            $(".page-spinner-bar").removeClass("hide");
            $scope.IsEditOrder = true;
            var param = {
            "appraisalId" : sessionStorage.getItem("id"),
            "role" : sessionStorage.getItem('RoleList') ,
            "user" : sessionStorage.getItem('UserId')     
            }

            var details = AppraisalService.getAppraisal(param);
            details.then(function (success) {
                //comparable start
                $scope.Comparables = success.data.appraisalDataDTO;
                ComparableList = [];
                $scope.AddedComparables = [];
                $scope.DeletedComparables = [];

                $scope.CheckForAlreadyAddedComparables();

                //comparable end


                var appraisalDetails = success.data.appraisalDataDTO;

                //send values to appraisal assignment method
                $scope.AppraisalAssignment = appraisalDetails;

                // Handling of Editable and ReadOnly AppraisalDetails page based on review flags
                if(appraisalDetails.supervisorReviewStatus==1 && appraisalDetails.associateReviewStatus==1){
                    $scope.isEditAppraisal = true;
                } else {
                    $scope.isEditAppraisal = false;
                }
                                                
                sessionStorage.setItem("appraisalNumber", appraisalDetails.appraisalNumber);
                sessionStorage.setItem("createdBy", appraisalDetails.createdBy);
                sessionStorage.setItem("policyNumber", appraisalDetails.policyNumber);
                var mounting = {};
                var MetalWeight = {};

                // var MetalType = ;
                mounting.MetalType = appraisalDetails.mountingDetails.typeOfMetal;
                mounting.MetalColor = appraisalDetails.mountingDetails.metalColor;
                MetalWeight.weight = appraisalDetails.mountingDetails.metalWeight;
                MetalWeight.MetalUnit = appraisalDetails.mountingDetails.metalUnitWeight;

                mounting.MetalWeight = MetalWeight;

                mounting.MetalLength = appraisalDetails.mountingDetails.length;
                mounting.MetalWidth = appraisalDetails.mountingDetails.width;

                mounting.id = appraisalDetails.mountingDetails.id;
                $scope.diamondItems = appraisalDetails.diamondDetails;
                $scope.gemstoneItems = appraisalDetails.stoneDetails;

                $scope.diamondItems = appraisalDetails.diamondDetails;

                angular.forEach($scope.diamondItems, function (item) {
                    if (item.scDiamondEstimate == null || item.scDiamondEstimate == 0) {
                        item.scDiamondEstimate = "0.0";
                    } else {
                        var roundVal = roundOf2Decimal(item.scDiamondEstimate);
                        item.scDiamondEstimate = roundVal;
                    }
                });

                if ($scope.diamondItems.length == 0) {
                    var newItemNo = 1;
                    $scope.diamondItems.push({
                        'id': newItemNo,
                        'removeButton': false
                    });
                }

                $scope.gemstoneItems = appraisalDetails.stoneDetails;

                angular.forEach($scope.gemstoneItems, function (item) {
                    if (item.scStoneEstimate == null || item.scStoneEstimate == 0) {
                        item.scStoneEstimate = "0.0";
                    } else {
                        var roundVal = roundOf2Decimal(item.scStoneEstimate);
                        item.scStoneEstimate = roundVal;
                    }
                });

                if ($scope.gemstoneItems.length == 0) {
                    var newItemNo = 1;
                    $scope.gemstoneItems.push({
                        'id': newItemNo,
                        'removeButton': false
                    });
                }

                var AppraisalValue = roundOf2Decimal(appraisalDetails.appraisalOldValue);

                // Speedcheck Value
                var ScTotalMountingPrice = roundOf2Decimal(appraisalDetails.sc_totalMountingPrice);
                var ScTotalDiamondPrice = roundOf2Decimal(appraisalDetails.sc_totalDiamondPrice);
                var ScTotalGemStonePrice = roundOf2Decimal(appraisalDetails.sc_totalGemStonePrice);


                var labourCost = roundOf2Decimal(appraisalDetails.sc_labourCost);


                $scope.Appraisal = {
                    "OriginalDescription": appraisalDetails.original_appraisal_description,
                    "AppraisalValue": AppraisalValue == null ? "0.0" : AppraisalValue,
                    "AppraisalDate": appraisalDetails.createdDate,
                    "AppraisalDate": $filter('date')(new Date(appraisalDetails.createdDate), 'MM/dd/yyyy'),
                    "appraisalId": appraisalDetails.appraisalId,
                    "Gender": appraisalDetails.gender,
                    "Custom": appraisalDetails.isCustom,
                    "Designer": appraisalDetails.designer,
                    "ItemCategory": appraisalDetails.itemCategory,
                    "ItemType": appraisalDetails.type,
                    "Mounting": mounting,

                    "ScTotalMountingPrice": (ScTotalMountingPrice == null || ScTotalMountingPrice == 0) ? "0.0" : ScTotalMountingPrice,
                    "ScTotalDiamondPrice": (ScTotalDiamondPrice == null || ScTotalDiamondPrice == 0) ? "0.0" : ScTotalDiamondPrice,
                    "ScTotalGemStonePrice": (ScTotalGemStonePrice == null || ScTotalGemStonePrice == 0) ? "0.0" : ScTotalGemStonePrice
                }

                //speedcheck values
                var totalSalvageCost = roundOf2Decimal(appraisalDetails.sc_salvageValue);
                var totalJeweleryCost = roundOf2Decimal(appraisalDetails.sc_jwelersCost);
                var totalArtigemReplacementCost = roundOf2Decimal(appraisalDetails.sc_artigemReplacementValue);
                var totalInsuranceReplacementCost = roundOf2Decimal(appraisalDetails.sc_insuranceReplacementValue);
                var totalRetailValue = roundOf2Decimal(appraisalDetails.sc_retailValue);
                var diamondInsuranceReplacementCost = roundOf2Decimal(appraisalDetails.sc_totalDiamondPrice);
                var gemstoneArtigemReplacementCost = roundOf2Decimal(appraisalDetails.sc_totalGemStonePrice);
                //var laborCost = roundOf2Decimal(appraisalDetails.LaborCost);
                //var labourCost = roundOf2Decimal(appraisalDetails.labourCost);

                //speedcheck values

                $scope.totalSalvageCost = (totalSalvageCost == null || totalSalvageCost == 0) ? "0.0" : totalSalvageCost;
                $scope.totalJeweleryCost = (totalJeweleryCost == null || totalJeweleryCost == 0) ? "0.0" : totalJeweleryCost;
                $scope.totalArtigemReplacementCost = (totalArtigemReplacementCost == null || totalArtigemReplacementCost == 0) ? "0.0" : totalArtigemReplacementCost;
                $scope.totalInsuranceReplacementCost = (totalInsuranceReplacementCost == null || totalInsuranceReplacementCost == 0) ? "0.0" : totalInsuranceReplacementCost;
                $scope.totalRetailValue = (totalRetailValue == null || totalRetailValue == 0) ? "0.0" : totalRetailValue;
                $scope.diamondInsuranceReplacementCost = (diamondInsuranceReplacementCost == null || diamondInsuranceReplacementCost == 0) ? "0.0" : diamondInsuranceReplacementCost;
                $scope.gemstoneArtigemReplacementCost = (gemstoneArtigemReplacementCost == null || gemstoneArtigemReplacementCost == 0) ? "0.0" : gemstoneArtigemReplacementCost;
                $scope.Appraisal.labourCost = (labourCost == null || labourCost == 0) ? "0.0" : labourCost;
                $scope.Appraisal.ScTotalMountingPrice = (ScTotalMountingPrice == null || ScTotalMountingPrice == 0) ? "0.0" : ScTotalMountingPrice;

                $scope.Appraisal.scEstimateDescription = (appraisalDetails.sc_finalEstimate == null) ? " " : appraisalDetails.sc_finalEstimate; 
    
               //for dynamic population
               if(appraisalDetails.sc_totalMountingPrice!=0 || appraisalDetails.sc_labourCost != 0){
                $scope.showSpeedcheckInfo = true;
            }
            
            onChangePopulate();

                //FileExtension
                angular.forEach(appraisalDetails.attachments, function (ItemFile) {

                    var name = ItemFile.appraisalDocuments;
                    var names = name.split('_');
                    var fileType = names[1].split('.')[1];
                    var filename = names[1];
                    $scope.attachmentList.push({ "FileName": filename, "FilePath": name });

                });
                //speedcheck result field
                GeneratDescription($scope.totalInsuranceReplacementCost);
                
            }, function (error) {


            });
        }

        // Round of 2 Decimal point
        $scope.roundOf2Decimal = roundOf2Decimal;
        function roundOf2Decimal(num) {
            if (num != null) {
                return (Math.round(num * 100) / 100).toFixed(2);
            }
            return num;
        }

        $scope.roundOfValue = roundOfValue;
        function roundOfValue(event) {
            if (angular.isDefined(event.currentTarget.value)) {
                var roundVal = roundOf2Decimal(event.currentTarget.value);
                event.currentTarget.value = roundVal;
            }
        }

        //GetAppraisalDropdowns
        $scope.GetAppraisalDropdowns = GetAppraisalDropdowns;
        function GetAppraisalDropdowns() {
            $(".page-spinner-bar").removeClass("hide");
            var promis = AppraisalService.getAppraisalDropdowns();

            promis.then(function (success) {


                $scope.AppraisalDropdowns = success.data.appraisalDropdownValue;
                //console.log($scope.AppraisalDropdowns);
                for (var i = 0; i < $scope.AppraisalDropdowns.length; i++) {
                    var AppraisalDropdown = $scope.AppraisalDropdowns[i];
                    if (AppraisalDropdown.attributeName == 'GENDER') {
                        $scope.genderList = AppraisalDropdown.attributeValue;


                    }
                    else if (AppraisalDropdown.attributeName == 'CUSTOM') {

                        $scope.customList = AppraisalDropdown.attributeValue;


                    }
                    else if (AppraisalDropdown.attributeName == 'DESIGNER') {

                        $scope.designerList = AppraisalDropdown.attributeValue;

                    }
                    else if (AppraisalDropdown.attributeName == 'ITEM_CATEGORY') {

                        $scope.itemCategoryList = AppraisalDropdown.attributeValue;

                    }
                    else if (AppraisalDropdown.attributeName == 'ITEM_TYPE') {

                        $scope.itemTypeList = AppraisalDropdown.attributeValueTypes;


                    }
                    else if (AppraisalDropdown.attributeName == 'CUT_GRADE') {

                        $scope.diamondCutGradeList = AppraisalDropdown.attributeValue;

                    }
                    else if (AppraisalDropdown.attributeName == 'METAL_TYPE') {

                        $scope.metalTypeList = AppraisalDropdown.attributeValue;

                    }
                    else if (AppraisalDropdown.attributeName == 'METAL_COLOR') {

                        $scope.metalColorList = AppraisalDropdown.attributeValue;

                    }
                    else if (AppraisalDropdown.attributeName == 'METAL_WEIGHT') {

                        $scope.metalWeightList = AppraisalDropdown.attributeValue;

                    }
                    else if (AppraisalDropdown.attributeName == 'DIAMOND_SHAPE') {

                        $scope.diamondShapeList = AppraisalDropdown.attributeValue;

                    }
                    else if (AppraisalDropdown.attributeName == 'DIAMOND_COLOR') {

                        $scope.diamondColorList = AppraisalDropdown.attributeValue;

                    }
                    else if (AppraisalDropdown.attributeName == 'DIAMOND_CLARITY') {

                        $scope.diamondClarityList = AppraisalDropdown.attributeValue;

                    }
                    else if (AppraisalDropdown.attributeName == 'GEM_LAB') {

                        $scope.diamondGemlabList = AppraisalDropdown.attributeValue;

                    }
                    else if (AppraisalDropdown.attributeName == 'GEMSTONE_TYPE') {

                        $scope.gemstoneTypeList = AppraisalDropdown.attributeValue;

                    }
                    else if (AppraisalDropdown.attributeName == 'GEMSTONE_SHAPE') {

                        $scope.gemstoneShapeList = AppraisalDropdown.attributeValue;

                    }
                    else if (AppraisalDropdown.attributeName == 'GEMSTONE_QUALITY') {

                        $scope.gemstoneQualityList = AppraisalDropdown.attributeValue;

                    }
                    else if (AppraisalDropdown.attributeName == 'GEMSTONE_GRADE') {

                        $scope.gemstoneGradeList = AppraisalDropdown.attributeValue;

                    }

                }


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

        //ng-repeat Diamond and Gemstone details

        //DIAMONDS
        $scope.Appraisal.diamonds = [];
        $scope.diamondItems = [];
        // adding new diamond slabs
        $scope.diamondItems = [{
            id: '1',
            removeButton: false
        }];

        $scope.addNewDiamondItem = addNewDiamondItem;
        function addNewDiamondItem() {
            var newItemNo = $scope.diamondItems.length + 1;
            $scope.diamondItems.push({
                'id': newItemNo,
                'removeButton': true
            });
        };

        $scope.removeDiamond = removeDiamond;
        function removeDiamond() {
            var lastItem = $scope.diamondItems.length - 1;
            $scope.diamondItems.splice(lastItem);
        };

        $scope.removeThisDiamond = function (index) {
            $scope.diamondItems.splice(index, 1);
            $scope.updateDiamondBox($scope.diamondItems);
        };

        $scope.updateDiamondBox = function (diamondItems) {
            $scope.diamondItems = [];
            $scope.diamondItems = angular.copy(diamondItems);

            for (var i = 0; i < diamondItems.length; i++) {
                $scope.diamondItems[i].id = i + 1
            }

        }
        // GEMSTONES
        $scope.Appraisal.gemstones = [];
        // adding new gemstone slabs
        $scope.gemstoneItems = [{
            id: '1',
            removeButton: false
        }];

        $scope.addNewGemstone = function () {
            var newItemNo = $scope.gemstoneItems.length + 1;
            $scope.gemstoneItems.push({
                'id': newItemNo,
                'removeButton': true
            });
        };

        $scope.removeGemstone = function () {
            var lastItem = $scope.gemstoneItems - 1;
            $scope.gemstoneItems.splice(lastItem);
        };

        $scope.removeThisGemstone = function (index) {
            $scope.gemstoneItems.splice(index, 1);
            $scope.updateGemstoneBox($scope.gemstoneItems);
        };

        $scope.updateGemstoneBox = function (gemstoneItems) {
            $scope.gemstoneItems = [];
            $scope.gemstoneItems = angular.copy(gemstoneItems);

            for (var i = 0; i < gemstoneItems.length; i++) {
                $scope.gemstoneItems[i].id = i + 1
            }

        }

        //speedcheck result
        //get
        $scope.SubmitToSpeedCheck = SubmitToSpeedCheck;
        function SubmitToSpeedCheck() {
            $(".page-spinner-bar").removeClass("hide");
             //for labourcost and final speedcheck result
             $scope.showSpeedcheckInfo = true;
            var tempDropdowns = [];

            angular.forEach($scope.AppraisalDropdowns, function (Item) {

                angular.forEach(Item.attributeValue, function (subItem) {
                    tempDropdowns.push(subItem);
                });
            });


            function getByFind(id) {
                return tempDropdowns.filter(x => x.attributeValueId === id);
            }

            var speedcheckData = {};
            var diamonds = [];
            var gemstones = [];

            var unitWeightTemp;
            var metalTypeTemp;
            unitWeightTemp = getByFind($scope.Appraisal.Mounting.MetalWeight.MetalUnit.attributeValueId);
            metalTypeTemp = getByFind($scope.Appraisal.Mounting.MetalType.attributeValueId);
            var mountingDetails = {


                "metalWeight": $scope.Appraisal.Mounting.MetalWeight.weight,


                "unitOfMeasure": $scope.metalWeightMap[unitWeightTemp[0].atttibuteValue],


                "metalType": $scope.metalTypeMap[metalTypeTemp[0].atttibuteValue]
            };




            var diamondDetails = $scope.diamondItems;
            var stoneDetails = $scope.gemstoneItems;

            angular.forEach(diamondDetails, function (Item) {

                var scDiamond = {};
                var claritytemp;
                var cutGradetemp;
                var colorTemp;
                var gemLabTemp;
                var shapeTemp;
                scDiamond.diamondUID = Item.id,
                    scDiamond.caratWeight = Item.caratWeight,

                    colorTemp = getByFind(Item.color.attributeValueId)
                scDiamond.color = colorTemp[0].atttibuteValue,


                    claritytemp = getByFind(Item.clarity.attributeValueId);
                scDiamond.clarity = claritytemp[0].atttibuteValue,

                    cutGradetemp = getByFind(Item.cutGrade.attributeValueId);
                scDiamond.cutGrade = $scope.cutGradeMap[cutGradetemp[0].atttibuteValue],



                    gemLabTemp = getByFind(Item.gemlab.attributeValueId);
                scDiamond.gemlab = gemLabTemp[0].atttibuteValue,

                    shapeTemp = getByFind(Item.shape.attributeValueId)
                scDiamond.shape = shapeTemp[0].atttibuteValue,
                    scDiamond.quantity = Item.quantity

                diamonds.push(scDiamond);

            });

            angular.forEach(stoneDetails, function (Item) {

                var scStone = {};

                //attributeValueId
                var typeTemp;
                var shapeTemp;
                var qualityTemp;
                var gradeTemp;
                scStone.gemstoneUID = Item.id,

                    typeTemp = getByFind(Item.type.attributeValueId);
                scStone.type = typeTemp[0].atttibuteValue,

                    scStone.totalWeight = Item.weight,
                    scStone.quantity = Item.stoneCount,

                    shapeTemp = getByFind(Item.shape.attributeValueId);
                scStone.shape = shapeTemp[0].atttibuteValue,

                    qualityTemp = getByFind(Item.quality.attributeValueId);
                scStone.quality = qualityTemp[0].atttibuteValue,

                    gradeTemp = getByFind(Item.grade.attributeValueId);
                scStone.grade = gradeTemp[0].atttibuteValue



                gemstones.push(scStone);



            });
            speedcheckData.diamonds = diamonds;
            speedcheckData.gemstones = gemstones;
            speedcheckData.mounting = mountingDetails;

            //getSpeedcheValues
            //data.append("appraisalDocuments", JSON.stringify(appraisalDocuments[0]));
            var promis = AppraisalService.getSpeedcheValues(speedcheckData);

            promis.then(function (success) {

                var result = success.data.data;
                var tempDiamond = [];

                var scStoneDetails = result.gemstones;
                var scDiamondDetails = result.diamonds;

                var scDiamonds = scDiamondDetails.diamonds;
                var scGemstones = scStoneDetails.gemstones;
                var scMaunting = result.mounting;

                for (var i = 0; i < diamondDetails.length; i++) {

                    var diamondDetail = diamondDetails[i];
                    if (scDiamonds[i].prices != null && scDiamonds[i].prices.insuranceReplacementCost != null) {
                        diamondDetail.scDiamondEstimate = roundOf2Decimal(scDiamonds[i].prices.insuranceReplacementCost);

                    }
                    else {
                        diamondDetail.scDiamondEstimate = 0.0;
                    }


                    tempDiamond.push(diamondDetail);
                }

                diamondDetails = tempDiamond;
                $scope.diamondItems = diamondDetails;

                //totasl estimation for diamonds
                if (scDiamondDetails.diamondInsuranceReplacementCost > 0)
                    $scope.diamondInsuranceReplacementCost = roundOf2Decimal(scDiamondDetails.diamondInsuranceReplacementCost);
                else
                    $scope.diamondInsuranceReplacementCost = 0.0;
                //stone details
                var tempStoneDetail = [];
                for (var i = 0; i < stoneDetails.length; i++) {

                    var stoneDetail = stoneDetails[i];
                    if (scGemstones[i].prices != null && scGemstones[i].prices.insuranceReplacementCost != null) {
                        stoneDetail.scStoneEstimate = roundOf2Decimal(scGemstones[i].prices.insuranceReplacementCost);
                    }
                    else {
                        stoneDetail.scStoneEstimate = 0.0;
                    }


                    tempStoneDetail.push(stoneDetail);
                }
                stoneDetails = tempStoneDetail;
                $scope.gemstoneItems = stoneDetails;
                //console.log(tempDiamond);

                //total estimation for gemstone
                if (scStoneDetails.gemstoneInsuranceReplacementCost > 0)
                    $scope.gemstoneArtigemReplacementCost = roundOf2Decimal(scStoneDetails.gemstoneInsuranceReplacementCost);
                else
                    $scope.gemstoneArtigemReplacementCost = 0.0;


                //mounting estimate
                //total estimate for mounting
                if (scMaunting.prices != null && scMaunting.prices.insuranceReplacementCost > 0)
                    $scope.Appraisal.ScTotalMountingPrice = roundOf2Decimal(scMaunting.prices.insuranceReplacementCost);
                else
                    $scope.Appraisal.ScTotalMountingPrice = 0.0;

                //labour cosst
                if (result.laborCost > 0) {
                    $scope.Appraisal.labourCost = roundOf2Decimal(result.laborCost);
                }
                else {
                    $scope.Appraisal.labourCost = 0.0;
                }

                //totalSalvageCost
                if (result.totalSalvageCost > 0) {
                    $scope.totalSalvageCost = roundOf2Decimal(result.totalSalvageCost);
                }
                else {
                    $scope.totalSalvageCost = 0.0;
                }

                //totalJeweleryCost
                if (result.totalJeweleryCost > 0) {
                    $scope.totalJeweleryCost = roundOf2Decimal(result.totalJeweleryCost);
                }
                else {
                    $scope.totalJeweleryCost = 0.0;
                }
                //totalArtigemReplacementCost
                if (result.totalArtigemReplacementCost > 0) {
                    $scope.totalArtigemReplacementCost = roundOf2Decimal(result.totalArtigemReplacementCost);
                }
                else {
                    $scope.totalArtigemReplacementCost = 0.0;
                }
                //totalInsuranceReplacementCost
                if (result.totalInsuranceReplacementCost > 0) {
                    $scope.totalInsuranceReplacementCost = roundOf2Decimal(result.totalInsuranceReplacementCost);
                }
                else {
                    $scope.totalInsuranceReplacementCost = 0.0;
                }
                //totalRetailValue
                if (result.totalRetailValue > 0) {
                    $scope.totalRetailValue = roundOf2Decimal(result.totalRetailValue);
                }
                else {
                    $scope.totalRetailValue = 0.0;
                }

                $scope.speedcheckSubmitDate = new Date();

                GeneratDescription($scope.totalInsuranceReplacementCost);
                $(".page-spinner-bar").addClass("hide");
                toastr.remove();
                toastr.success("successfully fetched speedcheck values", "Success");
            }, function (error) {
                toastr.remove();
                $(".page-spinner-bar").addClass("hide");
                if (error.data.errorMessage != null && angular.isDefined(error.data.errorMessage)) {
                    toastr.error("Error fetching speedcheck values, refresh page and try again..", "Error");
                }
                else {
                   toastr.error("Error fetching speedcheck values, refresh page and try again..", "Error");
                }
            });

        }


        function GeneratDescription(insuranceReplacementCost) {

            var tempDropdowns = [];
            var tempTypeDropdowns = [];
            $scope.isDesc = true;

            angular.forEach($scope.AppraisalDropdowns, function (Item) {

                angular.forEach(Item.attributeValue, function (subItem) {
                    tempDropdowns.push(subItem);
                });
            });



            function getByFind(id) {
                var value = tempDropdowns.filter(x => x.attributeValueId === id);
                var res = value[0];
                if(res!=null){
                return res.atttibuteValue;
                }
                else{
                return "";}
            }

            //type attributeValueTypes
            angular.forEach($scope.AppraisalDropdowns, function (Item) {

                angular.forEach(Item.attributeValueTypes, function (subItem) {
                    tempTypeDropdowns.push(subItem);
                });
            });
            function getByFindType(id) {
                var value = tempTypeDropdowns.filter(x => x.attributeValueTypeId === id);
                return value[0].atttibuteType;
            }


            $scope.desc = {};

            $scope.desc.originalAppraisalValue = "Original Appraisal Value     " + $scope.Appraisal.AppraisalValue;
            $scope.desc.originalAppraisalDate = "Original Appraisal Date    " + $scope.Appraisal.AppraisalDate;

            $scope.desc.todaysDate = "Today’s Date   " + $filter('date')(new Date(), 'MM/dd/yyyy');
            $scope.desc.insuranceReplacementCost = "Insurance Replacement Value    " + insuranceReplacementCost;

            $scope.desc.gender = getByFind($scope.Appraisal.Gender.attributeValueId);
            $scope.desc.custom = getByFind($scope.Appraisal.Custom.attributeValueId) == "Yes" ? "custom" : "";
            $scope.desc.designer = getByFind($scope.Appraisal.Designer.attributeValueId) == "Yes" ? "designer brand" : "";

            $scope.desc.itemCategory = getByFind($scope.Appraisal.ItemCategory.attributeValueId);

            $scope.desc.itemType = getByFindType($scope.Appraisal.ItemType.attributeValueTypeId);

            //mounting
            $scope.desc.metalType = getByFind($scope.Appraisal.Mounting.MetalType.attributeValueId) + ", ";
            $scope.desc.metalColor = getByFind($scope.Appraisal.Mounting.MetalColor.attributeValueId);
            $scope.desc.metalWeight = $scope.Appraisal.Mounting.MetalWeight.weight;
            $scope.desc.metalWeightUnit = getByFind($scope.Appraisal.Mounting.MetalWeight.MetalUnit.attributeValueId);
            $scope.desc.metalLength = $scope.Appraisal.Mounting.MetalLength;
            $scope.desc.metalWidth = $scope.Appraisal.Mounting.MetalWidth;
            $scope.desc.diamonds = [];

            //diamond $scope.diamondItems
            angular.forEach($scope.diamondItems, function (Item) {

                var descDiamond = {};
                descDiamond.id = Item.id;
                descDiamond.quantity = Item.quantity;
                descDiamond.caratWeight = Item.caratWeight;
                descDiamond.measurement1 = Item.length + "mm X ";
                descDiamond.measurement2 = Item.width + "mm X ";
                descDiamond.measurement3 = Item.depth + "mm";

                descDiamond.shape = getByFind(Item.shape.attributeValueId) + " diamond, ";
                descDiamond.colorFrom = getByFind(Item.color.attributeValueId) + " color, ";
                descDiamond.colorTo = getByFind(Item.color.attributeValueId);
                descDiamond.clarityFrom = getByFind(Item.clarity.attributeValueId) + " to ";
                descDiamond.clarityTo = getByFind(Item.clarity.attributeValueId) + " clearity";

                descDiamond.cutGrade = getByFind(Item.cutGrade.attributeValueId);
                descDiamond.gemlab = getByFind(Item.gemlab.attributeValueId);

                $scope.desc.diamonds.push(descDiamond);

            });

            $scope.desc.gemstones = [];
            //$scope.gemstoneItems
            angular.forEach($scope.gemstoneItems, function (Item) {

                var descGemstone = {};
                descGemstone.id = "(" + Item.id + ") ";
                descGemstone.type = getByFind(Item.type.attributeValueId) + ", ";
                descGemstone.stoneCount = Item.stoneCount + " count ";
                descGemstone.weight = Item.weight + " ct, ";
                descGemstone.measurement1 = Item.length + "mm X " + Item.width + "mm X " + Item.depth + "mm, ";
                descGemstone.measurement2 = Item.width + "mm X ";
                descGemstone.measurement3 = Item.depth + "mm, ";

                descGemstone.shape = getByFind(Item.shape.attributeValueId) + ", ";
                descGemstone.quality = getByFind(Item.quality.attributeValueId);
                descGemstone.grade = getByFind(Item.grade.attributeValueId) + " Grade";

                $scope.desc.gemstones.push(descGemstone);

            });

            //console.log($scope.desc);
        }

         //onChangePopulate
         $scope.onChangePopulate = onChangePopulate;
         function onChangePopulate() {
 
             var tempTypeDropdowns = [];
             $scope.isMountingRequired = true;
             $scope.isDiamondRequired = false;
             $scope.isGemstomeRequired = false;
             $scope.moreDiamonds = true;
             $scope.moreGemstones = true;
 
 
             //get type values
             angular.forEach($scope.AppraisalDropdowns, function (Item) {
 
                 angular.forEach(Item.attributeValueTypes, function (subItem) {
                     tempTypeDropdowns.push(subItem);
                 });
             });
 
             //find type by id
             function getByFindType(id) {
                 var value = tempTypeDropdowns.filter(x => x.attributeValueTypeId === id);
                 if(value.isDefined){
                    return value[0].atttibuteType;
                    }
                    else
                    return ""; 
             }
 
             var itemCatagory = $scope.Appraisal.ItemCategory.attributeValueId;
             var itemType = $scope.Appraisal.ItemType.attributeValueTypeId;
             //ring id=7
             if (itemCatagory == 7 && (itemType != null || itemType != "undefined")) {
                 // var itemTypebyId = getByFindType(itemType);
                 if (getByFindType(itemType) == "Solitaire" || itemType == 1) {
                     $scope.isDiamondRequired = false;
                     $scope.isGemstomeRequired = false;
                     $scope.moreDiamonds = false;
                     $scope.moreGemstones = false;
                     $scope.showDiamond = true;
                     $scope.showGemstone = true;
                     $scope.showMounting = true;
 
                 }
                 else if (getByFindType(itemType) == "Bridal" || itemType == 2) {
                     $scope.isDiamondRequired = false;
                     $scope.isGemstomeRequired = false;
                     $scope.moreDiamonds = true;
                     $scope.moreGemstones = true;
 
                     $scope.showDiamond = true;
                     $scope.showGemstone = true;
                     $scope.showMounting = true;
                 }
                 else if (getByFindType(itemType) == "Band" || itemType == 3 ) {
                     $scope.isDiamondRequired = false;
                     $scope.isGemstomeRequired = false;
                     $scope.moreDiamonds = true;
                     $scope.moreGemstones = true;
 
                     $scope.showDiamond = true;
                     $scope.showGemstone = true;
                     $scope.showMounting = true;
                 }
                 else if (getByFindType(itemType) == "Fashion" || itemType == 4) {
                     $scope.isDiamondRequired = false;
                     $scope.isGemstomeRequired = false;
                     $scope.moreDiamonds = true;
                     $scope.moreGemstones = true;
 
                     $scope.showDiamond = true;
                     $scope.showGemstone = true;
                     $scope.showMounting = true;
                 }
                 else{

                    $scope.isDiamondRequired = false;
                    $scope.isGemstomeRequired = false;
                    $scope.moreDiamonds = false;
                    $scope.moreGemstones = false;

                    $scope.showDiamond = false;
                    $scope.showGemstone = false;
                    $scope.showMounting = false;
                }

 
             }
             //bracelets id=8
             if (itemCatagory == 8 && (itemType != null || itemType != "undefined")) {
 
                 if (getByFindType(itemType) == "Bangle" || itemType == 5) {
                     $scope.isDiamondRequired = false;
                     $scope.isGemstomeRequired = false;
                     $scope.moreDiamonds = true;
                     $scope.moreGemstones = true;
 
                     $scope.showDiamond = true;
                     $scope.showGemstone = true;
                     $scope.showMounting = true;
 
                 }
                 else if (getByFindType(itemType) == "Tennis"|| itemType == 6) {
                     $scope.isDiamondRequired = false;
                     $scope.isGemstomeRequired = false;
                     $scope.moreDiamonds = true;
                     $scope.moreGemstones = true;
 
                     $scope.showDiamond = true;
                     $scope.showGemstone = true;
                     $scope.showMounting = true;
                 }
                 else if (getByFindType(itemType) == "Link" || itemType == 8) {
                     $scope.isDiamondRequired = false;
                     $scope.isGemstomeRequired = false;
                     $scope.moreDiamonds = false;
                     $scope.moreGemstones = false;
 
                     $scope.showDiamond = false;
                     $scope.showGemstone = false;
                     $scope.showMounting = true;
                 }
                 else if (getByFindType(itemType) == "Fashion" || itemType == 7) {
                     $scope.isDiamondRequired = false;
                     $scope.isGemstomeRequired = false;
                     $scope.moreDiamonds = true;
                     $scope.moreGemstones = true;
                 }
                 else{

                    $scope.isDiamondRequired = false;
                    $scope.isGemstomeRequired = false;
                    $scope.moreDiamonds = false;
                    $scope.moreGemstones = false;

                    $scope.showDiamond = false;
                    $scope.showGemstone = false;
                    $scope.showMounting = false;
                }

 
             }
             //Necklaces id=9
             if (itemCatagory == 9 && (itemType != null || itemType != "undefined")) {
 
                 
                  if (getByFindType(itemType) == "Diamond" || itemType == 9) {
                     $scope.isDiamondRequired = true;
                     $scope.isGemstomeRequired = false;
                     $scope.moreDiamonds = true;
                     $scope.moreGemstones = false;
 
                     $scope.showDiamond = true;
                     $scope.showGemstone = false;
                     $scope.showMounting = true;
                 }
                 else if (getByFindType(itemType) == "Solitaire" || itemType == 10) {
                     $scope.isDiamondRequired = false;
                     $scope.isGemstomeRequired = false;
                     $scope.moreDiamonds = false;
                     $scope.moreGemstones = false;
 
                     $scope.showDiamond = true;
                     $scope.showGemstone = true;
                     $scope.showMounting = true;
                 }
                 else if (getByFindType(itemType) == "Fashion" || itemType == 11) {
                     $scope.isDiamondRequired = false;
                     $scope.isGemstomeRequired = false;
                     $scope.moreDiamonds = true;
                     $scope.moreGemstones = true;
 
                     $scope.showDiamond = true;
                     $scope.showGemstone = true;
                     $scope.showMounting = true;
 
                     
                 }
                 else if (getByFindType(itemType) == "Chain" || itemType == 12) {
                     $scope.isDiamondRequired = false;
                     $scope.isGemstomeRequired = false;
                     $scope.moreDiamonds = true;
                     $scope.moreGemstones = true;
 
                     $scope.showDiamond = true;
                     $scope.showGemstone = true;
                     $scope.showMounting = true;
 
                     
                 }
                 else{

                    $scope.isDiamondRequired = false;
                    $scope.isGemstomeRequired = false;
                    $scope.moreDiamonds = false;
                    $scope.moreGemstones = false;

                    $scope.showDiamond = false;
                    $scope.showGemstone = false;
                    $scope.showMounting = false;
                }

             }
             //Earrings id=10
             if (itemCatagory == 10 && (itemType != null || itemType != "undefined")) {
 
                 if (getByFindType(itemType) == "Stud" || itemType == 13) {
                     $scope.isDiamondRequired = false;
                     $scope.isGemstomeRequired = false;
                     $scope.moreDiamonds = true;
                     $scope.moreGemstones = true;
 
                     $scope.showDiamond = true;
                     $scope.showGemstone = true;
                     $scope.showMounting = true;
                 }
                 else if (getByFindType(itemType) == "Hoop" || itemType == 14) {
                     $scope.isDiamondRequired = false;
                     $scope.isGemstomeRequired = false;
                     $scope.moreDiamonds = true;
                     $scope.moreGemstones = true;
 
                     $scope.showDiamond = true;
                     $scope.showGemstone = true;
                     $scope.showMounting = true;
                 }
                 else if (getByFindType(itemType) == "Drop" || itemType == 15) {
                     $scope.isDiamondRequired = false;
                     $scope.isGemstomeRequired = false;
                     $scope.moreDiamonds = true;
                     $scope.moreGemstones = true;
 
                     $scope.showDiamond = true;
                     $scope.showGemstone = true;
                     $scope.showMounting = true;
                 }
                 else{

                    $scope.isDiamondRequired = false;
                    $scope.isGemstomeRequired = false;
                    $scope.moreDiamonds = false;
                    $scope.moreGemstones = false;

                    $scope.showDiamond = false;
                    $scope.showGemstone = false;
                    $scope.showMounting = false;
                }

 
 
             }
             //stone id=11
             if (itemCatagory == 11 && (itemType != null || itemType != "undefined")) {
 
                 if (getByFindType(itemType) == "Loose Diamonds" || itemType == 16) {
                     $scope.isDiamondRequired = false;
                     $scope.isGemstomeRequired = false;
                      $scope.isMountingRequired = false;
                     $scope.moreDiamonds = true;
                     $scope.moreGemstones = false;
                     $scope.isMountingRequired = false;
 
                     $scope.showDiamond = true;
                     $scope.showGemstone = false;
                     $scope.showMounting = false;
                 }
                 else if (getByFindType(itemType) == "Loose Gemstones" || itemType == 17) {
                     $scope.isDiamondRequired = false;
                     $scope.isGemstomeRequired = false;
                     $scope.isMountingRequired = false;
                      $scope.isMountingRequired = false;
                     $scope.moreDiamonds = false;
                     $scope.moreGemstones = true;
 
                     $scope.showDiamond = false;
                     $scope.showGemstone = true;
                     $scope.showMounting = false;
                 }
                 else{

                    $scope.isDiamondRequired = false;
                    $scope.isGemstomeRequired = false;
                    $scope.moreDiamonds = false;
                    $scope.moreGemstones = false;

                    $scope.showDiamond = false;
                    $scope.showGemstone = false;
                    $scope.showMounting = false;
                }

             }
 
         }


//print pdf
$scope.printDiv = function() {

    $scope.isAppraisalPrint = true;

    var originalContents = document.body.innerHTML;
   // var innerContents = document.getElementById('pdfGenerator').innerHTML;
   //   w=window.open();
   //   w.document.write('<html><head> <link rel="stylesheet" href="assets/layouts/layout4/css/custom.css" media="print" /><link href="assets/Customplugin.css" rel="stylesheet"  media="print"/></head><body onload="window.print()">' + innerContents + '</html>');
   //   w.print();
   //   w.close();  




     var printContents = document.getElementById('pdfGenerator').innerHTML;
     var originalContents = document.body.innerHTML;      
 
     if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
         var popupWin = window.open('', '_blank', 'width=600,height=600,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
         popupWin.window.focus();
         popupWin.document.write('<!DOCTYPE html><html><head>' +
             '<link rel="stylesheet" href="assets/layouts/layout4/css/custom.css" media="print" /><link href="assets/Customplugin.css" rel="stylesheet"  media="print"/> <link href="assets/global/plugins/bootstrap/css/bootstrap.css" rel="stylesheet" type="text/css" />' +
             '</head><body onload="window.print();window.close()"><div class="reward-body">' + printContents + '</div></html>');
         popupWin.onbeforeunload = function (event) {
             popupWin.close();
             return '.\n';
         };
         popupWin.onabort = function (event) {
             popupWin.document.close();
             popupWin.close();
         }
     } else {
         var popupWin = window.open('', '_blank', 'width=800,height=600');
         popupWin.document.open();
         popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + printContents + '</html>');
         popupWin.document.close();
     }
     popupWin.document.close();
     



   
   // var printContents = document.getElementById('pdfGenerator');
    //var originalContents = document.body.innerHTML;

   // document.body.innerHTML = printContents;

   //  w=window.open();
   //  w.document.write(printContents);
   //  w.print();
   //  w.close();  

  

 


//     var innerContents = document.getElementById('pdfGenerator').innerHTML;
// var popupWinindow = window.open('', '_blank', 'width=600,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
// popupWinindow.document.open();
// popupWinindow.document.write('<html><head> <link rel="stylesheet" href="assets/layouts/layout4/css/custom.css" media="print" /><link href="assets/Customplugin.css" rel="stylesheet"  media="print"/></head><body onload="window.print();window.close()">' + innerContents + '</html>');
// popupWinindow.document.close();         
   


 document.body.innerHTML = originalContents;
   
  
  $window.location.reload();

  }


  var ComparableList = [];
        //UpdateApprisal
        $scope.UpdateApprisal = UpdateApprisal;
        function UpdateApprisal() {
            $(".page-spinner-bar").removeClass("hide");
            //comparable            
            angular.forEach($scope.AddedComparables, function (item) {
                if (item.id === null) {
                    ComparableList.push({
                        "id": item.id,
                        "originalItemId": $scope.ItemDetails.id,
                        "isvendorItem": item.isvendorItem,
                        "description": item.description,
                        "itemName": $scope.ItemDetails.itemName,
                        "unitPrice": item.price,
                        "taxRate": null,
                        "brand": item.brand,
                        "model": item.model,
                        "supplier": item.supplier,
                        "itemType": $scope.ItemDetails.itemType,
                        "isReplacementItem": ($scope.ItemDetails.isReplacementItem) ? $scope.ItemDetails.isReplacementItem : false,
                        "buyURL": item.buyURL,
                        "isDataImage": item.isDataImage,
                        "imageData": (item.isDataImage) ? item.imageURL : null,
                        "imageURL": (!item.isDataImage) ? item.imageURL : null,
                        "delete": false
                    });
                }
            });
            if ($scope.Comparables !== null) {
                if ($scope.Comparables.comparableItems !== null) {
                    angular.forEach($scope.Comparables.comparableItems, function (item) {
                        // var InsertFlag = false;
                        // angular.forEach($scope.AddedComparables, function (addedComparableitem) {
                        //     if (item.id === addedComparableitem.id) {
                        //         if (item.isReplacementItem == true) {
                        //             InsertFlag = true;
                        //         }
                        //     }
                        // });

                        item.delete=false;
                        ComparableList.push(item);

                    });
                }
            }
            angular.forEach($scope.DeletedComparables, function (item) {
                // ComparableList.push($scope.Comparables.comparableItems);
                item.delete = true;
                ComparableList.push(item);
            });


            //end comparable
            // var policyNum = sessionStorage.getItem("policyNumber");

            // var createdBy = sessionStorage.getItem("UserId");
            var mountingDetails = {
                "id": $scope.Appraisal.Mounting.id,
                "metalWeight": $scope.Appraisal.Mounting.MetalWeight.weight,
                "metalUnitWeight": $scope.Appraisal.Mounting.MetalWeight.MetalUnit,
                "length": $scope.Appraisal.Mounting.MetalLength,
                "width": $scope.Appraisal.Mounting.MetalWidth,
                //check
                "metalUnitWeight": $scope.Appraisal.Mounting.MetalWeight.MetalUnit,
                "metalColor": $scope.Appraisal.Mounting.MetalColor,
                "typeOfMetal": $scope.Appraisal.Mounting.MetalType
            };
            var diamondDetails = $scope.diamondItems;
            var stoneDetails = $scope.gemstoneItems;
            var appraisalDocuments = $scope.attachmentList;
            //console.log($scope.Appraisal);
            var details = {
                "id": sessionStorage.getItem("id"),
                "appraisalNumber": sessionStorage.getItem("appraisalNumber"),
                "original_appraisal_description": $scope.Appraisal.OriginalDescription,
                "createdDate": (($scope.Appraisal.AppraisalDate !== null && angular.isDefined($scope.Appraisal.AppraisalDate)) ? $filter('DatabaseDateFormatMMddyyyy')($scope.Appraisal.AppraisalDate) : null),

                "appraisalOldValue": $scope.Appraisal.AppraisalValue,
                "policyNumber": sessionStorage.getItem("policyNumber"),
                "createdBy": sessionStorage.getItem("createdBy"),

                "gender": $scope.Appraisal.Gender,

                "isCustom": $scope.Appraisal.Custom,
                "designer": $scope.Appraisal.Designer,
                "itemCategory": $scope.Appraisal.ItemCategory,
                "type": $scope.Appraisal.ItemType,

                "mountingDetails": mountingDetails,
                "stoneDetails": stoneDetails,
                "diamondDetails": diamondDetails,
                "appraisalId": $scope.Appraisal.appraisalId,

                "comparableItems": ComparableList,

                "speedCheckUserName": sessionStorage.getItem("Name"),

                //speedcheck values
                "sc_salvageValue": $scope.totalSalvageCost,
                "sc_jwelersCost": $scope.totalJeweleryCost,
                "sc_artigemReplacementValue": $scope.totalArtigemReplacementCost,
                "sc_insuranceReplacementValue": $scope.totalInsuranceReplacementCost,
                "sc_retailValue": $scope.totalRetailValue,
                "sc_totalMountingPrice": $scope.Appraisal.ScTotalMountingPrice,
                "sc_totalDiamondPrice": $scope.diamondInsuranceReplacementCost,
                "sc_totalGemStonePrice": $scope.gemstoneArtigemReplacementCost,
                "sc_labourCost": $scope.Appraisal.labourCost,
                "deletedAttachments": $scope.deletedAttachmentList,

                "sc_finalEstimate": $scope.Appraisal.scEstimateDescription,
                "speedcheckAppraisalDate": (($scope.speedcheckSubmitDate !== null && angular.isDefined($scope.speedcheckSubmitDate)) ? $filter('DatabaseDateFormatMMddyyyy')($scope.speedcheckSubmitDate) : null),
                "comparablesUpdatedDate" : (($scope.comparablesUpdatedDate !== null && angular.isDefined($scope.comparablesUpdatedDate)) ? $filter('DatabaseDateFormatMMddyyyy')($scope.comparablesUpdatedDate) : null)
            };
            //"appraisalDocuments":appraisalDocuments
            $scope.details = details;


            var data = new FormData();
            angular.forEach($scope.attachmentList, function (ItemFile) {

                //data.append('filesDetails', JSON.stringify([{ "fileName": ItemFile.FileName, "fileType": ItemFile.FileType, "extension": ItemFile.FileExtension, "filePurpose": "ITEM_APPRAISAL", "latitude": 41.403528, "longitude": 2.173944 }]));
                data.append('file', ItemFile.File);

            });

            data.append("details", angular.toJson(details));
            //data.append("appraisalDocuments", JSON.stringify(appraisalDocuments[0]));

            // ComparableList

            // data.append("comparableItems",ComparableList);

            var promis = AppraisalService.UpdateAppraisal(data);

            promis.then(function (success) {

                toastr.remove();
                toastr.success("Changes have been saved!", "Success");
                $location.path('/SpeedCheckAssociateAppraisal');
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

        // Formate date
        $scope.formatDateDB = formatDateDB;
        function formatDateDB(date) {
            console.log(date);
            return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
        }

        //reset filters
        $scope.ClearFilters = ClearFilters;
        function ClearFilters() {
            $scope.Appraisal = {};
            $scope.diamondItems = [];
            $scope.diamondItems = [{
                id: '1',
                removeButton: false
            }];

            $scope.gemstoneItems = [];
            $scope.gemstoneItems = [{
                id: '1',
                removeButton: false
            }];
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

            // $rootScope.tempFiles.push($scope.files);

            // $scope.files = [];

            // $scope.files.push($rootScope.tempFiles);
            //
        }

        $scope.splice = splice;
        function splice(item) {

        }
        $scope.displayAddImageButton = false;
        $scope.getAttachmentDetails = function (e) {
            $scope.$apply(function () {
                if (e.files.length > 0) {
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
                $scope.attachmentList.push(
                    {
                        "FileName": e.target.fileName, "FileExtension": e.target.fileExtension, "FileType": e.target.fileType,
                        "Image": e.target.result, "File": e.target.file
                    })
            });
        }

        $scope.RemoveAttachment = RemoveAttachment;
        function RemoveAttachment(index) {
            if ($scope.attachmentList.length > 0) {

                var deleted = $scope.attachmentList[index];


                if (angular.isDefined(deleted.FilePath)) {
                    $scope.deletedAttachmentList.push(deleted.FilePath);
                }
                $scope.attachmentList.splice(index, 1);

            }
        };
        //End File Upload
        $scope.NewApprisal = NewApprisal;
        function NewApprisal() {
            $scope.Appraisal = {};
            $scope.Desc.description = "";
            $scope.ApprisalOrderAddEdit = true;
            $scope.IsEditOrder = false;

            //dropDown Apis
            // GetGenderList();
            // GetAppraisalTypeList();
            // GetCustomTypeList();
            // GetMetalList();
            // GetMetaColor();
            // GetjewelleryTypeList();
            // GetStoneShapeList();
            // GetStoneColorList();
            // GetStoneclarityList();
        }

        $scope.btnCancel = btnCancel;
        function btnCancel() {
            this.ApprisalForm.$setUntouched();
            $scope.Appraisal = {};
            $scope.Desc.description = "";
            $scope.attachmentList = [];
            angular.element("input[type='file']").val(null);
            $scope.ApprisalOrderAddEdit = false;
            $scope.IsEditOrder = false;
        }

        $scope.GotoDetails = GotoDetails;
        function GotoDetails(item) {
            GetAppraisalDetails(item.appraisalNumber);
            $scope.ApprisalOrderAddEdit = true;
            $scope.IsEditOrder = true;

        }

        $scope.DeleteAppraisal = DeleteAppraisal;
        function DeleteAppraisal(item) {
            DeleteAppraisalDetails(item.appraisalNumber);
        }


        //AddEmailPopup
        $scope.AddEmailPopup = AddEmailPopup;
        function AddEmailPopup() {

            $scope.animationsEnabled = true;
            var out = $uibModal.open(
                {
                    animation: $scope.animationsEnabled,
                    templateUrl: "views/SpeedCheckAssociate/Dashboard/Appraisals/EmailPopup.html",
                    controller: "EmailPopupController"

                });
            out.result.then(function (value) {
                //Call Back Function success
                if (value === "Success") {

                    // GetNotes();
                }

            }, function (res) {
                //Call Back Function close
            });
            return {
                open: open
            };

        }
        //AddUnderWriterPopup
        $scope.AddUnderWriterPopup = AddUnderWriterPopup;
        function AddUnderWriterPopup() {
            var appraisalDTO = {
                "AddedComparables": $scope.AddedComparables,
                "ItemDetails": $scope.ItemDetails,
                "Comparables": $scope.Comparables,
                "DeletedComparables": $scope.DeletedComparables,
                "Appraisal": $scope.Appraisal,
                "diamondItems": $scope.diamondItems,
                "gemstoneItems": $scope.gemstoneItems,
                "attachmentList": $scope.attachmentList,
                //speedcheck values
                "sc_salvageValue": $scope.totalSalvageCost,
                "sc_jwelersCost": $scope.totalJeweleryCost,
                "sc_artigemReplacementValue": $scope.totalArtigemReplacementCost,
                "sc_insuranceReplacementValue": $scope.totalInsuranceReplacementCost,
                "sc_retailValue": $scope.totalRetailValue,
                "sc_totalMountingPrice": $scope.Appraisal.ScTotalMountingPrice,
                "sc_totalDiamondPrice": $scope.diamondInsuranceReplacementCost,
                "sc_totalGemStonePrice": $scope.gemstoneArtigemReplacementCost,
                "sc_labourCost": $scope.Appraisal.labourCost,
                
                "sc_finalEstimate": $scope.Appraisal.scEstimateDescription,
                "speedcheckAppraisalDate": (($scope.speedcheckSubmitDate !== null && angular.isDefined($scope.speedcheckSubmitDate)) ? $filter('DatabaseDateFormatMMddyyyy')($scope.speedcheckSubmitDate) : null),
                "comparablesUpdatedDate" : (($scope.comparablesUpdatedDate !== null && angular.isDefined($scope.comparablesUpdatedDate)) ? $filter('DatabaseDateFormatMMddyyyy')($scope.comparablesUpdatedDate) : null)
            };

            $scope.animationsEnabled = true;
            var out = $uibModal.open(
                {
                    animation: $scope.animationsEnabled,
                    templateUrl: "views/SpeedCheckAssociate/Dashboard/Appraisals/UnderwritterReviewPopup.html",
                    controller: "UnderwritterReviewPopupController",
                    backdrop: 'static',
                    keyboard: false,
                    resolve:
                    {
                        appraisalData: function () {
                            appraisalData = appraisalDTO;
                            return appraisalData;
                        }
                    }

                });
            out.result.then(function (value) {
                //Call Back Function success
                if (value === "Success") {
                    e.log("done"); consol
                    // GetNotes();
                }

            }, function (res) {
                //Call Back Function close
            });
            return {
                open: open
            };
        }

        //AddInsuranceAgentPopup
        $scope.AddInsuranceAgentPopup = AddInsuranceAgentPopup;
        function AddInsuranceAgentPopup() {
            var appraisalDTO = {
                "AddedComparables": $scope.AddedComparables,
                "ItemDetails": $scope.ItemDetails,
                "Comparables": $scope.Comparables,
                "DeletedComparables": $scope.DeletedComparables,
                "Appraisal": $scope.Appraisal,
                "diamondItems": $scope.diamondItems,
                "gemstoneItems": $scope.gemstoneItems,
                "attachmentList": $scope.attachmentList,
                //speedcheck values
                "sc_salvageValue": $scope.totalSalvageCost,
                "sc_jwelersCost": $scope.totalJeweleryCost,
                "sc_artigemReplacementValue": $scope.totalArtigemReplacementCost,
                "sc_insuranceReplacementValue": $scope.totalInsuranceReplacementCost,
                "sc_retailValue": $scope.totalRetailValue,
                "sc_totalMountingPrice": $scope.Appraisal.ScTotalMountingPrice,
                "sc_totalDiamondPrice": $scope.diamondInsuranceReplacementCost,
                "sc_totalGemStonePrice": $scope.gemstoneArtigemReplacementCost,
                "sc_labourCost": $scope.Appraisal.labourCost,
                "deletedAttachments": $scope.deletedAttachmentList,

                "sc_finalEstimate": $scope.Appraisal.scEstimateDescription,
                "speedcheckAppraisalDate": (($scope.speedcheckSubmitDate !== null && angular.isDefined($scope.speedcheckSubmitDate)) ? $filter('DatabaseDateFormatMMddyyyy')($scope.speedcheckSubmitDate) : null),
                "comparablesUpdatedDate" : (($scope.comparablesUpdatedDate !== null && angular.isDefined($scope.comparablesUpdatedDate)) ? $filter('DatabaseDateFormatMMddyyyy')($scope.comparablesUpdatedDate) : null)
            };
            $scope.animationsEnabled = true;
            var out = $uibModal.open(
                {
                    animation: $scope.animationsEnabled,
                    templateUrl: "views/SpeedCheckAssociate/Dashboard/Appraisals/InsuranceAgentReviewPopup.html",
                    controller: "InsuranceAgentReviewPopupController",
                    backdrop: 'static',
                    keyboard: false,
                    resolve:
                    {
                        appraisalData: function () {
                            appraisalData = appraisalDTO;
                            return appraisalData;
                        }
                    }

                });
            out.result.then(function (value) {
                //Call Back Function success
                if (value === "Success") {
                    e.log("done"); consol
                    // GetNotes();
                }

            }, function (res) {
                //Call Back Function close
            });
            return {
                open: open
            };
        }

        //AddSpeedCheckAssociatePopup
        $scope.AddSpeedCheckSupervisorPopup = AddSpeedCheckSupervisorPopup;
        function AddSpeedCheckSupervisorPopup() {
            var appraisalDTO = {
                "AddedComparables": $scope.AddedComparables,
                "ItemDetails": $scope.ItemDetails,
                "Comparables": $scope.Comparables,
                "DeletedComparables": $scope.DeletedComparables,
                "Appraisal": $scope.Appraisal,
                "diamondItems": $scope.diamondItems,
                "gemstoneItems": $scope.gemstoneItems,
                "attachmentList": $scope.attachmentList,
                //speedcheck values
                "sc_salvageValue": $scope.totalSalvageCost,
                "sc_jwelersCost": $scope.totalJeweleryCost,
                "sc_artigemReplacementValue": $scope.totalArtigemReplacementCost,
                "sc_insuranceReplacementValue": $scope.totalInsuranceReplacementCost,
                "sc_retailValue": $scope.totalRetailValue,
                "sc_totalMountingPrice": $scope.Appraisal.ScTotalMountingPrice,
                "sc_totalDiamondPrice": $scope.diamondInsuranceReplacementCost,
                "sc_totalGemStonePrice": $scope.gemstoneArtigemReplacementCost,
                "sc_labourCost": $scope.Appraisal.labourCost,
                "deletedAttachments": $scope.deletedAttachmentList,
                 "insurancePremiumCost": $scope.Appraisal.insurancePremiumCost,

                "sc_finalEstimate": $scope.Appraisal.scEstimateDescription,
                "speedcheckAppraisalDate": (($scope.speedcheckSubmitDate !== null && angular.isDefined($scope.speedcheckSubmitDate)) ? $filter('DatabaseDateFormatMMddyyyy')($scope.speedcheckSubmitDate) : null),
                "comparablesUpdatedDate" : (($scope.comparablesUpdatedDate !== null && angular.isDefined($scope.comparablesUpdatedDate)) ? $filter('DatabaseDateFormatMMddyyyy')($scope.comparablesUpdatedDate) : null)
            };
            $scope.animationsEnabled = true;
            var out = $uibModal.open(
                {
                    animation: $scope.animationsEnabled,
                    templateUrl: "views/SpeedCheckAssociate/Dashboard/Appraisals/SupervisorReviewPopup.html",
                    controller: "SupervisorReviewPopupController",
                    backdrop: 'static',
                    keyboard: false,
                    resolve:
                    {
                        appraisalData: function () {
                            appraisalData = appraisalDTO;
                            return appraisalData;
                        }
                    }

                });
            out.result.then(function (value) {
                //Call Back Function success
                if (value === "Success") {
                    e.log("done"); consol
                    // GetNotes();
                }

            }, function (res) {
                //Call Back Function close
            });
            return {
                open: open
            };
        }


        //comparable starts here


        /*SetVariables,*/




        //set language




        //open model item value

        //open model item value

        // *************Add delete comparable form DBlist********************


        //Delete comparables fro list
        $scope.DeletedComparables = [];
        $scope.DeleteComparable = DeleteComparable;
        function DeleteComparable(comp) {
            comp.delete = true;
            $scope.DeletedComparables.push(comp);
            $scope.Comparables.comparableItems.splice($scope.Comparables.comparableItems.indexOf(comp), 1);
            $scope.AddedComparables.splice($scope.AddedComparables.indexOf(comp), 1);
            // $scope.CalculateRCV();
        }


        //Mark as replacement list
        $scope.MarkAsReplacement = MarkAsReplacement;
        function MarkAsReplacement(comp) {
            angular.forEach($scope.Comparables.comparableItems, function (item) {
                if (comp.id != item.id) {
                    if (item.isReplacementItem == true) {
                        item.isReplacementItem = false;
                    }
                }
                else if (comp.id == item.id) {
                    comp.isReplacementItem = true;
                    $scope.ItemDetails.adjusterDescription = comp.description;
                }
            });

        }

        // ************* End comparable form DBlist********************
        //*********************Googole search**********************************
        $scope.Searchoptions = [1];
        $scope.SearchReplacement = SearchReplacement;
        function SearchReplacement() {
            //Get items if exists in dbcomparable list and add to addtocomparables list
            $scope.displayReplacement = true;
            $scope.displaycomparables = true;
            $scope.Searchoptions = [1];
            $scope.submit = false;
            $scope.SerchComparables = false;
            $scope.Searchoptions = [1];

            if ($scope.Comparables !== null) {
                if ($scope.AddedComparables.length === 0) {
                    angular.forEach($scope.Comparables.comparableItems, function (item) {
                        if (angular.isDefined(item.customItemDetail) && item.customItemDetail != null) {
                            angular.forEach(item.customItemDetail.customSubItem, function (subitem) {

                                $scope.AddedComparables.push({
                                    "id": subitem.id,
                                    "description": subitem.description, "brand": null, "model": null, "price": ((subitem.unitPrice.toString()).indexOf('$') > -1) ? subitem.unitPrice.split('$')[1].replace(",", "") : subitem.unitPrice, "buyURL": null,
                                    "isDataImage": false, "supplier": null, "imageURL": subitem.attachment[0].url, "isvendorItem": true,
                                });
                            });
                        }
                        else {

                            $scope.AddedComparables.push({
                                "id": item.id,
                                "description": item.description, "brand": item.brand, "model": item.model, "price": ((item.unitPrice.toString()).indexOf('$') > -1) ? item.unitPrice.split('$')[1].replace(",", "") : item.unitPrice, "buyURL": item.buyURL,
                                "isDataImage": item.isDataImage, "supplier": item.supplier, "imageURL": ((item.imageData !== null) ? item.imageData : item.imageURL), "isvendorItem": item.isvendorItem,
                            });
                        }

                    });
                }
            }
            if ($scope.CommonObj.SearchComparables !== null && !angular.isUndefined($scope.CommonObj.SearchComparables) && $scope.CommonObj.SearchComparables !== "") {
                $scope.displaycomparables = false;
                $scope.displayReplacement = true;
                $scope.displayEmptyPart = false;
                $scope.dispalyAddedComparables = true;
                $scope.GoogleComparableList = [];
                // Get compaiables form google id will be google or amazon and many more      
                if ($scope.Searchoptions === null || $scope.Searchoptions.length === 0) {

                    if ($scope.ReplacementSuplier.length > 0) {
                        $scope.Searchoptions.push(parseInt($scope.ReplacementSuplier[0].id));
                    }
                    else
                        $scope.Searchoptions = [1];
                }
                var Searchstring = {
                    "item": $scope.CommonObj.SearchComparables,
                    "numberOfCounts": 10,
                    "ids": $scope.Searchoptions
                };
                var GetGoogleCompairables = VendorAssociateItemDetailsService.GetComparableListFromGoogle(Searchstring);
                GetGoogleCompairables.then(function (success) {
                    //We need to work here googleResults  amazonResults
                    var listgooleComparable = [];
                    angular.forEach(success.data.data.googleResults, function (item) {
                        listgooleComparable.push({
                            "id": null,
                            "description": item.description, "brand": null, "model": null, "price": ((item.itemPrice.toString()).indexOf('$') > -1) ? item.itemPrice.split('$')[1].replace(",", "") : item.itemPrice, "buyURL": item.itemURL,
                            "isDataImage": true, "supplier": null, "imageURL": item.itemImage, "isvendorItem": false
                        });
                    });
                    var amazonComparable = [];
                    angular.forEach(success.data.data.amazonResults, function (item) {
                        amazonComparable.push({
                            "id": null,
                            "description": item.description, "brand": item.brand, "model": item.model, "price": ((item.price.toString()).indexOf('$') > -1) ? item.price.split('$')[1].replace(",", "") : item.price, "buyURL": item.buyURL,
                            "isDataImage": false, "supplier": null, "imageURL": item.imageURL, "isvendorItem": false
                        });
                    });
                    var VendorComparables = [];
                    angular.forEach(success.data.data.vendorCatalogItems, function (item) {
                        VendorComparables.push({
                            "id": null,
                            "description": item.description, "brand": item.brand, "model": item.model, "price": ((item.price.toString()).indexOf('$') > -1) ? item.price.split('$')[1].replace(",", "") : item.price, "buyURL": null,
                            "isDataImage": false, "supplier": null, "imageURL": ((item.itemImages !== null) ? ((item.itemImages.length > 0) ? item.itemImages[0].url : null) : null), "isvendorItem": true
                        });
                    });

                    $scope.GoogleComparableList = listgooleComparable.concat(amazonComparable);
                    $scope.GoogleComparableList = $scope.GoogleComparableList.concat(VendorComparables);

                    $scope.SortGoogleResult();

                    $scope.comparablesUpdatedDate = new Date();

                }, function (error) { $scope.ErrorMessage = error.data.erromessage; });
            }
            else {
                // $scope.SearchReplacement();
            }
        }
 
          //comparable report
          $scope.generateComparableReport = generateComparableReport;
          function generateComparableReport() {
  
              $("#comparableReport").removeClass("hide");
              $scope.comparableReport = true;
              $scope.ApprisalOrderAddEdit = false;
  
              sessionStorage.setItem("comparableReport", true);
              sessionStorage.setItem("ApprisalOrderAddEdit", false);
          }

        //Sort Google result
        $scope.reverseOrder = false;
        $scope.SortGoogleResult = SortGoogleResult;
        function SortGoogleResult(type) {
            if (angular.isDefined(type)) {
                $scope.reverseOrder = type == "true" ? true : false;
            }
            angular.forEach($scope.GoogleComparableList, function (item) {
                item.price = parseFloat(item.price);
            })
        };

        $scope.AddtoComparableList = AddtoComparableList;
        function AddtoComparableList(item) {
            $scope.GoogleComparableList.splice($scope.GoogleComparableList.indexOf(item), 1);
            $scope.AddedComparables.push(item);
            // $scope.CalculateRCV();
        };

        //Remove form comaprables from list
        $scope.RemoveFromComparableList = RemoveFromComparableList;
        function RemoveFromComparableList(item) {
            item.delete = true;
            $scope.DeletedComparables.push(item);
            $scope.Comparables.comparableItems.splice($scope.Comparables.comparableItems.indexOf(item), 1);
            $scope.AddedComparables.splice($scope.AddedComparables.indexOf(item), 1);
            // $scope.CalculateRCV();
            if (item.id === null)
                $scope.GoogleComparableList.push(item);
           
        };

        //Go to shopping URL



        //*********************End Googole search**********************************
        //Show Replacement item pageload state
        $scope.AddReplacement = AddReplacement;
        function AddReplacement() {
            // $scope.displaycomparables = true;
            if ($scope.Comparables != null) {
                $scope.displaycomparables = true;
                $scope.displayEmptyPart = false;
            }
            else {
                $scope.displaycomparables = false;
                $scope.displayEmptyPart = true;
            }
            //$scope.displayReplacement = false;
            //$scope.dispalyAddedComparables = false;

            //$scope.Comparables=$scope.AddedAsReplacementList;//serchers
        };

        //Select comparables if press back the empty list and calculate rcv again pageload state
        $scope.CancelAddedComparables = CancelAddedComparables;
        function CancelAddedComparables() {
            $scope.GoogleComparableList = [];
            $scope.AddedComparables = [];
            $scope.AddReplacement();
            // $scope.CalculateRCV();

        };



        //------------Auto compalete extender----------------------------------
        //select particiapnt get participant
        // search function to match full text 
        $scope.localSearch = function (str) {
            var matches = [];
            $scope.ClaimParticipantsList.forEach(function (person) {
                var fullName = ((person.firstName === null) ? "" : person.firstName.toLowerCase()) + ' ' + ((person.lastName === null) ? "" : person.lastName.toLowerCase());
                if (fullName.indexOf(str.toString().toLowerCase()) >= 0) {
                    matches.push(person);
                }
            });
            return matches;
        };
        //------------End Auto compalete extender----------------------------------

        //---------------Note Attachment------------------------------------------
        $scope.fileName = '';
        $scope.FileExtension = '';
        $scope.FileType = '';
        $scope.files = [];







        $scope.GetSubCategory = GetSubCategory;
        function GetSubCategory() {
            //--------------------------------------------------------------------------------------------------------------
            //bind subcategory
            if ($scope.ItemDetails.category !== null && angular.isDefined($scope.ItemDetails.category)) {
                var param = { "categoryId": $scope.ItemDetails.category.id };
                var getpromise = VendorAssociateItemDetailsService.getSubCategory(param);
                getpromise.then(function (success) {
                    $scope.SubCategoryList = success.data.data;
                    //Get anual depreciation rate and apply it $scope.ItemDetails.depriciationRate  
                }, function (error) {
                    $scope.ErrorMessage = error.data.errorMessage;
                });
            }
        }
        $scope.SelectItemImage = function () {
            $scope.displayAddImageButton = false;
            $scope.displayImageName = true;
            $scope.EnableAddImage = true;
            angular.element('#ItemImageUpload').trigger('click');

        };

        //Go to shopping URL
        $scope.ShopNow = ShopNow;
        function ShopNow(comparable) {
            $window.open(comparable.buyURL, '_blank');
        };
        //Change DepriciationRate
        $scope.ChangeDepriciationRate = function () {
            var list = [];
            list = $filter('filter')($scope.SubCategoryList, { id: $scope.ItemDetails.subCategory.id });
            if (list !== null && list.length > 0) {
                $scope.ItemDetails.depriciationRate = list[0].annualDepreciation;
                $scope.ItemDetails.itemUsefulYears = list[0].usefulYears;
                // $scope.CalculateRCV();
            }
        };

        $scope.ImageName;
        $scope.ImageType;
        $scope.ImgExtension;
        $scope.ItemImageList = [];
        $scope.displayImageName = false;

        $scope.EnableAddImage = true;
        $scope.SerchComparables = false;
        $scope.submit = false;

        $scope.submit = false;
        $scope.speedCheckLoginDetails;
        $scope.SubmitComparables = SubmitComparables;
        function SubmitComparables() {
            $scope.displayReplacement = false;
            $scope.displaycomparables = false;
            $scope.submit = true;
            $scope.SerchComparables = true;
            //Orignal tokan save in the veriable Vendor_AccessToken
            var Vendor_AccessToken = sessionStorage.getItem("AccessToken");

            var loginParam = {
                "username": "admin@speedcheck.com",
                "password": "demo"
            };
            sessionStorage.setItem("SpeedcheckLoginUrl", "http://69.164.195.59:8080/SpeedCheck_App/api/admin/login");
            sessionStorage.setItem("AccessToken", "");
            var getSpeedCheckLogin = VendorAssociateItemDetailsService.speedCheckLogin(loginParam);
            getSpeedCheckLogin.then(function (success) {
                $scope.speedCheckLoginDetails = success.data.data;
                sessionStorage.setItem("AccessToken", $scope.speedCheckLoginDetails.token);
                ////////////////start speed check service //////////////
                sessionStorage.setItem("SpeedcheckUrl", "http://69.164.195.59:8080/SpeedCheck_App/api/web/get/speedcheck/values");
                var param = {
                    "item": $scope.ItemDetails.description,
                    "claimDetail": {
                        "claimNo": $scope.CommonObj.ClaimNumber,
                        "policyNo": $scope.PolicyholderDetails.policyNumber,
                        "phLastName": $scope.PolicyholderDetails.policyName,
                        "itemType": $scope.itemCategory.name,
                        "subItemType": $scope.subItemType.name,
                        "appraisalValue": $scope.ItemDetails.appraisalValue,
                        "appraisalDate": $filter('DatabaseDateFormatMMddyyyy')($scope.ItemDetails.appraisalDate)
                    },
                    "mounting": {
                        "metalType": $scope.MountingDetailsList.metalType,
                        "metalWeight": $scope.MountingDetailsList.metalWeight,
                        "unitOfMeasure": $scope.MountingDetailsList.unitOfMeasure,
                    },
                    "diamonds": $scope.DiamondDetailsList,
                    "gemstones": $scope.gemstoneDetailsList,
                    "semiMounting": $scope.semiMountingDetailsList,
                    "chain": $scope.ChainDetailsList
                };
                var getSpeedcheckValue = VendorAssociateItemDetailsService.getSpeedcheck(param);
                getSpeedcheckValue.then(function (success) {
                    $scope.speedcheckValue = success.data.data;
                    sessionStorage.setItem("AccessToken", Vendor_AccessToken);
                }, function (error) {
                    sessionStorage.setItem("AccessToken", Vendor_AccessToken);
                    toastr.remove();
                    if (error.data.errorMessage != null && angular.isDefined(error.data.errorMessage)) {
                        toastr.error(error.data.errorMessage, "Error")
                    }
                    else {
                        toastr.error(AuthHeaderService.genericErrorMessage(), "Error")
                    }
                });
                ////////////////End speed check service //////////////
            }, function (error) {
                sessionStorage.setItem("AccessToken", Vendor_AccessToken);
                toastr.remove();
                if (error.data.errorMessage != null && angular.isDefined(error.data.errorMessage)) {
                    toastr.error(error.data.errorMessage, "Error")
                }
                else {
                    toastr.error(AuthHeaderService.genericErrorMessage(), "Error")
                }
            })

        }

        $scope.GetFilterComparableSearch = GetFilterComparableSearch;
        function GetFilterComparableSearch() {
            var param = { "itemId": $scope.CommonObj.PurchaseItemId }
            var getFilterComparableSearch = VendorAssociateItemDetailsService.GetFilterComparableSearch();
            getFilterComparableSearch.then(function (success) {

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


        $scope.displayAddImageButton = false;
        $scope.getAttachmentDetails = function (e) {
            $scope.displayAddImageButton = true;
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
                $scope.attachmentList.push(
                    {
                        "FileName": e.target.fileName, "FileExtension": e.target.fileExtension, "FileType": e.target.fileType,
                        "Image": e.target.result, "File": e.target.file
                    })
            });
        }

        // $scope.RemoveAttachment = RemoveAttachment;
        // function RemoveAttachment(index) {
        //     if ($scope.attachmentList.length > 0) {
        //         $scope.attachmentList.splice(index, 1);
        //     }
        // };
        //End File Upload 

        $scope.CheckForAlreadyAddedComparables = CheckForAlreadyAddedComparables;
        function CheckForAlreadyAddedComparables() {
            if ($scope.Comparables != null && $scope.Comparables.comparableItems != null) {
                angular.forEach($scope.Comparables.comparableItems, function (item) {
                    $scope.AddedComparables.push({
                        "id": item.id,
                        "description": (angular.isDefined(item.description) && item.description != null ? item.description : "N/A"),
                        "brand": item.brand, "model": item.brand,
                        "price": (angular.isDefined(item.unitPrice) && item.unitPrice !== "N/A" ? item.unitPrice : "N/A"), "buyURL": item.buyURL,
                        "isDataImage": item.isDataImage, "supplier": item.supplier, "imageURL": item.imageData, "isvendorItem": item.isvendorItem
                    })
                })
            } else {
                $scope.AddedComparables = [];
            }
            if ($scope.Comparables.comparableItems != null) {
                $scope.displayReplacement = false;
                $scope.displaycomparables = true;
                $scope.displayEmptyPart = false;
                $scope.dispalyAddedComparables = false;
            }
            else {
                $scope.displaycomparables = false;
                $scope.displayEmptyPart = true;
                $scope.SearchReplacement();
                $scope.dispalyAddedComparables = false;
            }

        };

        // Assign Appraisal for SpeedCheck Associate
        $scope.assignPage = assignPage;
        function assignPage() {
            $("#appraisal-Details").addClass("hide");
            $("#appraisal-assignment").removeClass("hide");
            sessionStorage.setItem("isAssignAppraisal", true); 
        };

        // get list of all associates.
        function getAssociatesList() {
            $(".page-spinner-bar").addClass("remove");
            var details = AppraisalService.getAssociatesList();
            details.then(function (success) {
                $scope.associatesList = success.data.speedCheckAssociates;
                angular.forEach($scope.associatesList, function (item) {
                    if ((item.firstName != null || item.firstName != "") && (item.lastName != null || item.lastName != "")) {
                        item.firstName = item.lastName + ", " + item.firstName;
                    }
                    else if (item.firstName == null && item.firstName == "") {
                        item.firstName = item.lastName;
                    }
                    else if (item.lastName == null && item.lastName == "") {
                        item.firstName = item.firstName;
                    }
                });

                $(".page-spinner-bar").addClass("hide");
            }, function (error) {
                $scope.ErrorMessage = error.data.errorMessage;
                $(".page-spinner-bar").addClass("hide");
            });
        }

        $scope.selectAssociate = selectAssociate;
        function selectAssociate(associateInfo) {
            sessionStorage.setItem("associateEmployee", JSON.stringify(associateInfo));
        }

        $scope.assignAppraisal = assignAppraisal;
        function assignAppraisal() {

            var associateEmployee = sessionStorage.getItem("associateEmployee");

            if (associateEmployee.length != 0 ||associateEmployee != null || associateEmployee != undefined) {
                $(".page-spinner-bar").addClass("remove");
                var data = {
                    "assignedByRole" : sessionStorage.getItem("RoleList"),
                    "associate": angular.fromJson(associateEmployee),
                    "appraisalId": sessionStorage.getItem("id")
                }
                var assign = AppraisalService.assignAppraisalToAssociate(data);
                assign.then(function (success) {
                    toastr.remove();
                    toastr.success("The appraisal # "+sessionStorage.getItem("appraisalNumber")+" was successfully assigned to "+data.associate.firstName, "Success");
                    $location.path('/SpeedCheckAssociate');
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
            else {
                toastr.remove();
                toastr.error("Select a associate to assign this appraisal", "Warning")
            }
        }

    });