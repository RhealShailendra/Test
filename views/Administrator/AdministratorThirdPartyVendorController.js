angular.module('MetronicApp').controller('AdministratorThirdPartyVendorController', function ($rootScope, $log, $scope,
    settings, $http, $timeout, $location, $translate, $translatePartialLoader, AdministratorThirdPartyVendorService) {
   
   
   
    //set language
    $translatePartialLoader.addPart('AdminThirdPartyVendor');
    $translate.refresh();
    $scope.pagesize = "10";
    $scope.Vendors = "";

    function init()
    {
        //get list if all vendors API #186
       
        var getpromise = AdministratorThirdPartyVendorService.getVendorsList();
        getpromise.then(function (success) {
            
            $scope.Vendors = success.data.data;

        }, function (error) {
            $scope.ErrorMessage = error.data.errorMessage;
        });
    }

    init();
  
    // sort data
    $scope.sort = function (keyname) {
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }

    //Open confirm dialog
    $scope.openConfirmDialog = openConfirmDialog;
    function openConfirmDialog(e) {
        bootbox.confirm({
            size: "",
            title: "Delet Lost/Damaged Item ",
            closeButton: false,
            message: "Are you sure you want to delete this item?  <b>Please Confirm!",
            className: "modalcustom", buttons: {
                confirm: {
                    label: 'Yes',
                    className: 'btn-success'
                },
                cancel: {
                    label: 'No',
                    className: 'btn-danger'
                }
            },
            callback: function (result) {
                //if (result)  call delet function
            }
        });

    }

   

    //Invite third party vendor
    $scope.InviteVendor = InviteVendor;
    function InviteVendor() {
       
    };
    $scope.NewVendor = NewVendor;
    function NewVendor()
    {
        $location.url('InviteThirdPartyVendor');
    }

    //Edit supplier
    $scope.editSupplier = editSupplier;
    function editSupplier() {
        $location.url('EditThirdPartyVendor');
    }
});