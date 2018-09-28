angular.module('MetronicApp').controller('AddCustomItemPopupController', function ($translate, $translatePartialLoader, $rootScope, $log, $scope, $window, $http,ThirdPartyLineItemDetailsService, $timeout, $uibModal, $location, $filter, objClaim) {

    $translatePartialLoader.addPart('AddCustomItem');
    $translate.refresh();
    $scope.NoImagePath = $rootScope.$settings.NoImagePath;

    $scope.CommonObj = {
        "ClaimId": objClaim.ClaimId,
        "itemUID": angular.isDefined(objClaim.itemUID) ? objClaim.itemUID : null,
        "CustomItemType": objClaim.CustomItemType
    };

    $scope.cancel = function () {
        $scope.$close();
    };
    $scope.Base64Image=""
    $scope.addCustomItem = addCustomItem;
    function addCustomItem() {

        var form = document.getElementById("AddItem");

        var image = document.getElementById("customImage").src;
        var block = image.split(";");      
        var contentType = block[0].split(":")[1];// In this case "image/gif"     
        var realData = block[1].split(",")[1];// In this case "R0lGODlhPQBEAPeoAJosM...."  
        $scope.Base64Image = block[1].split(",")[1];// In this case "R0lGODlhPQBEAPeoAJosM...."
        var param = new FormData();        
        //Request to add quick custom item
        param.append("customItem", JSON.stringify({
            "id": null,
            "customItemFlag": true,
            "description": $scope.ItemDetails.ItemDescription,
            "itemStatus": "Comparable",
            "replacementCost": $scope.ItemDetails.ItemPrice,
            "supplierName": null,
            "supplierWebsite": $scope.ItemDetails.SupplierWebsite,
            "registrationNumber": sessionStorage.getItem("CompanyCRN"),
            "sku": null,
            "claim": {
                "claimId": $scope.CommonObj.ClaimId
            },
            "item": {
                "itemUID": $scope.CommonObj.itemUID
            },
            "customItemType": {
                id: $scope.CommonObj.CustomItemType,
            },
            "customSubItem": null,
            "base64images": [realData]
        }));

        fileDetaills = [{
            "extension": ".png",
            "fileName": "QuickAddCustomItem",
            "filePurpose": "CUSTOM_ITEM",
            "fileType": "document"
        }];
        param.append('filesDetails', JSON.stringify(fileDetaills));
       
        //Add/Update quick addcustom item
        var getItemDetailsOnId = ThirdPartyLineItemDetailsService.AddCustomItem(param);
        getItemDetailsOnId.then(function (success) {
            toastr.remove();
            toastr.success(success.data.message, "Confirmation");
            //$scope.GetCustomItems();
            //$scope.CustomItem = {};
            //$scope.NewCustomItem = false;
            $scope.$close();
        }, function (error) {
            toastr.remove();
            toastr.error(error.data.errorMessage, "Error");
        });

    };
});