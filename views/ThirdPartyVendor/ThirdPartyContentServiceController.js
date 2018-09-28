angular.module('MetronicApp').controller('ThirdPartyContentServiceController', function ($translate, $translatePartialLoader, $rootScope, $scope,
    ThirdPartyContentService, $location) {
    $translatePartialLoader.addPart('ThirdPartyContentService');
    $translate.refresh();

    //Go home 
    $scope.GoToHome = function () {
        $location.url(sessionStorage.getItem('HomeScreen'));
    }
    $scope.NewService=function(item)
    {
        sessionStorage.setItem("ContentServiceCategoryID", item);
        if (item == 0)
        {
            sessionStorage.setItem("IsEdit", "false");
        }
        else {
            sessionStorage.setItem("IsEdit", "true");
        }
        $location.url("ThirdPartyNewContentService");
    }
    $scope.ContentServiceList = [];
    function init()
    {
        var param = {
            "categoryId": null
        }
        //Get all content service
        var GetAllContentServiceofVendor = ThirdPartyContentService.GetAllContentServiceofVendor(param);
        GetAllContentServiceofVendor.then(function (success) {  $scope.ContentServiceList = success.data.data; }, function (error) { $scope.ContentServiceList = []; });
    }
    init();
    $scope.RemoveContentService=function(item)
    {
        bootbox.confirm({
            size: "",
            title: $translate.instant('Remove Content Service'),
            message: $translate.instant('Are you sure you want to make this service Un-AVAILABLE?'), closeButton: false,
            className: "modalcustom", buttons: {
                confirm: {
                    label: $translate.instant('Yes'),
                    className: 'btn-success'
                },
                cancel: {
                    label: $translate.instant('No'),
                    className: 'btn-danger'
                }
            },
            callback: function (result) {
                if (result) {

                    var param = {
                        "id": item.id,
                        "isAvailable": false
                    };
                    var RemoveContentService = ThirdPartyContentService.RemoveContentService(param);
                    RemoveContentService.then(function (success) {
                        toastr.remove()
                        toastr.success((success.data.message !== null) ? success.data.message : "Status of content service changed successfully.", "Confirmation"); init();
                    }, function (error) {
                        toastr.remove()
                        toastr.error((error !== null) ? error.data.errorMessage : "Failed to change the status of content service.", "Error");
                    });
                }
            }
        });
        
    }
});