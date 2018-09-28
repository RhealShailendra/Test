angular.module('MetronicApp').controller('ContractsController', function ($rootScope, $scope, settings, $filter, $translate, $translatePartialLoader, $location, ThirdPartyContractService
    ) {

    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });
    //set language
    $translatePartialLoader.addPart('ThirdPartyVendorContracts');
    $translate.refresh();
    $scope.Contracts = true;
    $scope.ContractList;
    $scope.ContractDetails = {};
    $scope.SalvageContractList;
    $scope.isSalvageContract = false;
    $scope.ContractTypeList = [{ id: 1, name: "Claim" }, { id: 2, name: "Salvage" }];
    $scope.ContractType=2;
    $scope.files = [];
    $scope.salvageDetails = {};
    function init() {
        var GetContracts = ThirdPartyContractService.getContracts();
        GetContracts.then(function (success) {
            $scope.ContractList = success.data.data;
        }, function (error) {

        });
        var GetSalvageContracts = ThirdPartyContractService.getSalvageContracts();
        GetSalvageContracts.then(function (success) {
            $scope.SalvageContractList = success.data.data;
        }, function (error) {

        });
    }
    init();
    $scope.reverseNewClaim = true;
    $scope.sortNewClaimKey = "startDate";
    $scope.sortNewClaim = function (keyname) {
        $scope.sortNewClaimKey = keyname;   //set the sortKey to the param passed     
        $scope.reverseNewClaim = !$scope.reverseNewClaim; //if true make it false and vice versa
    };
    $scope.EditContract = EditContract;
    function EditContract(item) {
        $(".page-spinner-bar").removeClass("hide");
        $scope.Contracts = false;
        var parm = {
            "id": item.id
        };
        var GetContracts = ThirdPartyContractService.getContractsDetails(parm);
        GetContracts.then(function (success) {
            $scope.ContractDetails = success.data.data; 
            $scope.ContractDetails.createDate = (angular.isDefined($scope.ContractDetails.createDate) && $scope.ContractDetails.createDate != null) ? ($filter('DateFormatMMddyyyy')($scope.ContractDetails.createDate)) : null
            $scope.ContractDetails.endDate = (angular.isDefined($scope.ContractDetails.endDate) && $scope.ContractDetails.endDate != null) ? ($filter('DateFormatMMddyyyy')($scope.ContractDetails.endDate)) : null
          
            $(".page-spinner-bar").addClass("hide");
        },
            function (error) {
                $(".page-spinner-bar").addClass("hide");
            });
    };

    $scope.EditSalvageContract = EditSalvageContract;
    function EditSalvageContract(item) {
        $scope.Contracts = false;
        $scope.isSalvageContract = true;
        var param = {
            "id":item.id
        }
        var GetContracts = ThirdPartyContractService.getSalvageContractsDetails(param);
        GetContracts.then(function (success) {
            $scope.salvageDetails = success.data.data;
            $scope.salvageDetails.createDate = (angular.isDefined($scope.salvageDetails.createDate) && $scope.salvageDetails.createDate != null) ? ($filter('DateFormatMMddyyyy')($scope.ContractDetails.createDate)) : null
            $scope.salvageDetails.expirationDate = (angular.isDefined($scope.salvageDetails.expirationDate) && $scope.salvageDetails.expirationDate != null) ? ($filter('DateFormatMMddyyyy')($scope.salvageDetails.expirationDate)) : null

            $(".page-spinner-bar").addClass("hide");
        },
            function (error) {
                $(".page-spinner-bar").addClass("hide");
            });
    }
    
    $scope.CancelContracts = CancelContracts;
    function CancelContracts() {
        $scope.Contracts = true;
        $scope.isSalvageContract = false;
        $scope.salvageDetails = {};
        $scope.ContractDetails = {};
    };

    $scope.SelectFile = SelectFile;
    function SelectFile() {
        angular.element("input[type='file']").val(null);
        angular.element('#FileUpload').trigger('click');
    };

    $scope.getFileDetails = getFileDetails;
    function getFileDetails(event) {
        var files = event.target.files;
        $scope.filed = event.target.files;
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            var reader = new FileReader();
            reader.file = file;
            reader.fileName = files[i].name;
            reader.fileType = files[i].type;
            reader.fileExtension = files[i].name.substr(files[i].name.lastIndexOf('.'));
            reader.onload = $scope.imageIsLoaded;
            reader.readAsDataURL(file);

        }
    }
    $scope.imageIsLoaded = function (e) {
        $scope.$apply(function () {
            $scope.files.push({ "FileName": e.target.fileName, "FileExtension": e.target.fileExtension, "FileType": e.target.fileType, "Image": e.target.result, "File": e.target.file })

        });
    };
    $scope.updateSalvegContract = updateSalvegContract;
    function updateSalvegContract() {
        debugger;

        $(".page-spinner-bar").removeClass("hide");
        var data = new FormData();
        //Append File
        if ($scope.files !== null && angular.isDefined($scope.files)) {
            var FileDetails = [];
            angular.forEach($scope.files, function (item) {
                FileDetails.push({
                    "extension": item.FileExtension,
                    "fileName": item.FileName,
                    "fileType": item.FileType,
                    "filePurpose": "SALVAGE_CONTRACT",
                    "documentComments": null
                });
                data.append("attachment", item.File);
            });
            data.append("filesDetails", JSON.stringify(FileDetails));
        }
        else {
            data.append("filesDetails", null);
            data.append("attachment", null);
        }

        if ($scope.salvageDetails.id !== null && angular.isDefined($scope.salvageDetails.id)) {
            var salvageDetails = {
                "id": $scope.salvageDetails.id,
                "contractNumber": $scope.ContractDetails.contractUID,
                "contractName": $scope.ContractDetails.contractName,
                "startDate": $filter('DatabaseDateFormatMMddyyyy')($scope.ContractDetails.startDate),
                "expirationDate": $filter('DatabaseDateFormatMMddyyyy')($scope.ContractDetails.endDate),
                "company": {
                    "id": $scope.ContractDetails.vendor.vendorId,
                },
                "immediateRepair": $scope.salvageDetails.immediateRepair,
                "salvageMetal": $scope.salvageDetails.salvageMetal,
                "finishedJewlery0_5": $scope.salvageDetails.finishedJewlery0_5,
                "finishedJewlery5_15": $scope.salvageDetails.finishedJewlery5_15,
                "finishedJewlery15_5": $scope.salvageDetails.finishedJewlery15_5,
                "finishedJewlery5": $scope.salvageDetails.finishedJewlery5,
                "looseDiamonds0_5": $scope.salvageDetails.looseDiamonds0_5,
                "looseDaimond5_15": $scope.salvageDetails.looseDaimond5_15,
                "looseDiamond15_5": $scope.salvageDetails.looseDiamond15_5,
                "looseDiamond5": $scope.salvageDetails.looseDiamond5,
                "retailLooseStones": $scope.salvageDetails.retailLooseStones,
                "wholesaleLooseStones": $scope.salvageDetails.wholesaleLooseStones,
                "purchaseByArtigem": $scope.salvageDetails.purchaseByArtigem,
                "priceDecrease30": $scope.salvageDetails.priceDecrease30,
                "priceDecrease60": $scope.salvageDetails.priceDecrease60,
                "priceDecrease90": $scope.salvageDetails.priceDecrease90,
                "commissionRate0_5": $scope.salvageDetails.commissionRate0_5,
                "commissionRate5_15": $scope.salvageDetails.commissionRate5_15,
                "commissionRate15_5": $scope.salvageDetails.commissionRate15_5,
                "commissionRate5": $scope.salvageDetails.commissionRate5
            }
            data.append("salvageDetails", JSON.stringify(contractDetails));
            var SaveContracts = ThirdPartyContractService.UpdateSalvageContracts(data);
            SaveContracts.then(function (success) {
                $scope.GetSalvageContract();
                $scope.CancelNewContract();
                $(".page-spinner-bar").addClass("hide");
                toastr.remove();
                toastr.success(((success.data !== null) ? success.data.message : "Contract details saved successfully."), "Confirmation");
            },
                function (error) {
                    toastr.remove();
                    toastr.error(((error.data !== null) ? error.data.message : "Failed to save the contract details. please try again"), "Error");
                    $(".page-spinner-bar").addClass("hide");
                });
        }
        else {
            var salvageDetails = {
                "id": null,
                "contractNumber": null,
                "contractName": $scope.salvageDetails.contractName,
                "startDate": $filter('DatabaseDateFormatMMddyyyy')($scope.salvageDetails.startDate),
                "expirationDate": $filter('DatabaseDateFormatMMddyyyy')($scope.salvageDetails.endDate),
                "vendor": {
                    "vendorId": $scope.salvageDetails.vendor.vendorId,
                },
                "immediateRepair": $scope.salvageDetails.immediateRepair,
                "salvageMetal": $scope.salvageDetails.salvageMetal,
                "finishedJewlery0_5": $scope.salvageDetails.finishedJewlery0_5,
                "finishedJewlery5_15": $scope.salvageDetails.finishedJewlery5_15,
                "finishedJewlery15_5": $scope.salvageDetails.finishedJewlery15_5,
                "finishedJewlery5": $scope.salvageDetails.finishedJewlery5,
                "looseDiamonds0_5": $scope.salvageDetails.looseDiamonds0_5,
                "looseDaimond5_15": $scope.salvageDetails.looseDaimond5_15,
                "looseDiamond15_5": $scope.salvageDetails.looseDiamond15_5,
                "looseDiamond5": $scope.salvageDetails.looseDiamond5,
                "retailLooseStones": $scope.salvageDetails.retailLooseStones,
                "wholesaleLooseStones": $scope.salvageDetails.wholesaleLooseStones,
                "purchaseByArtigem": $scope.salvageDetails.purchaseByArtigem,
                "priceDecrease30": $scope.salvageDetails.priceDecrease30,
                "priceDecrease60": $scope.salvageDetails.priceDecrease60,
                "priceDecrease90": $scope.salvageDetails.priceDecrease90,
                "commissionRate0_5": $scope.salvageDetails.commissionRate0_5,
                "commissionRate5_15": $scope.salvageDetails.commissionRate5_15,
                "commissionRate15_5": $scope.salvageDetails.commissionRate15_5,
                "commissionRate5": $scope.salvageDetails.commissionRate5
            };
            data.append("salvageDetails", JSON.stringify(salvageDetails));
            var SaveContracts = ThirdPartyContractService.UpdateSalvageContracts(data);
            SaveContracts.then(function (success) {
                $scope.GetSalvageContract();
                $scope.CancelNewContract();
                toastr.remove();
                toastr.success(((success.data !== null) ? success.data.message : "Contract details updated successfully."), "Confirmation");
                $(".page-spinner-bar").addClass("hide");
            },
                function (error) {
                    toastr.remove();
                    toastr.error(((error.data !== null) ? error.data.message : "Failed to update the contract details. please try again"), "Error");
                    $(".page-spinner-bar").addClass("hide");
                });
        }

    }
});