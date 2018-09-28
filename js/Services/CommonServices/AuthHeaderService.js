angular.module('MetronicApp').service('AuthHeaderService', ['$http', '$rootScope', function ($http, $rootScope) {
   
    //To set all configuration settings
    var ConfigSettings = {};
    function GetData() {
        var MarkUpPercentageList = GetmarkUpPercentage();
        MarkUpPercentageList.then(function (success) {
            ConfigSettings = success.data.data;
            sessionStorage.setItem("apiurl", ConfigSettings.serverAddress + "" + ConfigSettings.apiurl);
            sessionStorage.setItem("receipturl", ConfigSettings.serverAddress + "" + ConfigSettings.receipturl);
            sessionStorage.setItem("ExportUrl", ConfigSettings.serverAddress + "" + ConfigSettings.ExportUrl);
            sessionStorage.setItem("Xoriginator", ConfigSettings.Xoriginator);
            sessionStorage.setItem("VendorDetailsTemplate", ConfigSettings.VendorDetailsTemplate);
            sessionStorage.setItem("claimProfile", ConfigSettings.claimProfile);
            sessionStorage.setItem("PolicyholderAppListURL", ConfigSettings.PolicyholderAppListURL);
        }, function (error) { ConfigSettings = {}; });
    };
    function GetmarkUpPercentage() {
        return $http.get('Config/Configuration.json');
    };
    GetData();
  
    // ArtigemRS-FI_Vendor 
    this.getHeader = function () {
        return {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "X-Auth-Token": sessionStorage.getItem("AccessToken"),           
            "X-originator": sessionStorage.getItem("Xoriginator")
        }
    };
    this.getHeaderWithoutToken = function () {
        return {
            "Content-Type": "application/json",
            "Accept": "application/json",           
            "X-originator": sessionStorage.getItem("Xoriginator")
        }
    };
    this.getFileHeader = function () {
        return {
            'Content-Type': undefined,
            "X-Auth-Token": sessionStorage.getItem("AccessToken"),        
            "X-originator": sessionStorage.getItem("Xoriginator")

        }
    };
    this.getWithoutOriginatorHeader = function () {
        return {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "X-Auth-Token": sessionStorage.getItem("AccessToken")
         
        }
    };
    this.getApiURL = function () {      
        var apiurl = sessionStorage.getItem("apiurl");
        return apiurl;
    };
    this.getReceiptURL = function () {      
        var receipturl = sessionStorage.getItem("receipturl");
        return receipturl;
    };
    this.getExportUrl = function () {  
        var ExportUrl = sessionStorage.getItem("ExportUrl");
        return ExportUrl;
    };
    this.genericErrorMessage = function () {
        return "Server Error : Cannot fetch the details from server. Please try again"
    };

   
 
    this.getMarkUpPercentageFileName=function(){
        return "js/Services/CommonServices/MarkUpPercentage.json";
    }
   
}]);
