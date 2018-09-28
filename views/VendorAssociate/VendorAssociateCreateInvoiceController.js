angular.module('MetronicApp').controller('VendorAssociateCreateInvoiceController', function ($rootScope, $filter, $uibModal, $scope, settings, $http, $timeout, $location, $translate, $translatePartialLoader, VendorAssociateInvoiceDetailsService) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });

    //set language
    $translatePartialLoader.addPart('VendorAssociateCreateInvoice');
    $translate.refresh();
    $scope.pagesize = 5;
    $scope.StateList = [];
    $scope.SelectedItems = [];
    $scope.SubTotal = null;
    $scope.Tax = null;
    $scope.GrandTotal = null;
    $scope.VendorInvoiceDetails = { invoiceDetails: {}, billingAddress: { state: {} }, shippingAddress: { state: {} }, vendorRemitAddress: { state: {} }, InvoiceItems: [] };
    $scope.commonobject = {};
    $scope.SelectedItemForInvoice = [];
    $scope.CheckAll = false;
    function init() {
        $scope.commonobject = JSON.parse(sessionStorage.getItem("ClaimDetailsForInvoice"));
        $scope.VendorInvoiceDetails.claimNumber = $scope.commonobject.ClaimNoForInvice;
        $scope.VendorInvoiceDetails.invoiceDetails.currency = "USD";
        $scope.VendorInvoiceDetails.invoiceDetails.taxRate = $scope.commonobject.taxRate;
        $scope.VendorInvoiceDetails.invoiceDetails.createDate = $filter('TodaysDate')();
        //get StateList  
        var stateparam =
           {
               "isTaxRate": false,
               "isTimeZone": false
           };

        var getstate = VendorAssociateInvoiceDetailsService.getStates(stateparam);
        getstate.then(function (success) { $scope.StateList = success.data.data; }, function (error) { });
      
        //Get Vendor Details
        var ParamId = {
            "vendorId": sessionStorage.getItem("VendorId")
        };
        var getVendorDetails = VendorAssociateInvoiceDetailsService.getVendorDetails(ParamId);
        getVendorDetails.then(function (success) {
            $scope.VendorDetails = success.data.data;
            
            if ($scope.VendorDetails.billingAddress.streetAddressOne == null) {
                $scope.VendorDetails.billingAddress.streetAddressOne = $scope.VendorDetails.billingAddress.streetAddressTwo;
                $scope.VendorDetails.billingAddress.streetAddressTwo = null;
            }

            if ($scope.VendorDetails.shippingAddress.streetAddressOne == null) {
                $scope.VendorDetails.shippingAddress.streetAddressOne = $scope.VendorDetails.shippingAddress.streetAddressTwo;
                $scope.VendorDetails.shippingAddress.streetAddressTwo = null;
            }
            $scope.VendorInvoiceDetails.name = $scope.VendorDetails.vendorName;
            $scope.VendorInvoiceDetails.billingAddress = $scope.VendorDetails.billingAddress;
            $scope.VendorInvoiceDetails.vendorRemitAddress = $scope.VendorDetails.billingAddress;
            $scope.VendorInvoiceDetails.shippingAddress = $scope.VendorDetails.shippingAddress;
        }, function (error) {
            toastr.remove();
            toastr.error(error.data.errorMessage, "Error");
        });
        //get items for invoice     
        var paramclaimno = {
            "claimNumber": $scope.commonobject.ClaimNoForInvice
        };
        var itemlist = VendorAssociateInvoiceDetailsService.GetItemList(paramclaimno);
        itemlist.then(function (success) {
            var valuedItem = $filter('filter')(success.data.data, { claimItem: { status: { id: 4 } } });
            var approvedItem = $filter('filter')(success.data.data, { claimItem: { status: { id: 5 } } });
            $scope.VendorInvoiceDetails.InvoiceItems = valuedItem.concat(approvedItem);
            
            angular.forEach($scope.VendorInvoiceDetails.InvoiceItems, function (item) {
                item.claimItem.valueOfItem = 0.00;
                item.claimItem.quantity = 0;
                item.claimItem.quotedPrice = 0.00;
                $scope.SelectedItemForInvoice.push(item.claimItem.id)
            });
            $scope.CheckAll = true;
        }, function (error) { });

    }
    init();

    function CalculateTotal() {
        //$scope.GrandTotal = 0;
        //$scope.SubTotal = 0;
        //angular.forEach($scope.SelectedItemForInvoice, function (item) {
        //    angular.forEach($scope.VendorInvoiceDetails.InvoiceItems, function (list) {
        //        if (item === list.claimItem.id) {
        //            $scope.SubTotal += list.claimItem.valueOfItem;
        //        }
        //    });
        //});
        //if ($scope.VendorInvoiceDetails.invoiceDetails.taxRate > 0) {
        //    $scope.GrandTotal = $scope.SubTotal + parseFloat(($scope.SubTotal * ($scope.VendorInvoiceDetails.invoiceDetails.taxRate / 100)).toFixed(2));
        //    $scope.GrandTotal = $scope.GrandTotal.toFixed(2);
        //}
        //else
        //    $scope.GrandTotal = $scope.SubTotal.toFixed(2);

        $scope.GrandTotal = 0;
        $scope.SubTotal = 0;
        angular.forEach($scope.SelectedItemForInvoice, function (item) {
            angular.forEach($scope.VendorInvoiceDetails.InvoiceItems, function (list) {
                if (item === list.claimItem.id) {
                    $scope.SubTotal += parseFloat(list.claimItem.quantity) * parseFloat(list.claimItem.quotedPrice);
                    $scope.GrandTotal += list.claimItem.valueOfItem;
                    angular.forEach(list.claimItem.servicesCost, function (cost) {
                        if ((angular.isDefined(cost.quantity) && angular.isDefined(cost.rate)) && (cost.quantity !== null && cost.rate !== null)) {
                            var total = parseInt(cost.quantity) * parseFloat(cost.rate);
                            $scope.SubTotal += parseFloat(total);
                            $scope.GrandTotal += parseFloat(cost.amount);

                        }
                    });


                }
            });
        });
    }

    //File Upload
    $scope.AddAttachment = function () {
        angular.element('#FileUpload').trigger('click');
    }
    $scope.InvoiceList = [];
    $scope.getInvoiceFileDetails = function (e) {
        $scope.$apply(function () {
            var files = event.target.files;
            $scope.filed = event.target.files;
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                var reader = new FileReader();
                reader.file = file;
                reader.fileName = files[i].name;
                reader.fileType = files[i].type;
                reader.fileExtension = files[i].name.substr(files[i].name.lastIndexOf('.'));
                reader.onload = $scope.LoadFileInList;
                reader.readAsDataURL(file);
            }
        });
    };
    $scope.LoadFileInList = function (e) {
        $scope.$apply(function () {
            $scope.InvoiceList.push(
                {
                    "FileName": e.target.fileName, "FileExtension": e.target.fileExtension, "FileType": e.target.fileType,
                    "Image": e.target.result, "File": e.target.file
                })
        });
    }
    //End File Upload

    //Select item for invoice
    $scope.AddToinvoiceList = AddToinvoiceList;
    function AddToinvoiceList(item) {
        if ($scope.SelectedItemForInvoice === null) {
            $scope.SelectedItemForInvoice.push(item.claimItem.id);
            CalculateTotal();
        }
        else {
            var indexofItem = $scope.SelectedItemForInvoice.indexOf(item.claimItem.id);
            if (indexofItem > -1)

            { $scope.CheckAll = false; $scope.SelectedItemForInvoice.splice(indexofItem, 1); CalculateTotal(); }
            else
            {
                $scope.SelectedItemForInvoice.push(item.claimItem.id); CalculateTotal();
                if ($scope.SelectedItemForInvoice.length === $scope.VendorInvoiceDetails.InvoiceItems.length) {
                    $scope.CheckAll = true;
                }

            }
        }
    }

    $scope.GetIsChecked = function (item) {
        if ($scope.SelectedItemForInvoice.indexOf(item.claimItem.id) > -1)
            return true;
        else
            return false;
    }

    $scope.SelectAll = function () {
        if ($scope.CheckAll) {
            $scope.SelectedItemForInvoice = [];
            angular.forEach($scope.VendorInvoiceDetails.InvoiceItems, function (item) {
                $scope.SelectedItemForInvoice.push(item.claimItem.id);
            });
            CalculateTotal();
            $scope.CheckAll = true;
        }
        else {
            $scope.SelectedItemForInvoice = [];
            $scope.GrandTotal = 0;
            $scope.SubTotal = 0;
            $scope.CheckAll = false;
        }
    };
    //End select item for invoice

    //CreateNew invoice
    $scope.createInvoice = createInvoice;
    function createInvoice() {

        var count = 0;
        angular.forEach($scope.VendorInvoiceDetails.InvoiceItems, function (invoiceitem) {

            if (angular.isUndefined(invoiceitem.claimItem.servicesCost) || invoiceitem.claimItem.servicesCost.length == 0)
                count++;
        });

        if (count > 0) {
            toastr.remove();
            toastr.warning("Please select service for item", "Warning");
            return;
        }
        else {
            
            var paramInvoice = new FormData();
            var ItemListForInvoiceSubmit = [];
            angular.forEach($scope.SelectedItemForInvoice, function (item) {
                angular.forEach($scope.VendorInvoiceDetails.InvoiceItems, function (invoiceitem) {
                    var SelectedServices = [];
                    if (invoiceitem.claimItem.id === item) {
                        //selecting services
                        if (angular.isDefined(invoiceitem.claimItem.servicesCost) && invoiceitem.claimItem.servicesCost != null) {

                            angular.forEach(invoiceitem.claimItem.servicesCost, function (cost) {
                                SelectedServices.push({
                                    "id": cost.serviceId,
                                    "name": cost.name,
                                    "tax": cost.salesTax,
                                    "amount": parseInt(cost.amount),
                                    "rate": cost.rate,
                                    "quantity": cost.quantity
                                });
                            });

                        }
                        
                        ItemListForInvoiceSubmit.push(
                            {
                                "id": invoiceitem.claimItem.id,
                                "amount": invoiceitem.claimItem.valueOfItem,
                                "description": invoiceitem.claimItem.description,
                                "itemName": invoiceitem.claimItem.itemName,
                                "taxRate": $scope.VendorInvoiceDetails.invoiceDetails.taxRate,
                                "unitPrice": invoiceitem.claimItem.quotedPrice,
                                "units": invoiceitem.claimItem.quantity,
                                "services": ((SelectedServices.length > 0) ? SelectedServices : null)
                            }
                            );
                    }
                });
            });
            
            var details = {
                "description": $scope.VendorInvoiceDetails.invoiceDetails.vendorNote,
                "subTotal": $scope.SubTotal,
                "taxRate": $scope.VendorInvoiceDetails.invoiceDetails.taxRate,
                "grandTotal": $scope.GrandTotal,
                "claimNumber": $scope.VendorInvoiceDetails.claimNumber,
                "dueDate": $filter('DatabaseDateFormatMMddyyyy')($scope.VendorInvoiceDetails.invoiceDetails.dueDate),//"2016-08-04T00:00:00Z",
                "paymentTermDetails": {
                    "id": 2
                },
                "currencyDetails": "USD",
                "claimedItems": ItemListForInvoiceSubmit,
                "remitAddress": {
                    "streetAddressOne": $scope.VendorInvoiceDetails.vendorRemitAddress.streetAddressOne,
                    "streetAddressTwo": $scope.VendorInvoiceDetails.vendorRemitAddress.streetAddressTwo,
                    "city": $scope.VendorInvoiceDetails.vendorRemitAddress.city,
                    "state": {
                        "id": $scope.VendorInvoiceDetails.shippingAddress.state.id
                    },
                    "zipcode": $scope.VendorInvoiceDetails.vendorRemitAddress.zipcode
                },
                "billingAddress": {
                    "streetAddressOne": $scope.VendorInvoiceDetails.billingAddress.streetAddressOne,
                    "streetAddressTwo": $scope.VendorInvoiceDetails.billingAddress.streetAddressTwo,
                    "city": $scope.VendorInvoiceDetails.billingAddress.city,
                    "state": {
                        "id": $scope.VendorInvoiceDetails.billingAddress.state.id
                    },
                    "zipcode": $scope.VendorInvoiceDetails.billingAddress.zipcode
                },
                "shippingAddress": {
                    "streetAddressOne": $scope.VendorInvoiceDetails.shippingAddress.streetAddressOne,
                    "streetAddressTwo": $scope.VendorInvoiceDetails.shippingAddress.streetAddressTwo,
                    "city": $scope.VendorInvoiceDetails.shippingAddress.city,
                    "state": {
                        "id": $scope.VendorInvoiceDetails.shippingAddress.state.id
                    },
                    "zipcode": $scope.VendorInvoiceDetails.shippingAddress.zipcode
                }
            };
            paramInvoice.append("invoiceDetails", JSON.stringify(details));
            if ($scope.InvoiceList.length > 0) {
                var filesDetails = [];
                angular.forEach($scope.InvoiceList, function (item) {
                    filesDetails.push({
                        "fileName": item.FileName, "fileType": item.FileType, "extension": item.FileExtension,
                        "filePurpose": "INVOICE"
                    });
                    paramInvoice.append("file", item.File)
                });
                paramInvoice.append("filesDetails", JSON.stringify(filesDetails));
            }
            else {
                paramInvoice.append("filesDetails", null);
                paramInvoice.append("file", null);
            }

            var AddInvoice = VendorAssociateInvoiceDetailsService.CreateInvoice(paramInvoice);
            AddInvoice.then(function (success) {
                if (success.data.status === 200) {
                    toastr.remove();
                    toastr.success(success.data.message, "Confirmation");
                    $scope.GoBack();
                }
            }, function (error) {
                toastr.remove()
                toastr.error(error.data.errorMessage, "Error");
            });
        }
       
    }

    //Back to claim details
    $scope.GoBack = GoBack;
    function GoBack() {
        sessionStorage.setItem("ClaimDetailsForInvoice", "");
        $location.url('VendorAssociateClaimDetails');
    }
    $scope.goToDashboard = function () {
        $location.url('VendorAssociateDashboard');
    }

    $scope.CalculateItemValue = CalculateItemValue;
    function CalculateItemValue(rowindex) {
        //$scope.VendorInvoiceDetails.InvoiceItems[rowindex].claimItem.valueOfItem = ($scope.VendorInvoiceDetails.InvoiceItems[rowindex].claimItem.quantity * $scope.VendorInvoiceDetails.InvoiceItems[rowindex].claimItem.quotedPrice);
        //if ($scope.VendorInvoiceDetails.InvoiceItems[rowindex].claimItem.quantity > 0 && $scope.VendorInvoiceDetails.InvoiceItems[rowindex].claimItem.quotedPrice)
        //    CalculateTotal();
        $scope.VendorInvoiceDetails.InvoiceItems[rowindex].claimItem.valueOfItem = ($scope.VendorInvoiceDetails.InvoiceItems[rowindex].claimItem.quantity * $scope.VendorInvoiceDetails.InvoiceItems[rowindex].claimItem.quotedPrice);
        if ($scope.VendorInvoiceDetails.InvoiceItems[rowindex].claimItem.quantity > 0 && $scope.VendorInvoiceDetails.InvoiceItems[rowindex].claimItem.quotedPrice > 0) {
            if ($scope.VendorInvoiceDetails.invoiceDetails.taxRate !== null && angular.isDefined($scope.VendorInvoiceDetails.invoiceDetails.taxRate)) {

                var total = 0;
                total = ((parseFloat($scope.VendorInvoiceDetails.InvoiceItems[rowindex].claimItem.valueOfItem) / 100) * $scope.VendorInvoiceDetails.invoiceDetails.taxRate);
                $scope.VendorInvoiceDetails.InvoiceItems[rowindex].claimItem.valueOfItem = total + $scope.VendorInvoiceDetails.InvoiceItems[rowindex].claimItem.valueOfItem;
            }
        }

        CalculateTotal();
    };

    $scope.CalculateServiceValue = CalculateServiceValue;
    function CalculateServiceValue(servicecosatDetails) {

        if (parseInt(servicecosatDetails.quantity) > 0 && parseInt(servicecosatDetails.rate) > 0) {
            servicecosatDetails.amount = parseInt(servicecosatDetails.quantity) * parseFloat(servicecosatDetails.rate);
            if (parseFloat(servicecosatDetails.salesTax) > 0 && servicecosatDetails.salesTax !== null) {
                var Total = (parseFloat(servicecosatDetails.amount) / 100) * (parseFloat(servicecosatDetails.salesTax));

                servicecosatDetails.amount += Total;
            }


            CalculateTotal();
        };

    };

    //Selete Services in item
    $scope.ShowSelectService = ShowSelectService;
    function ShowSelectService(item) {
       
        if (angular.isDefined(item.claimItem.servicesCost) && (item.claimItem.servicesCost !== null)) {
            $scope.AddServcies(item);
        }
        else
            item.claimItem.servicesCost = [];
    };

    $scope.AddServcies = AddServcies;
    function AddServcies(item) {
        var ObjInvoice = {
            CategoryId: item.claimItem.category.id,
            CategoryName: item.claimItem.category.name,
            ServiceCostList: item.claimItem.servicesCost,
            VendorProvidedServices: item.claimItem.vendorRequestedServices
        };
        $scope.animationsEnabled = true;
        var out = $uibModal.open(
            {
                animation: $scope.animationsEnabled,
                templateUrl: "views/AddServiceForInvoice/AddServiceForInvoice.html",
                controller: "AddServiceForInvoiceController",
                resolve:
                {
                    ObjInvoice: function () {
                        return ObjInvoice;
                    }
                }
            });
        out.result.then(function (value) {
            //Call Back Function success  
            if (angular.isDefined(value)) {
                if (value.length == 0) {
                    item.claimItem.servicesCost = [];
                }
                else {
                    if (item.claimItem.servicesCost.length == 0 || item.claimItem.servicesCost === null) {
                        angular.forEach(value, function (objValue) {

                            item.claimItem.servicesCost.push(objValue);
                        })
                    }
                    else {
                        item.claimItem.servicesCost = [];
                        angular.forEach(value, function (objValue) {

                            item.claimItem.servicesCost.push(objValue);
                        })
                    }
                }

            }
        }, function () {
        });
        return {
            open: open
        };
    }
    //Delete from service request rows.
    $scope.DeleteServiceItem = function (item, index) {
        item.splice(index, 1);
    }
});