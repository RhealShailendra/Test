angular.module('MetronicApp').service('UserService', ['$rootScope', '$cookies', '$http', function ($rootScope, $cookies, $http) {
    this.initUserDetails = function (response, password, RememberMe) {
        sessionStorage.setItem("IsLogined", "true");
        $rootScope.IsLoginedUser = true;
        sessionStorage.setItem("AccessToken", response.data.token);  
        sessionStorage.setItem("UserName", response.data.email);
        sessionStorage.setItem("UserFirstName", response.data.firstName);
        sessionStorage.setItem("UserLastName", response.data.lastName);
        sessionStorage.setItem("Name", response.data.lastName + ", " + response.data.firstName);
        sessionStorage.setItem("Office", response.data.office);
        sessionStorage.setItem("UserId", response.data.userId);
        sessionStorage.setItem("DepartmentId",(angular.isDefined(response.data.departmentDetails)&& response.data.departmentDetails!==null)?response.data.departmentDetails.id:null)
        //sessionStorage.setItem("Password", password);
        sessionStorage.setItem("UserType", response.data.loggedinUserType);
        sessionStorage.setItem("CompanyId", (angular.isDefined(response.data.companyId) && response.data.companyId !== null) ? response.data.companyId : response.data.vendorDetails.registrationNumber);
        if (response.data.vendorDetails !== null && response.data.vendorDetails!==undefined)
        { sessionStorage.setItem("VendorId", response.data.vendorDetails.vendorId);
        sessionStorage.setItem("RegistrationNumber", response.data.vendorDetails.registrationNumber);
        sessionStorage.setItem("vendorName", response.data.vendorDetails.vendorName);
        }
        else
        {
            sessionStorage.setItem("VendorId", null);
            sessionStorage.setItem("RegistrationNumber", null);
        }
        if (RememberMe) {
            $cookies.put('UserName', response.data.email);
            $cookies.put('Password', password);
        }
        sessionStorage.setItem("isResetPassword", response.data.resetPassword);
        return true;
    }
    this.removeUserDetails = function () {
        sessionStorage.clear();
        $cookies.remove('UserName');
        $cookies.remove('Password');
        $rootScope.IsLoginedUser = false;       
        return true;
    }
    this.DummyData = function (Username) {
        var data = {
            "userId": 1,
            "accountStatus": true,
            "authorities": "ADMIN",
            "cellPhone": "9998887776",
            "designationId": null,
            "token": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJnYXVyYXZrQGNoZXR1LmNvbSIsImF1ZGllbmNlIjoid2ViIiwiY3JlYXRlZCI6MTUxMjM4MDI1OTQ0OCwiZXhwIjoxNTEyMzk4MjU5fQ.egoS0HkQmceZA5G40nDZCq4GAVX9KG6kYGlfdrIU6n3AfXd3kquw3VYi48boUeh77Z9PsXT6zs10y2paz3ol3Q",
            "lastLogin": "12-04-2017T05:39:21Z",
            "reportingManager": null,
            "reportingManagerId": null,
            "companyId": 1,
            "companyName": "ONE IC Corp",
            "dayTimePhone": "9998887776",
            "designation": "SYSTEM ADMIN",
            "email": Username,
            "eveningTimePhone": "9998887776",
            "faxNumber": "9998887776",
            "firstName": "User",
            "lastName": "User",
            "loggedinUserType": "COMPANY_USER",
            "memberSince": null,
            "role": [
              {
                  "roleId": 1000,
                  "roleName": "COMPANY ADMIN",
                  "permissions": [
                   
                  ]
              }
            ],
            "userName": Username,
            "branchOffice": null,
            "address": null
        };

      
         if (Username == "vendoradmin@vendor.com") {
            data.firstName = "Vendor",
                data.lastName = "Admin",
            data.role[0].roleName = "3rd Party Vendor Administrator";
        }
        else if (Username == "vendor@artigem.com") {
            data.firstName = "Vendor",
                data.lastName = "Artigem",
            data.role[0].roleName = "3rd Party Vendor Contact";
        }
        else if (Username == "associate1@artigem.com") {
            data.firstName = "Vendor",
                data.lastName = "Associate",
            data.role[0].roleName = "3rd Party Vendor Associate";
        }
        else if (Username == "shippingadmin@vendor.com") {
            data.firstName = "Shipping",
                data.lastName = "Admin",
            data.role[0].roleName = "3rd Party Shipping Administrator";
        }
        else if (Username == "accountingadmin@vendor.com") {
            data.firstName = "Account",
                data.lastName = "Manager",
            data.role[0].roleName = "3rd Party Accounting Administrator";
        }
        else if (Username == "vendormanager@vendor.com") {
            data.firstName = "Vendor",
                data.lastName = "Admin",
            data.role[0].roleName = "3rd Party Vendor Manager";
        }
        else if (Username == "saco@vendor.com") {
            data.firstName = "Sales",
                data.lastName = "Admin",
            data.role[0].roleName = "Sales Admin";
        }
       
        var d = {
            "data": data
        };
        return d;
    }
}]);