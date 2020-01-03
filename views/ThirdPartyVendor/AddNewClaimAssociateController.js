angular.module('MetronicApp').controller('AddNewClaimAssociateController', function ($rootScope, $window, $translate, AddNewClaimAssociateService, $translatePartialLoader, $scope, settings,
    $location, $filter, AuthHeaderService, $timeout) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });
    $translatePartialLoader.addPart('AddNewClaimAssociate');
    $translate.refresh();
    $scope.ErrorMessage = "";
    $scope.AssociatesDetails = {};
    $scope.DepartmentList = [];
    $scope.CommonObjSpecialties = [];
    $scope.IsSpeedCheckAssociate = false;
    $scope.StatusList = [{ id: true, name: "Active" }, { id: false, name: "In-Active" }]
    GetSpecialtiesList();
    init();
    function init() {   

        $timeout( function(){   }, 3000);
             
        if (sessionStorage.getItem("ClaimAssociateId") !== "" && angular.isDefined(sessionStorage.getItem("ClaimAssociateId")) && sessionStorage.getItem("ClaimAssociateId")!=null) {
            $scope.associateId = sessionStorage.getItem("ClaimAssociateId");
            var param = {
                "id": sessionStorage.getItem("ClaimAssociateId")
            };
            var AssociateList = AddNewClaimAssociateService.GetAssociateDetails(param);
            AssociateList.then(function (success) {
                $scope.AssociatesDetails = success.data.data;
                $scope.AssociatesDetails.cellPhone = $filter('tel')($scope.AssociatesDetails.cellPhone);
                $scope.AssociatesDetails.workPhone = $filter('tel')($scope.AssociatesDetails.workPhone);
            
            var existingValueArr=[];
            var specialtiesObjArr =[];
            $scope.CommonObjSpecialties=[];
           
            existingValueArr=$scope.AssociatesDetails.associateSpecialtiesDTO;
                if(existingValueArr!=undefined && existingValueArr.length>0 ){
               for(var i=0 ; i< existingValueArr.length;i++){
                var specialtiesObj = getByValue3($scope.SpecialtiesList,existingValueArr[i].item_category_id);
                specialtiesObjArr.push(specialtiesObj);
                $scope.IsSpeedCheckAssociate = true;
               }
             //  specialtiesObjArr.push(specialtiesObj);
               $scope.CommonObjSpecialties = angular.copy(specialtiesObjArr);
               window.setTimeout(function(){
                $('#Selet2For').trigger('change');
               },300);
               console.log("from api",$scope.CommonObjSpecialties);
            }
           
           
            }, function (error) {
                toastr.remove()
                if (angular.isDefined(error.data.errorMessage) && error.data.errorMessage != null)
                    toastr.error(error.data.errorMessage, $translate.instant("ErrorHeading"));
                else
                    toastr.error(AuthHeaderService.genericErrorMessage(), $translate.instant("ErrorHeading"));
            });
        }
        else {
            $scope.associateId = null;
        }
       
       
        var stateparam =
            {
                "isTaxRate": false,
                "isTimeZone": false
            };
        var AssociateList = AddNewClaimAssociateService.GetStates(stateparam);
        AssociateList.then(function (success) {
            $scope.ddlStateList = success.data.data;
        },
        function (error) {    });
        var AssociateList = AddNewClaimAssociateService.GetDesignation();
        AssociateList.then(function (success) { $scope.DesignationList = success.data.data; }, function (error) { $scope.ErrorMessage = error.data.errorMessage; });
        var param = {
            "Content-Type": "application/json"
        }
        var AssociateList = AddNewClaimAssociateService.GetEmployeeList(param);
        AssociateList.then(function (success) { $scope.ReportingMangerList = success.data.data; }, function (error) { $scope.ErrorMessage = error.data.errorMessage; });

        GetRoleList();
        GetDepartmentList();
       
    }

    $scope.GetDepartmentList = GetDepartmentList;
    function GetDepartmentList()
    {
        var addNewClaim = AddNewClaimAssociateService.GetDepartmentist();
        addNewClaim.then(function (success) {
            $scope.DepartmentList = success.data.data;            
        }, function (error) {
            toastr.remove()
            toastr.error(error.data.errorMessage, $translate.instant("ErrorHeading"));
        });
    }

$scope.updateSpecialtiesValue = function(value){
    console.log(value);
$scope.CommonObjSpecialties = value;
}

    $scope.updateRoleValue = function(value){
        if(value !== undefined){
               console.log(value);

          var isRole = true;
          if(value==1010||value==1011){
              $scope.IsSpeedCheckAssociate = true;
           }else {
          $scope.IsSpeedCheckAssociate = false;
          }
        }else{
            $scope.IsSpeedCheckAssociate = false;
        }
      };

    $scope.GetSpecialtiesList = GetSpecialtiesList;
    function GetSpecialtiesList()
    {
        var getSpecialtiesList = AddNewClaimAssociateService.GetSpecialtiesList();
        getSpecialtiesList.then(function (success) {
            $scope.SpecialtiesList = success.data.data;            
        }, function (error) {
            toastr.remove()
            toastr.error(error.data.errorMessage, $translate.instant("ErrorHeading"));
        });
    }


   

    function getByValue3(arr, value) {

        var result = [];
        var arraydata=[];
         arraydata = angular.copy($scope.SpecialtiesList);
      
        arraydata.forEach(function(o){if (o.id == value) result.push(o.id);} );
      
        return result? result[0] : null; // or undefined
      
      }

    $scope.AddNewClaimAssociate = function () {
        //  var formparam = new FormData();
        
        $scope.AssociatesDetails.cellPhone = $scope.AssociatesDetails.cellPhone.replace(/[^0-9]/g, '');
        $scope.AssociatesDetails.workPhone = $scope.AssociatesDetails.workPhone.replace(/[^0-9]/g, '');     
        var SpecialtiesList = [];

if($scope.CommonObjSpecialties!=undefined && $scope.CommonObjSpecialties!=null && $scope.CommonObjSpecialties.length>0){
       
    if($scope.IsSpeedCheckAssociate){
        angular.forEach($scope.CommonObjSpecialties, function (Specialties) {
            SpecialtiesList.push({"item_category_id":Specialties});

        });
    }else{
        $scope.CommonObjSpecialties=[];
    }
    }


        if (sessionStorage.getItem("ClaimAssociateId") != null && sessionStorage.getItem("ClaimAssociateId")!=="") {
            var formparam =new FormData();
            var param =
                {
                "id": sessionStorage.getItem("ClaimAssociateId"),
                "activeSince": $scope.AssociatesDetails.activeSince,
                "dateOfJoining": $scope.AssociatesDetails.dateOfJoining,
                 "password": null,//$scope.AssociatesDetails.password,
                "email": $scope.AssociatesDetails.email,
                "firstName": $scope.AssociatesDetails.firstName,
                "lastName": $scope.AssociatesDetails.lastName,
                "cellPhone": $scope.AssociatesDetails.cellPhone,
                "eveningTimePhone": null,
                "workPhone": $scope.AssociatesDetails.workPhone,
                "active": $scope.AssociatesDetails.active,
                "associateSpecialtiesDTO": SpecialtiesList,
                "reportingManager": {
                    "id": (angular.isDefined($scope.AssociatesDetails.reportingManager) && $scope.AssociatesDetails.reportingManager !== null) ? $scope.AssociatesDetails.reportingManager.id : null,
                    "name": null
                },
                "role": {
                    "description": null,
                    "id": $scope.AssociatesDetails.role.id,
                    "roleName": null
                },
                "designation": {
                    "id": (angular.isDefined($scope.AssociatesDetails.designation) && $scope.AssociatesDetails.designation !== null) ? $scope.AssociatesDetails.designation.id : null,
                    "name": null
                },
                "vendorDepartment": {
                    "id": (angular.isDefined($scope.AssociatesDetails.vendorDepartment) && $scope.AssociatesDetails.vendorDepartment !== null) ? $scope.AssociatesDetails.vendorDepartment.id : null,
                },
                "displayPictureDetails": ($scope.IncidentImages!=null && $scope.IncidentImages.length > 0) ? {
                    "fileType": $scope.IncidentImages[0].FileType,
                    "extension": $scope.IncidentImages[0].FileExtension,
                    "filePurpose": "PROFILE",
                    "latitude": null,
                    "longitude": null
                }:null,
            };           
            formparam.append("employeeDetails",JSON.stringify(param));
            formparam.append("file", (($scope.IncidentImages != null && $scope.IncidentImages.length > 0) ? $scope.IncidentImages[0].File : null));

            var addNewClaim = AddNewClaimAssociateService.UpdateEmployee(formparam);
            addNewClaim.then(function (success) {               

                $location.url("ClaimAssociates");
                toastr.remove()
                toastr.success(success.data.message, $translate.instant("SuccessHeading"));
            }, function (error) {               

                toastr.remove()
                toastr.error(error.data.errorMessage, $translate.instant("ErrorHeading"));
            });
           
        }
        else {
            var formparam = new FormData();
            var param =
                {
                    "id": null,
                    "activeSince": $scope.AssociatesDetails.activeSince,
                    "dateOfJoining": $scope.AssociatesDetails.dateOfJoining,
                    "password": "demo",
                    "email": $scope.AssociatesDetails.email,
                    "firstName": $scope.AssociatesDetails.firstName,
                    "lastName": $scope.AssociatesDetails.lastName,
                    "cellPhone": $scope.AssociatesDetails.cellPhone,
                    "eveningTimePhone": null,
                    "workPhone": $scope.AssociatesDetails.workPhone,
                    "active": true,
                    "reportingManager": {
                        "id": (angular.isDefined($scope.AssociatesDetails.reportingManager) && $scope.AssociatesDetails.reportingManager !== null) ? $scope.AssociatesDetails.reportingManager.id : null,
                        "name": null
                    },
                    "role": {
                        "description": null,
                        "id": $scope.AssociatesDetails.role.id,
                        "roleName": null
                    },
                    "designation": {
                        "id": (angular.isDefined($scope.AssociatesDetails.designation) && $scope.AssociatesDetails.designation !== null) ? $scope.AssociatesDetails.designation.id : null,
                        "name": null
                    },
                    "vendorDepartment": {
                        "id": (angular.isDefined($scope.AssociatesDetails.vendorDepartment) && $scope.AssociatesDetails.vendorDepartment !== null) ? $scope.AssociatesDetails.vendorDepartment.id : null,
                    },
                    "associateSpecialtiesDTO": SpecialtiesList,
                    "displayPictureDetails": ($scope.IncidentImages != null && $scope.IncidentImages.length > 0) ? {
                        "fileType": $scope.IncidentImages[0].FileType,
                        "extension": $scope.IncidentImages[0].FileExtension,
                        "filePurpose": "PROFILE",
                        "latitude": null,
                        "longitude": null
                    } : null,
                };
            formparam.append("employeeDetails", JSON.stringify(param));
            formparam.append("file", (($scope.IncidentImages != null && $scope.IncidentImages.length > 0) ? $scope.IncidentImages[0].File : null));
// two times call-----------
var addNewClaim = AddNewClaimAssociateService.UpdateEmployee(formparam);
addNewClaim.then(function (success) {          
    $scope.back();
    toastr.remove()
    toastr.success(success.data.message, $translate.instant("SuccessHeading"));
}, function (error) {          
    toastr.remove()
    if (angular.isDefined(error.data.errorMessage) && error.data.errorMessage!=null)
        toastr.error(error.data.errorMessage, $translate.instant("ErrorHeading"));
    else
        toastr.error(AuthHeaderService.genericErrorMessage(), $translate.instant("ErrorHeading"));
});
        }
        
    }
    $scope.back = function () {
        $location.url("ClaimAssociates");
    };
    $scope.RoleList;
    $scope.GetRoleList = GetRoleList;
    function GetRoleList() {

        var RoleList = AddNewClaimAssociateService.GetRoleList();
        RoleList.then(function (success) { $scope.RoleList = success.data.data; }, function (error) { $scope.ErrorMessage = error.data.errorMessage; });
    }
    $scope.GoToHome = function () {
        $location.url(sessionStorage.getItem('HomeScreen'));
    };


    //upload image
    $scope.IncidentImages = [];
    $scope.uploadImage = uploadImage;
    function uploadImage(event) {
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
            $scope.IncidentImages = [];
            $scope.IncidentImages.push({ "FileName": e.target.fileName, "FileExtension": e.target.fileExtension, "FileType": e.target.fileType, "Image": e.target.result, "File": e.target.file })
            if ($scope.AssociatesDetails.displayPicture!=null)
                $scope.AssociatesDetails.displayPicture.url = e.target.result;
            else
            {
                $scope.AssociatesDetails.displayPicture = {
                    "url":e.target.result
                }
            }
                 });
    }

    $scope.RemoveImage = RemoveImage;
    function RemoveImage(item) {

        var index = $scope.IncidentImages.indexOf(item);

        if (index > -1) {

            $scope.IncidentImages.splice(index, 1);
        }
    };
    
    //Open file upload control
    $scope.FireUploadEvent = FireUploadEvent;
    function FireUploadEvent() {
        angular.element('#FileUpload').trigger('click');
    };

    $scope.abc = false;
    $scope.Display = Display;
    function Display() {
        $scope.abc = !$scope.abc;
    };
});
