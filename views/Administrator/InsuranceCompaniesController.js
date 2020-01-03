angular.module('MetronicApp').controller('InsuranceCompaniesController', function ($translate, $translatePartialLoader, $rootScope, $scope, $location, $filter, InsuranceCompaniesService) {

    $translatePartialLoader.addPart('InsuranceCompanies');
    $translate.refresh();
    $scope.newCompany = false;
    $scope.StateList = [];
    $scope.Schema;
    $scope.CRN;
    $scope.URL;
    function init() {
        GetCompanyList();
        var param =
           {
               "isTaxRate": false,
               "isTimeZone": false
           }
        var GetState = InsuranceCompaniesService.GetState(param);
        GetState.then(function (success) {
            $scope.StateList = success.data.data;
        }, function (error) {
            toastr.remove();
            toastr.error(((error.data !== null) ? error.data.errorMessage : "No state found"), "Error");
        });
        var GetRole = InsuranceCompaniesService.GetRole();
        GetRole.then(function (success) {
            $scope.RoleList = success.data.data;
        }, function (error) {
            toastr.remove();
            toastr.error(((error.data !== null) ? error.data.errorMessage : "No state found"), "Error");
        });


    };
    init();
    function GetCompanyList() {
        $(".page-spinner-bar").removeClass("hide");
        var GetCompanies = InsuranceCompaniesService.GetCompanies();
        GetCompanies.then(function (success) {
            $(".page-spinner-bar").addClass("hide");
            $scope.ComapnyList = success.data.data;
        }, function (error) {
            toastr.remove(); $(".page-spinner-bar").addClass("hide");
            toastr.error(((error.data !== null) ? error.data.errorMessage : "No state found"), "Error");
        });
    }
    $scope.Cancel = function (flag) {
        $scope.newCompany = flag;
        $scope.HasLogo = false;

    };

    $scope.SelectLogo = function () {
        angular.element('#CompanyLogoUpload').trigger('click');
        $scope.HasLogo = false;
    };

    $scope.CompanyLogo = [];
    $scope.ImageLogo = [];
    $scope.CompanyLogoPath = "assets/global/img/no-image.png";
    $scope.getLogoDetails = function (e) {
        $scope.ImageLogo = [];
        var files = e.files;
        $scope.CompanyLogo = [];
        var file = files[0];
        var reader = new FileReader();
        reader.file = file;
        reader.fileName = file.name;
        reader.fileType = file.type;
        reader.fileExtension = file.name.substr(file.name.lastIndexOf('.'));
        reader.onload = $scope.imageIsLoaded;
        reader.readAsDataURL(file);
        $scope.CompanyLogo.push(file);

    };

    $scope.imageIsLoaded = function (e) {
        $scope.$apply(function () {
            $scope.ImageLogo.push({ "FileName": e.target.fileName, "FileExtension": e.target.fileExtension, "FileType": e.target.fileType, "Image": e.target.result, "File": e.target.file })
        });

    };
    //Go home 
    $scope.GoToHome = function () {
        $location.url(sessionStorage.getItem('HomeScreen'));
    }
    $scope.ShowNewCompany = function (flag) {
        $scope.companyDetails = {};
        $scope.ImageLogo = [];
        $scope.CompanyForm.$setUntouched();
        $scope.newCompany = flag; $scope.HasLogo = false;
    };
    $scope.companyDetails = {};
    $scope.saveCompany = saveCompany;
    function saveCompany() {
        if ($scope.companyDetails.id != null && angular.isDefined($scope.companyDetails.id)) {
            var data = new FormData();
            var fileslist = [];
            angular.forEach($scope.ImageLogo, function (item) {
                fileslist.push({
                    "fileName": item.FileName,
                    "fileType": item.FileType,
                    "extension": item.FileExtension,
                    "filePurpose": "COMPANY",
                    "latitude": null,
                    "longitude": null
                });
                data.append("file", item.File);
            });
            data.append("filesDetails", JSON.stringify(fileslist));
            var companyDetails = {
                "id": $scope.companyDetails.id,
                "companyName": $scope.companyDetails.companyName,
                "companyPhoneNumber": $scope.companyDetails.companyPhoneNumber.replace(/[^0-9]/g, ''),
                "fax": $scope.companyDetails.fax.replace(/[^0-9]/g, ''),
                "active": true,
                "adminDetails": {
                    "id": $scope.companyDetails.adminDetails.id,
                    "email": $scope.companyDetails.adminDetails.email,
                    "eveningTimePhone": $scope.companyDetails.adminDetails.eveningTimePhone.replace(/[^0-9]/g, ''),
                    "firstName": $scope.companyDetails.adminDetails.firstName,
                    "lastName": $scope.companyDetails.adminDetails.lastName,
                    "isActive": true,
                    "roles": [
                      {
                          "id": $scope.companyDetails.adminDetails.roles.id
                      }
                    ]

                },
                "companyAddress": {
                    "id": $scope.companyDetails.companyAddress.id,
                    "city": $scope.companyDetails.companyAddress.city,
                    "state": {
                        "id": $scope.companyDetails.companyAddress.state.id,
                        "state": null
                    },
                    "streetAddressOne": $scope.companyDetails.companyAddress.streetAddressOne,
                    "streetAddressTwo": $scope.companyDetails.companyAddress.streetAddressTwo,
                    "zipcode": $scope.companyDetails.companyAddress.zipcode
                }
            }
            data.append("companyDetails", JSON.stringify(companyDetails));

            var SaveCompany = InsuranceCompaniesService.UpdateAdminCompany(data);
            SaveCompany.then(function (success) {
                toastr.remove(); GetCompanyList();
                toastr.success(((success.data !== null) ? success.data.message : "Company details updated successfully."), "Confiramtion");
                $scope.newCompany = false; $scope.companyDetails = {};
            },
            function (error) {
                toastr.remove();
                toastr.error(((error.data !== null) ? error.data.errorMessage : "Failed to update the details. please try again."), "Error");
            });
        }
        else {

            //var data = new FormData();
            //var fileslist = [];
            //angular.forEach($scope.ImageLogo, function (item) {
            //    fileslist.push({
            //        "fileName": item.FileName,
            //        "fileType": item.FileType,
            //        "extension": item.FileExtension,
            //        "filePurpose": "COMPANY",
            //        "latitude": null,
            //        "longitude": null
            //    });
            //    data.append("file", item.File);
            //});
            //data.append("filesDetails", JSON.stringify(fileslist));
            //var companyDetails = {
            //    "companyName": $scope.companyDetails.companyName,
            //    "companyPhoneNumber": $scope.companyDetails.companyPhoneNumber,
            //    "companyWebsite": $scope.companyDetails.companyWebsite,
            //    "fax": $scope.companyDetails.fax,
            //    "defaultTimeZone": $scope.companyDetails.defaultTimeZone,
            //    "active": true,
            //    "adminDetails": {
            //        "email": $scope.companyDetails.adminDetails.email,
            //        "eveningTimePhone": $scope.companyDetails.adminDetails.eveningTimePhone,
            //        "firstName": $scope.companyDetails.adminDetails.firstName,
            //        "lastName": $scope.companyDetails.adminDetails.lastName,
            //        "isActive": true,
            //        "roles": [
            //          {
            //              "id": $scope.companyDetails.adminDetails.roles.id
            //          }
            //        ]
            //    },
            //    "companyAddress": {
            //        "city": $scope.companyDetails.companyAddress.city,
            //        "state": {
            //            "id": $scope.companyDetails.companyAddress.state.id,
            //            "state": null
            //        },
            //        "streetAddressOne": $scope.companyDetails.companyAddress.streetAddressOne,
            //        "streetAddressTwo": $scope.companyDetails.companyAddress.streetAddressTwo,
            //        "zipcode": $scope.companyDetails.companyAddress.zipcode
            //    }
            //}
            //data.append("companyDetails", JSON.stringify(companyDetails));

            //var SaveNewCompany = InsuranceCompaniesService.SaveNewCompany(data);
            //SaveNewCompany.then(function (success) {
            //    toastr.remove(); GetCompanyList();
            //    toastr.success(((success.data !== null) ? success.data.message : "Company added successfully."), "Confiramtion");
            //    $scope.newCompany = false; $scope.companyDetails = {};
            //},
            //function (error) {
            //    toastr.remove();
            //    toastr.error(((error.data !== null) ? error.data.errorMessage : "No state found"), "Error");
            //});

            //-----------------------------Newly added API to create company database schema---------------------------------------------------------------------
            //Step1 → Service for create company and add company information to configuration XML file

            var param = {
                "id": null,
                "name": $scope.companyDetails.companyName,
                "url": $scope.companyDetails.companyWebsite
            };
             
            var Configuration = InsuranceCompaniesService.ConfigureCompany(param);
            Configuration.then(function (success) {
                $scope.Schema = success.data.data.schema;
                $scope.CRN = success.data.data.crn;
                $scope.URL = success.data.data.url;
                 
                $scope.CreateSchema();
            },
            function (error) {
                toastr.remove();
                toastr.error(((error.data !== null) ? error.data.errorMessage : "Configuration Error"), "Error");
            });
        }
    }

    //Step2 → Service for create schema for company.
    $scope.CreateSchema = CreateSchema;
    function CreateSchema() {

        var param = {
            "url": $scope.URL,
            "schema": $scope.Schema,
            "crn": $scope.CRN
        };

        var CreateSchema = InsuranceCompaniesService.CreateSchema(param);
        CreateSchema.then(function (success) {
             
            $scope.CreateSchemaTables();
        },
        function (error) {
            toastr.remove();
            toastr.error(((error.data !== null) ? error.data.errorMessage : "Configuration Error"), "Error");
        });
    };

    //Step3 → Service for create tables for given schema .
    $scope.CreateSchemaTables = CreateSchemaTables;
    function CreateSchemaTables() {
        var param = {
            "url": $scope.URL,
            "schema": $scope.Schema,
            "crn": $scope.CRN
        };

        var CreateTables = InsuranceCompaniesService.CreateSchemaTables(param);
        CreateTables.then(function (success) {
             
            $scope.AddMasterData();
        },
        function (error) {
            toastr.remove();
            toastr.error(((error.data !== null) ? error.data.errorMessage : "Configuration Error"), "Error");
        });
    };


    //Step4 → Service for push master data to given schema database.
    $scope.AddMasterData = AddMasterData;
    function AddMasterData() {
        var param = {
            "url": $scope.URL,
            "schema": $scope.Schema,
            "crn": $scope.CRN
        };

        var AddData = InsuranceCompaniesService.AddDataToTables(param);
        AddData.then(function (success) {
             
            $scope.AddCompanyDetails();
        },
        function (error) {
            toastr.remove();
            toastr.error(((error.data !== null) ? error.data.errorMessage : "Configuration Error"), "Error");
        });
    };

    //Step5 → Service for push company details in company schema table with add admin insurace company role.
    $scope.AddCompanyDetails = AddCompanyDetails;
    function AddCompanyDetails() {
        var ParamCompany =
            {
                "url": $scope.companyDetails.companyWebsite,
                "schema": $scope.Schema,
                "crn": $scope.CRN,
                "adminEmail": $scope.companyDetails.adminDetails.email,
                "adminFirstName": $scope.companyDetails.adminDetails.firstName,
                "adminLastName": $scope.companyDetails.adminDetails.lastName,
                "adminDOB": "1993-09-14",
                "adminCellPhone": $scope.companyDetails.adminDetails.eveningTimePhone,
                "adminDayTimePhone": $scope.companyDetails.adminDetails.eveningTimePhone,
                "adminEveningTimePhone": $scope.companyDetails.adminDetails.eveningTimePhone
            };
        var AddCompanyData = InsuranceCompaniesService.AddCompanyDetails(ParamCompany);
        AddCompanyData.then(function (success) {
             
        },
        function (error) {
            toastr.remove();
            toastr.error(((error.data !== null) ? error.data.errorMessage : "Configuration Error"), "Error");
        });
    };


    $scope.HasLogo = false;
    $scope.EditCompanyAdminDetails = EditCompanyAdminDetails;
    function EditCompanyAdminDetails(item) {
        $scope.ImageLogo = [];
        $(".page-spinner-bar").removeClass("hide");
        var paramComany = {
            "id": item
        };
        var GetCompany = InsuranceCompaniesService.GetCompanyDetails(paramComany);
        GetCompany.then(function (success) {
            $scope.newCompany = true;
            $(".page-spinner-bar").addClass("hide");
            $scope.companyDetails = success.data.data;
            if ($scope.companyDetails !== null) {
                $scope.companyDetails.companyPhoneNumber = $filter('tel')($scope.companyDetails.companyPhoneNumber);
                $scope.companyDetails.fax = $filter('tel')($scope.companyDetails.fax);
                $scope.ImageLogo = [];
                if ($scope.companyDetails.companyLogo !== null) {
                    $scope.HasLogo = true;
                }
                else
                    $scope.HasLogo = false;
                if (angular.isDefined($scope.companyDetails.adminDetails) && $scope.companyDetails.adminDetails !== null) {
                    $scope.companyDetails.adminDetails.eveningTimePhone = $filter('tel')($scope.companyDetails.adminDetails.eveningTimePhone);
                    if ($scope.companyDetails.adminDetails.roles !== null && angular.isDefined($scope.companyDetails.adminDetails.roles)) {
                        $scope.companyDetails.adminDetails.roles.id = $scope.companyDetails.adminDetails.roles[0].id;
                    }
                }
            }
        }, function (error) {
            $scope.newCompany = false; $(".page-spinner-bar").addClass("hide");
            toastr.remove();
            toastr.error(((error.data !== null) ? error.data.errorMessage : "Some thing went wrong. please try again."), "Error");
        });
    }

    $scope.sortKey = "activeSince";
    $scope.reverse = true;
    $scope.sort = function (keyname) {
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }
});