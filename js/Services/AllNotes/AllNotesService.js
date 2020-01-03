angular.module('MetronicApp').service('AllNotesService', ['$http', '$rootScope', 'AuthHeaderService', function ($http, $rootScope, AuthHeaderService) {
    this.GetNotes = function (param) {
        var response = $http({
            method: "Post",
            url: AuthHeaderService.getApiURL() + "web/claim/notes",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };
    //API#5 Service to update claim status
    this.DeleteNote = function (param) {
        var response = $http({
            method: "POST",
            url: AuthHeaderService.getApiURL() + "web/delete/note",
            data: param,
            headers: AuthHeaderService.getHeader()
        });
        return response;
    };
}]);