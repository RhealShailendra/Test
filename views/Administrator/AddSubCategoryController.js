angular.module('MetronicApp').controller('AddSubCategoryController', function ($translate, $translatePartialLoader, $rootScope, $log, $scope,
    settings, AddSubCategoryService, $location, SubCategoryObject) {
    $scope.items = $rootScope.items; $scope.boolValue = true;
    $translatePartialLoader.addPart('AddSubCategory');
    $translate.refresh();
    var Message;
    $scope.SubCategoryObject = SubCategoryObject;
    $scope.AddUpdateSubCategory= function () {
        var param = {};
        if (($scope.SubCategoryObject.categoryId !== null) && (angular.isDefined($scope.SubCategoryObject.categoryId))) {
            //Add new subcategory
            param = {
                "categoryId": $scope.SubCategoryObject.categoryId,
                "subCategories": [
                  {
                      "name": $scope.SubCategoryObject.name,
                      "annualDepreciation": $scope.SubCategoryObject.annualDepreciation,
                      "usefulYears": $scope.SubCategoryObject.usefulYears,
                      "description": $scope.SubCategoryObject.description
                  }]
            };
          
            var SaveSubCategory = AddSubCategoryService.NewSubCategory(param);
            SaveSubCategory.then(function (success) {
                toastr.remove();
                toastr.success(success.data.message, "Confirmation");
            }, function (error) {
                toastr.remove();
                toastr.error(error.data.errorMessage, "Error");
            });
        }
        else {
            //Update subcategory  
           
            param = {
                "id": $scope.SubCategoryObject.id,
                "name": $scope.SubCategoryObject.name,
                "annualDepreciation": $scope.SubCategoryObject.annualDepreciation,
                "usefulYears": $scope.SubCategoryObject.usefulYears,
                "description": $scope.SubCategoryObject.description
            };
            
            var SaveSubCategory = AddSubCategoryService.UpdateSubCategory(param);
            SaveSubCategory.then(function (success) {
                toastr.remove();
                toastr.success(success.data.message, "Confirmation");
            }, function (error) {
                toastr.remove();
                toastr.error(error.data.errorMessage, "Error");
            });
        }
        //Success Call Back is the value to be pass after opertion deone
        $scope.$close(Message);
    };
    $scope.cancel = function () {
        $scope.$close(Message);
    };
});