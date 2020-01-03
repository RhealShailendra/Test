angular.module('MetronicApp').controller('ThirdPartyCreateInvoiceController', function ($rootScope, $filter, $uibModal, $scope,$window,$state,
    $location, $translate, $translatePartialLoader, AuthHeaderService, ThirdPartyInvoiceDetailsService) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });

    //set language
    $translatePartialLoader.addPart('ThirdPartyCreateInvoice');
    $translate.refresh();
    $scope.pagesize = 5;
    $scope.StateList = [];
    $scope.SelectedItems = [];
    $scope.SubTotal = null;
    $scope.Tax = null;
    $scope.SubTotal = null;
    $scope.GrandTotal = null;
    $scope.VendorInvoiceDetails = { invoiceDetails: {}, vendor: { name: null }, vendorBillAddress: { state: {} }, shippingAddress: { state: {} }, vendorRemitAddress: { state: {} }, InvoiceItems: [] };
    $scope.AdjusterName = "";
    $scope.InsuredName = "";
    $scope.InsuranceCompanyName = "";
    $scope.BranchId = "";
    $scope.InsuranceCompanyDetails = {};
    $scope.VendorDetails = {};
    $scope.ClaimDetails = [];
    $scope.SelectedItemForInvoice = [];
    $scope.CheckAll = false;
    $scope.PaymentTerms;
    $scope.SelectedItem = [];
    $scope.SelectedLineItemForInvoice = [];
    $scope.PurchesOrderItem = [];

    function init() {
        $scope.AssociateIdValue;
        $scope.TotalPayable = 0.00;
        $scope.GrandTotal = 0.00;
        $scope.TotalSubForAllItems=0.00
        $scope.TotalSubForAllBillable=0.00
        $scope.PaymentDetails = {
            ShippCharge: 0,
            PaymentDetails: 0,
            Deductible: 0,
            AdvancePayment: 0
        };
        GetInsuranceCompanyDetails();
        GetServiceTypeList();       
        if ($scope.IsVendorContact == true) {
            $scope.AssociateIdValue = null
        }
        else {
            $scope.AssociateIdValue = sessionStorage.getItem("UserId");
        }

        if ($scope.IsEditInvoice == true) {
            $(".page-spinner-bar").removeClass("hide");
            $scope.UpdateList = [];
            $scope.VendorInvoiceDetails = $scope.InvoiceDetails;
            $scope.VendorInvoiceDetails.InvoiceItems = [];           
            angular.forEach($scope.InvoiceDetails.claimItems, function (item) {               
                $scope.VendorInvoiceDetails.InvoiceItems.push({ "claimItem": item });
            });
            angular.forEach($scope.VendorInvoiceDetails.InvoiceItems, function (item) {
                item.claimItem.servicesCost = [];
                item.claimItem.PurchaseOrderItems = [];
                angular.forEach(item.claimItem.invoiceItems, function (invoiceItem) {                    
                    if (invoiceItem.purchaseOrderItem == false && (angular.isUndefined(invoiceItem.purchaseOrder)||invoiceItem.purchaseOrder===null)) {                       
                        item.claimItem.servicesCost.push({
                            "Serviceid": invoiceItem.id,
                            "id": invoiceItem.lineItemServiceType.id,
                            "description": invoiceItem.description,
                            "quantity": invoiceItem.units,
                            "rate": invoiceItem.rate,
                            "subTotal": invoiceItem.subTotal,
                            "total": invoiceItem.total,
                            "salesTax": invoiceItem.salesTax,
                            "amount": invoiceItem.amount,
                            "markUp": invoiceItem.markup
                        })
                    }
                    else if (invoiceItem.purchaseOrderItem == true && angular.isDefined(invoiceItem.purchaseOrder)) {
                        if (invoiceItem.chargeType == "SKU") {

                            item.claimItem.PurchaseOrderItems.push({
                                OrderType: { name: invoiceItem.purchaseOrder.orderType.name }, //purchaseOrder.orderType,
                                MarkUpLimitIndicator: true,
                                purchaseOrderId: invoiceItem.purchaseOrder.purchaseOrderId,
                                item: {
                                    id: invoiceItem.replacementItem.id,
                                    Id: invoiceItem.id,
                                    sku: invoiceItem.replacementItem.sku,
                                    description: invoiceItem.description,
                                    availabeQuantity: invoiceItem.units,
                                    unitPrice: invoiceItem.rate,
                                    subTotal: invoiceItem.subTotal,
                                    total: invoiceItem.total,
                                    saleTax: invoiceItem.salesTax,
                                    markUp: invoiceItem.markup,
                                    billableAmount: invoiceItem.amount

                                }
                            });

                        }
                        else if (invoiceItem.chargeType == "LBR-FEE") {
                            item.claimItem.PurchaseOrderItems.push({
                                OrderType: { name: invoiceItem.purchaseOrder.orderType.name }, //purchaseOrder.orderType,
                                purchaseOrderId: invoiceItem.purchaseOrder.purchaseOrderId,
                                item: {
                                    id: invoiceItem.replacementItem.id,
                                    Id: invoiceItem.id,
                                    availabeQuantity: invoiceItem.units,
                                    subTotal: invoiceItem.subTotal,
                                    total: invoiceItem.total,
                                    saleTax: invoiceItem.salesTax,
                                    billableAmount: invoiceItem.amount
                                },
                                description: invoiceItem.description,
                                laborCost: (angular.isDefined(invoiceItem.rate) && invoiceItem.rate != null ? invoiceItem.rate : 0.00)
                            });
                        }
                        else if (invoiceItem.chargeType == "SHIPPING-FEE") {


                            if (invoiceItem.purchaseOrder.orderType.name == 'BIB from PH') {
                                item.claimItem.PurchaseOrderItems.push({
                                    OrderType: { name: invoiceItem.purchaseOrder.orderType.name },
                                    purchaseOrderId: invoiceItem.purchaseOrder.purchaseOrderId,
                                    item: {
                                        id: invoiceItem.replacementItem.id,
                                        Id: invoiceItem.id,
                                        description: invoiceItem.description,
                                        availabeQuantity: invoiceItem.units,
                                        subTotal: invoiceItem.subTotal,
                                        total: invoiceItem.total,
                                        saleTax: invoiceItem.salesTax,
                                        billableAmount: invoiceItem.amount
                                    },
                                    shippingCost: (angular.isDefined(invoiceItem.rate) && invoiceItem.rate != null ? invoiceItem.rate : 0.00)
                                });
                            }


                        }
                    }
                    else if (invoiceItem.purchaseOrderItem == false && (angular.isDefined(invoiceItem.purchaseOrder) && invoiceItem.purchaseOrder !== null)) {                       

                        if (invoiceItem.chargeType == "SHIPPING-FEE") {
                            if (invoiceItem.purchaseOrder.orderType.name == 'Shipment') {
                                item.claimItem.PurchaseOrderItems.push({
                                    OrderType: { name: invoiceItem.purchaseOrder.orderType.name },
                                    purchaseOrderId: invoiceItem.purchaseOrder.purchaseOrderId,
                                    item: {
                                        id: null,
                                        Id: invoiceItem.id,
                                        description:invoiceItem.description,
                                        availabeQuantity: invoiceItem.units,
                                        subTotal: invoiceItem.subTotal,
                                        total: invoiceItem.total,
                                        saleTax: invoiceItem.salesTax,
                                        billableAmount: invoiceItem.amount
                                    },
                                    shippingCost: (angular.isDefined(invoiceItem.rate) && invoiceItem.rate != null ? invoiceItem.rate : 0.00)
                                });
                            }
                        }
                    }
                });
            });
           
            angular.forEach($scope.VendorInvoiceDetails.InvoiceItems, function (InvoiceItem) {
                InvoiceItem.claimItem.SumOfSubTotal = 0.00;
                InvoiceItem.claimItem.SumOfBillableAmount = 0.00;
                angular.forEach(InvoiceItem.claimItem.servicesCost, function (serviceItem) {
                    InvoiceItem.claimItem.SumOfSubTotal += parseFloat(serviceItem.subTotal);
                    InvoiceItem.claimItem.SumOfBillableAmount += parseFloat(serviceItem.amount);
                });

                angular.forEach(InvoiceItem.claimItem.PurchaseOrderItems, function (poItem) {
                    InvoiceItem.claimItem.SumOfSubTotal += parseFloat(poItem.item.subTotal);
                    InvoiceItem.claimItem.SumOfBillableAmount += parseFloat(poItem.item.billableAmount);
                });

            });
            GetClaimDetails();
            $scope.VendorInvoiceDetails.shippingAddress = $scope.InvoiceDetails.insuredAddress;
            $scope.VendorInvoiceDetails.invoiceDetails.createDate = $filter('DateFormatMMddyyyy')($scope.VendorInvoiceDetails.invoiceDetails.createDate);
            $scope.VendorInvoiceDetails.invoiceDetails.dueDate = $filter('DateFormatMMddyyyy')($scope.VendorInvoiceDetails.invoiceDetails.dueDate);
            $scope.UpdateList = $scope.InvoiceDetails.invoiceDetails.invoiceAttachments;           
            $scope.GrandTotal = parseFloat($scope.InvoiceDetails.invoiceDetails.amount);
            $scope.PaymentDetails.Deductible = parseFloat($scope.InvoiceDetails.invoiceDetails.deductible);
            $scope.PaymentDetails.AdvancePayment = parseFloat($scope.InvoiceDetails.invoiceDetails.advancePayment);
            CalculateTotal();
            $(".page-spinner-bar").addClass("hide");
        }
        else {
            $(".page-spinner-bar").removeClass("hide");
            $scope.VendorInvoiceDetails.invoiceDetails.createDate = $filter('TodaysDate')();
            $scope.VendorInvoiceDetails.invoiceDetails.currencyDetails = "US";
            $scope.VendorInvoiceDetails.claimNumber = $scope.CommonObj.ClaimNumber;
            GetClaimDetails();
            //GetInvoiceItems();            
            GetVendorDetails();
            $scope.UpdateList = [];
        }

        //get StateList 
        var stateparam =
           {
               "isTaxRate": false,
               "isTimeZone": false
           };

        var getstate = ThirdPartyInvoiceDetailsService.getStates(stateparam);
        getstate.then(function (success) { $scope.StateList = success.data.data; }, function (error) { });
        var getPaymentTerms = ThirdPartyInvoiceDetailsService.getPaymentTerms();
        getPaymentTerms.then(function (success) {
            $scope.PaymentTerms = success.data.data;
        }, function (error) {
            toastr.remove();
            if (error.data.errorMessage != null && angualr.isDefined(error.data.errorMessage))
                toastr.error(error.data.errorMessage, "Error");
            else
                toastr.error(AuthHeaderService.genericErrorMessage(), "Error");

        });
    };
    init();
    $scope.GetInsuranceCompanyDetails = GetInsuranceCompanyDetails;
    function GetInsuranceCompanyDetails() {
        var param = {
            "claimNumber": $scope.CommonObj.ClaimNumber
        };

        var getDetails = ThirdPartyInvoiceDetailsService.GetClaimDetails(param);
        getDetails.then(function (success) {
            $scope.InsuranceCompanyDetails = success.data.data;
            $scope.VendorInvoiceDetails.vendorBillAddress =$scope.InsuranceCompanyDetails.company.officeAddress;
            $scope.VendorInvoiceDetails.shippingAddress = $scope.InsuranceCompanyDetails.policyHolder.address;
            sessionStorage.setItem("CompanyId", $scope.InsuranceCompanyDetails.company.companyId);
            $scope.AdjusterName = $scope.InsuranceCompanyDetails.adjuster.lastName + ", " + $scope.InsuranceCompanyDetails.adjuster.firstName;
            $scope.InsuredName = $scope.InsuranceCompanyDetails.policyHolder.lastName + ", " + $scope.InsuranceCompanyDetails.policyHolder.firstName;
            $scope.InsuranceCompanyName = $scope.InsuranceCompanyDetails.company.companyName;
            $scope.BranchID = 123;
           
        }, function (error) {
            toastr.remove();
            if (error.data.errorMessage != null && angular.isDefined(error.data.errorMessage)) {
                toastr.error(error.data.errorMessage, "Error")
            }
            else {
                toastr.error(AuthHeaderService.genericErrorMessage(), "Error")
            }
        });
    };

    $scope.GetClaimDetails = GetClaimDetails;
    function GetClaimDetails() {
        var param =
            {

                "claimNumber": $scope.CommonObj.ClaimNumber
            };

        var getClaimDetails = ThirdPartyInvoiceDetailsService.getClaimContents(param);
        getClaimDetails.then(function (success) {
            $scope.ClaimDetails = success.data.data;
            if($scope.IsEditInvoice==false)
            {
                $scope.GetInvoiceItems();   
            }
            $scope.VendorInvoiceDetails.invoiceDetails.taxRate = $scope.ClaimDetails.taxRate;
        }, function (error) {
            toastr.remove();
            if (error.data.errorMessage != null && angular.isDefined(error.data.errorMessage)) {
                toastr.error(error.data.errorMessage, "Error")
            }
            else {
                toastr.error(AuthHeaderService.genericErrorMessage(), "Error")
            }
        });
    }
    $scope.GetVendorDetails = GetVendorDetails;
    function GetVendorDetails() {

        var getVendorDetails = ThirdPartyInvoiceDetailsService.GetVendorDetails();
        getVendorDetails.then(function (success) {
            $scope.VendorDetails = success.data.data;

            //if ($scope.VendorDetails.billingAddress.streetAddressOne == null) {
            //    $scope.VendorDetails.billingAddress.streetAddressOne = $scope.VendorDetails.billingAddress.streetAddressTwo;
            //    $scope.VendorDetails.billingAddress.streetAddressTwo = null;
            //}
            //if ($scope.VendorDetails.shippingAddress.streetAddressOne == null) {
            //    $scope.VendorDetails.shippingAddress.streetAddressOne = $scope.VendorDetails.shippingAddress.streetAddressTwo;
            //    $scope.VendorDetails.shippingAddress.streetAddressTwo = null;
            //}
          

            $scope.VendorInvoiceDetails.vendor.name = $scope.VendorDetails.vendorName;
            $scope.VendorInvoiceDetails.vendorRemitAddress = angular.isDefined($scope.VendorDetails.billingAddress) && $scope.VendorDetails.billingAddress != null ? $scope.VendorDetails.billingAddress : null;
            $(".page-spinner-bar").addClass("hide");
        }, function (error) {
            toastr.remove();
            if (error.data.errorMessage != null && angular.isDefined(error.data.errorMessage)) {
                toastr.error(error.data.errorMessage, "Error")
            }
            else {
                toastr.error(AuthHeaderService.genericErrorMessage(), "Error")
            }
        });
    };

    function GetServiceTypeList() {
        var getDetails = ThirdPartyInvoiceDetailsService.GetServiceTypes();
        getDetails.then(function (success) {
            $scope.ddlServiceList = success.data.data;
        }, function (error) {
            toastr.remove();
            if (error.data.errorMessage != null && angular.isDefined(error.data.errorMessage)) {
                toastr.error(error.data.errorMessage, "Error")
            }
            else {
                toastr.error(AuthHeaderService.genericErrorMessage(), "Error")
            }
        });
    }

    $scope.PurchaseOrderItems = [];
    $scope.GetInvoiceItems = GetInvoiceItems;
    function GetInvoiceItems() {
        $(".page-spinner-bar").removeClass("hide");
        //$scope.VendorInvoiceDetails.InvoiceItems = angular.copy($scope.FiletrLostDamageList);
        $scope.VendorInvoiceDetails.InvoiceItems = [];
        angular.forEach($scope.FiletrLostDamageList, function (item) {
            if(item.claimItem.status.id==4 && item.claimItem.status.status=="VALUED")
            {                 
                $scope.VendorInvoiceDetails.InvoiceItems.push(item);
            }
        });

        var paramId = {
            "assignmentNumber": $scope.CommonObj.AssignmentNumber
        };
        var GetOrderList = ThirdPartyInvoiceDetailsService.GetAllPurchaseOrder(paramId);
        GetOrderList.then(function (success) {
            $scope.PurchaseOrderItems = success.data.data;
            $(".page-spinner-bar").addClass("hide");
            PushPOItem();
        }, function (error) {
            toastr.remove();
            if (error.data.errorMessage != null && angular.isDefined(error.data.errorMessage)) {
                toastr.error(error.data.errorMessage, "Error")
            }
            else {
                toastr.error(AuthHeaderService.genericErrorMessage(), "Error")
            }
            $(".page-spinner-bar").addClass("hide");
        });

    };

    $scope.PushPOItem = PushPOItem;
    function PushPOItem() {
        angular.forEach($scope.VendorInvoiceDetails.InvoiceItems, function (InvoiceItem) {
            InvoiceItem.claimItem.PurchaseOrderItems = [];
        });

        angular.forEach($scope.VendorInvoiceDetails.InvoiceItems, function (InvoiceItem) {
            angular.forEach($scope.PurchaseOrderItems, function (item) {
                if (item.id === InvoiceItem.claimItem.id) {
                    angular.forEach(item.purchaseOrders, function (purchaseOrder) {                     
                        if (purchaseOrder.orderType.name == "BIB from PH" || purchaseOrder.orderType.name == "Shipment") {
                            if (purchaseOrder.orderType.name == "BIB from PH" && purchaseOrder.status.status == 'RECEIVED') {
                                angular.forEach(purchaseOrder.purchaseOrderItems, function (orderitem) {
                                    InvoiceItem.claimItem.PurchaseOrderItems.push({ OrderType: purchaseOrder.orderType, purchaseOrderId: purchaseOrder.id, item: orderitem, shippingCost: (angular.isDefined(purchaseOrder.shippingCost) && purchaseOrder.shippingCost != null ? purchaseOrder.shippingCost : 0.00) });
                                });
                            }
                            else if (purchaseOrder.orderType.name == "Shipment" && purchaseOrder.status.status == 'COMPLETED') {                            
                                
                                var CustomshipmentObject = {
                                    availabeQuantity: 1,
                                    saleTax: 0
                                };
                                InvoiceItem.claimItem.PurchaseOrderItems.push({ OrderType: purchaseOrder.orderType, item: CustomshipmentObject, purchaseOrderId: purchaseOrder.id, shippingCost: (angular.isDefined(purchaseOrder.shippingCost) && purchaseOrder.shippingCost != null ? purchaseOrder.shippingCost : 0.00) });
                            }
                        }
                        else if (purchaseOrder.orderType.name == "Labor Charges") {
                            if (purchaseOrder.status.status == 'COMPLETED') {
                                angular.forEach(purchaseOrder.purchaseOrderItems, function (orderitem) {

                                    InvoiceItem.claimItem.PurchaseOrderItems.push({ OrderType: purchaseOrder.orderType,purchaseOrderId: purchaseOrder.id, item: orderitem, description: purchaseOrder.description, laborCost: (angular.isDefined(purchaseOrder.laborCodeDetails) && purchaseOrder.laborCodeDetails != null ? purchaseOrder.laborCodeDetails.price : 0.00) });
                                });
                            }

                        }
                        else if (purchaseOrder.orderType.name == "Order from Vendor" || purchaseOrder.orderType.name == "Pick up from Vendor/Email Label") {
                            if (purchaseOrder.status.status == 'RECEIVED' || purchaseOrder.status.status == 'RETURNED') {
                                angular.forEach(purchaseOrder.purchaseOrderItems, function (orderitem) {
                                    InvoiceItem.claimItem.PurchaseOrderItems.push({ OrderType: purchaseOrder.orderType,purchaseOrderId: purchaseOrder.id,MarkUpLimitIndicator: null, item: orderitem });
                                });
                            }

                        }
                    });
                }
            });
        });
        //Setting by defulat sale tax to Claim tax rate(for PO items)
        angular.forEach($scope.VendorInvoiceDetails.InvoiceItems, function (InvoiceItem) {
            angular.forEach(InvoiceItem.claimItem.PurchaseOrderItems, function (POitems) {
                POitems.item.saleTax = (angular.isDefined($scope.ClaimDetails.taxRate) && $scope.ClaimDetails.taxRate != null ? $scope.ClaimDetails.taxRate : 0);
               
            });
        });

        $scope.CalculateTotalForMainItem();
    };

    $scope.CalculateTotalForMainItem = CalculateTotalForMainItem;
    function CalculateTotalForMainItem() {
        angular.forEach($scope.VendorInvoiceDetails.InvoiceItems, function (InvoiceItem) {
            InvoiceItem.claimItem.SumOfSubTotal = 0.00;
            InvoiceItem.claimItem.SumOfBillableAmount = 0.00;

            angular.forEach(InvoiceItem.claimItem.PurchaseOrderItems, function (POitems) {
                POitems.item.subTotal = 0.00;
                POitems.item.total = 0.00;
                POitems.item.billableAmount = 0.00;               
                var markup = 0.00;
                if (POitems.OrderType.name == "Order from Vendor" || POitems.OrderType.name == "Pick up from Vendor/Email Label") {

                    POitems.item.subTotal += (parseFloat(angular.isDefined(POitems.item.unitPrice) && POitems.item.unitPrice != null && POitems.item.unitPrice != "" ? POitems.item.unitPrice : 0)) * parseInt(POitems.item.availabeQuantity)

                    if (POitems.MarkUpLimitIndicator == true) {
                        markup = (parseFloat(angular.isDefined(POitems.item.markUp) && POitems.item.markUp != null && POitems.item.markUp != "" ? POitems.item.markUp : 0) / 100) * (POitems.item.subTotal);
                    }
                    else {
                        markup = 0.00
                    }

                    POitems.item.total += POitems.item.subTotal + markup;
                    POitems.item.billableAmount += ((parseFloat(angular.isDefined(POitems.item.saleTax) && POitems.item.saleTax != null && POitems.item.saleTax != "" ? POitems.item.saleTax : 0)) / 100 * POitems.item.total) + POitems.item.total;
                }
                else if (POitems.OrderType.name == "Labor Charges") {
                    POitems.item.subTotal += (parseFloat(angular.isDefined(POitems.laborCost) && POitems.laborCost != null && POitems.laborCost != "" ? POitems.laborCost : 0)) * parseInt(POitems.item.availabeQuantity)
                    POitems.item.total += POitems.item.subTotal;
                    POitems.item.billableAmount += ((parseFloat(angular.isDefined(POitems.item.saleTax) && POitems.item.saleTax != null && POitems.item.saleTax != "" ? POitems.item.saleTax : 0)) / 100 * POitems.item.total) + POitems.item.total;
                    //POitems.item.billableAmount += POitems.item.total;
                }
                else if (POitems.OrderType.name == "BIB from PH" || POitems.OrderType.name == "Shipment") {

                    if (POitems.OrderType.name == "BIB from PH")

                    {
                        POitems.item.subTotal += (parseFloat(angular.isDefined(POitems.shippingCost) && POitems.shippingCost != null && POitems.shippingCost != "" ? POitems.shippingCost : 0)) * parseInt(POitems.item.availabeQuantity)
                        POitems.item.total += POitems.item.subTotal;
                        POitems.item.billableAmount += ((parseFloat(angular.isDefined(POitems.item.saleTax) && POitems.item.saleTax != null && POitems.item.saleTax != "" ? POitems.item.saleTax : 0)) / 100 * POitems.item.total) + POitems.item.total;
                        
                        //POitems.item.billableAmount += POitems.item.total;
                    }
                    else if (POitems.OrderType.name == "Shipment") {
                        POitems.item.subTotal += (parseFloat(angular.isDefined(POitems.shippingCost) && POitems.shippingCost != null && POitems.shippingCost != "" ? POitems.shippingCost : 0)) * parseInt(POitems.item.availabeQuantity)
                        POitems.item.total += POitems.item.subTotal;
                        POitems.item.billableAmount += ((parseFloat(angular.isDefined(POitems.item.saleTax) && POitems.item.saleTax != null && POitems.item.saleTax != "" ? POitems.item.saleTax : 0)) / 100 * POitems.item.total) + POitems.item.total;
                        //POitems.item.billableAmount += POitems.item.total;
                    }
                }
            });

            angular.forEach(InvoiceItem.claimItem.servicesCost, function (serviceItem) {
                serviceItem.subTotal = 0.00;
                serviceItem.total = 0.00;
                serviceItem.amount = 0.00;
                serviceItem.subTotal += (parseInt(angular.isDefined(serviceItem.quantity) && serviceItem.quantity != null && serviceItem.quantity != "" ? serviceItem.quantity:0)) * parseFloat(angular.isDefined(serviceItem.rate) && serviceItem.rate != null && serviceItem.rate != "" ?serviceItem.rate:0);
                var markup = 0.00
                if (serviceItem.MarkUpLimitIndicator == true) {
                    markup = (parseFloat(angular.isDefined(serviceItem.markUp) && serviceItem.markUp != null && serviceItem.markUp != "" ? serviceItem.markUp : 0) / 100) * (serviceItem.subTotal);
                }
                else if ($scope.IsEditInvoice == true) {
                    markup = (parseFloat(angular.isDefined(serviceItem.markUp) && serviceItem.markUp != null && serviceItem.markUp != "" ? serviceItem.markUp : 0) / 100) * (serviceItem.subTotal);
                }
                else{
                    markup = 0.00
                }
                serviceItem.total += serviceItem.subTotal + markup;
                serviceItem.amount += (parseFloat(angular.isDefined(serviceItem.salesTax) && serviceItem.salesTax != "" ? serviceItem.salesTax : 0) / 100 * serviceItem.total) + serviceItem.total;


            });
        });

        //angular.forEach($scope.VendorInvoiceDetails.InvoiceItems, function (InvoiceItem) {

        //    angular.forEach(InvoiceItem.claimItem.servicesCost, function (serviceItem) {
        //        serviceItem.subTotal = 0.00;
        //        serviceItem.total = 0.00;
        //        serviceItem.amount = 0.00;
        //        serviceItem.subTotal += parseInt(serviceItem.quantity) * parseFloat(serviceItem.rate);
        //        var markup=0.00
        //        if (serviceItem.MarkUpLimitIndicator == true) {
        //            markup = (parseFloat(angular.isDefined(serviceItem.markUp) && serviceItem.markUp != null && serviceItem.markUp != "" ? serviceItem.markUp : 0) / 100) * (serviceItem.subTotal);
        //        }
        //        else {
        //            markup = 0.00
        //        }
        //        serviceItem.total += serviceItem.subTotal + markup;
        //        serviceItem.amount += (parseFloat(angular.isDefined(serviceItem.salesTax) && serviceItem.salesTax != "" ? serviceItem.salesTax : 0) / 100 * serviceItem.total) + serviceItem.total;


        //    });

        //});
        angular.forEach($scope.VendorInvoiceDetails.InvoiceItems, function (InvoiceItem) {

            angular.forEach(InvoiceItem.claimItem.PurchaseOrderItems, function (POitems) {
                InvoiceItem.claimItem.SumOfSubTotal += POitems.item.subTotal;
                InvoiceItem.claimItem.SumOfBillableAmount += POitems.item.billableAmount;
            });

        });
        angular.forEach($scope.VendorInvoiceDetails.InvoiceItems, function (InvoiceItem) {

            angular.forEach(InvoiceItem.claimItem.servicesCost, function (serviceItem) {
                InvoiceItem.claimItem.SumOfSubTotal += serviceItem.subTotal;
                InvoiceItem.claimItem.SumOfBillableAmount += serviceItem.amount;
            });

        });
        $scope.GrandTotal = 0.00;
        $scope.TotalPayable = 0.00;
        angular.forEach($scope.VendorInvoiceDetails.InvoiceItems, function (InvoiceItem) {


            $scope.GrandTotal += parseFloat(InvoiceItem.claimItem.SumOfBillableAmount);
            $scope.TotalPayable += parseFloat(InvoiceItem.claimItem.SumOfBillableAmount);

        });
        $scope.CalculateTotal();
    }

    $scope.CalculateTotal = CalculateTotal;
    function CalculateTotal() {
        $scope.GrandTotal = 0.00;
        $scope.TotalSubForAllItems = 0.00;
        $scope.TotalSubForAllBillable = 0.00;
        angular.forEach($scope.VendorInvoiceDetails.InvoiceItems, function (InvoiceItem) {
            $scope.GrandTotal += InvoiceItem.claimItem.SumOfBillableAmount;
            $scope.TotalSubForAllItems += InvoiceItem.claimItem.SumOfSubTotal;
            $scope.TotalSubForAllBillable += InvoiceItem.claimItem.SumOfBillableAmount;
        });

        $scope.TotalPayable = 0.00
        $scope.TotalPayable += $scope.GrandTotal;
        $scope.TotalPayable += (angular.isDefined($scope.PaymentDetails.ShippCharge) && $scope.PaymentDetails.ShippCharge != "" ? parseFloat($scope.PaymentDetails.ShippCharge) : 0);
        $scope.TotalPayable -= (angular.isDefined($scope.PaymentDetails.Deductible) && $scope.PaymentDetails.Deductible != "" ? parseFloat($scope.PaymentDetails.Deductible) : 0);
        $scope.TotalPayable -= (angular.isDefined($scope.PaymentDetails.AdvancePayment) && $scope.PaymentDetails.AdvancePayment != "" ? parseFloat($scope.PaymentDetails.AdvancePayment) : 0);
        $scope.GrandTotal += (angular.isDefined($scope.PaymentDetails.ShippCharge) && $scope.PaymentDetails.ShippCharge != "" ? parseFloat($scope.PaymentDetails.ShippCharge) : 0);
    };

    $scope.calculatePreTaxTotal = calculatePreTaxTotal;
    function calculatePreTaxTotal()
    {
        

        angular.forEach($scope.VendorInvoiceDetails.InvoiceItems, function (InvoiceItem) {

            InvoiceItem.claimItem.SumOfSubTotal = 0.00;
            InvoiceItem.claimItem.SumOfBillableAmount = 0.00;
            angular.forEach(InvoiceItem.claimItem.PurchaseOrderItems, function (POitems) {
                    POitems.item.billableAmount = 0.00;
                    POitems.item.billableAmount += ((parseFloat(angular.isDefined(POitems.item.saleTax) && POitems.item.saleTax != null && POitems.item.saleTax != "" ? POitems.item.saleTax : 0)) / 100 * (angular.isDefined(POitems.item.total) && POitems.item.total != null && POitems.item.total != "" ? POitems.item.total : 0)) + parseFloat((angular.isDefined(POitems.item.total) && POitems.item.total != null && POitems.item.total != "" ? parseFloat(POitems.item.total) : 0));

            });
            
        });

        angular.forEach($scope.VendorInvoiceDetails.InvoiceItems, function (InvoiceItem) {

            angular.forEach(InvoiceItem.claimItem.servicesCost, function (serviceItem) {
                
                serviceItem.amount = 0.00;            
              
                serviceItem.amount += (parseFloat(angular.isDefined(serviceItem.salesTax) && serviceItem.salesTax != "" ? serviceItem.salesTax : 0) / 100 * (angular.isDefined(serviceItem.total) && serviceItem.total != null && serviceItem.total != "" ? serviceItem.total : 0)) +parseFloat((angular.isDefined(serviceItem.total) && serviceItem.total != null && serviceItem.total != "" ?serviceItem.total : 0));


            });

        });

        angular.forEach($scope.VendorInvoiceDetails.InvoiceItems, function (InvoiceItem) {

            angular.forEach(InvoiceItem.claimItem.PurchaseOrderItems, function (POitems) {
                InvoiceItem.claimItem.SumOfSubTotal += POitems.item.subTotal;
                InvoiceItem.claimItem.SumOfBillableAmount += POitems.item.billableAmount;
            });

        });
        angular.forEach($scope.VendorInvoiceDetails.InvoiceItems, function (InvoiceItem) {

            angular.forEach(InvoiceItem.claimItem.servicesCost, function (serviceItem) {
                InvoiceItem.claimItem.SumOfSubTotal += serviceItem.subTotal;
                InvoiceItem.claimItem.SumOfBillableAmount += serviceItem.amount;
            });

        });

        $scope.GrandTotal = 0.00;
        $scope.TotalPayable = 0.00;
        angular.forEach($scope.VendorInvoiceDetails.InvoiceItems, function (InvoiceItem) {
         
            $scope.GrandTotal += parseFloat(InvoiceItem.claimItem.SumOfBillableAmount);
            $scope.TotalPayable += parseFloat(InvoiceItem.claimItem.SumOfBillableAmount);

        });
        $scope.CalculateTotal();
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

    //Remove line item from invoice
    $scope.RemoveLineItem = RemoveLineItem;
    function RemoveLineItem(index) {
        $scope.VendorInvoiceDetails.InvoiceItems.splice(index, 1);
        CalculateTotalForMainItem();
    }

    //CreateNew invoice
    $scope.createInvoice = createInvoice;
    function createInvoice(InvoiceStatus,$event) {
        var count= 0,POCount = 0;
        angular.forEach($scope.VendorInvoiceDetails.InvoiceItems, function (invoiceitem) {

            if (angular.isUndefined(invoiceitem.claimItem.servicesCost) || invoiceitem.claimItem.servicesCost.length == 0)
                count++;
            if (angular.isUndefined(invoiceitem.claimItem.PurchaseOrderItems) || invoiceitem.claimItem.PurchaseOrderItems.length == 0)
                POCount++;
        });
   
        if (count > 0 && POCount >0) {
            toastr.remove();
            toastr.warning("Please select service or add purchase order items for invoice", "Warning");
            $event.preventDefault();
            $event.stopPropagation();
        }
        else if ($scope.VendorInvoiceDetails.InvoiceItems.length == 0)
        {
            toastr.remove();
            toastr.warning("0 items avaliable to create invoice", "Warning");
            $event.preventDefault();
            $event.stopPropagation();
        }
        else {
            var paramInvoice = new FormData();
            var ItemsForInvoice = [];
            var invoiceParam = {};
            //angular.forEach($scope.SelectedItemForInvoice, function (item) {

                angular.forEach($scope.VendorInvoiceDetails.InvoiceItems, function (invoiceitem) {
                    var ItemObject = {};
                    //if (invoiceitem.claimItem.id === item) {
                        //selecting services
                        if (angular.isDefined(invoiceitem.claimItem.servicesCost) && invoiceitem.claimItem.servicesCost != null) {
                            angular.forEach(invoiceitem.claimItem.servicesCost, function (cost) {

                                ItemObject = {
                                    "id": (angular.isDefined(cost.Serviceid) && cost.Serviceid != null ? cost.Serviceid : null),
                                    "item": {
                                        "itemId": null
                                    },
                                    "itemService": {
                                        "id": null
                                    },
                                    "description": null,
                                    "quantity": null,
                                    "rate": null,
                                    "subTotal": null,
                                    "markup": null,
                                    "total": null,
                                    "saleTax": null,
                                    "amount": null,
                                    "replacementItemId": null,
                                    "purchaseOrderId": null
                                };                              
                                ItemObject.item.itemId = invoiceitem.claimItem.id;
                                ItemObject.itemService.id = (angular.isDefined(cost.id) ? cost.id : null);
                                ItemObject.description = cost.description;
                                ItemObject.quantity = cost.quantity;
                                ItemObject.rate = cost.rate;
                                ItemObject.subTotal = cost.subTotal;
                                ItemObject.markup = 0; //cost.markUp;
                                ItemObject.total = cost.total;
                                ItemObject.saleTax = cost.salesTax;
                                ItemObject.amount = cost.amount;
                                 
                                if (cost.id == 1)
                                {
                                    ItemObject.chargeType = "QUOT";
                                }
                                else if (cost.id == 2) {
                                    ItemObject.chargeType = "FULL-EVAL";
                                }
                                else if (cost.id == 3) {
                                    ItemObject.chargeType = "GEM-EVAL";
                                }
                                else if (cost.id == 4) {
                                    ItemObject.chargeType = "GEM-REP";
                                }
                                else if (cost.id == 5) {
                                    ItemObject.chargeType = "LBR-FEE";
                                }
                                else if (cost.id == 6) {
                                    ItemObject.chargeType = "SKU";
                                }
                                else if (cost.id == 7)
                                {
                                    ItemObject.chargeType ="SHIPPING-FEE";
                                }
                             
                                ItemsForInvoice.push(ItemObject);
                            });
                        }

                        if (angular.isDefined(invoiceitem.claimItem.PurchaseOrderItems) && invoiceitem.claimItem.PurchaseOrderItems != null) {
                          
                            angular.forEach(invoiceitem.claimItem.PurchaseOrderItems, function (Poitems) {
                                ItemObject = {
                                    "id": (angular.isDefined(Poitems.item.Id) && Poitems.item.Id != null ? Poitems.item.Id : null),
                                    "item": {
                                        "itemId":null, 
                                    },
                                    "itemService": {
                                        "id": null
                                    },
                                    "description": null,
                                    "quantity": null,
                                    "rate": null,
                                    "subTotal": null,
                                    "markup": null,
                                    "total": null,
                                    "saleTax": null,
                                    "chargeType": null,
                                    "amount": null,
                                    "replacementItemId": null,
                                    "purchaseOrderId":null
                                };
                                if (Poitems.OrderType.name == "BIB from PH") {
                                    ItemObject.item.itemId = invoiceitem.claimItem.id;
                                    ItemObject.itemService.id = 7 ;
                                    ItemObject.description = Poitems.item.description,//Poitems.OrderType.name,
                                    ItemObject.quantity = Poitems.item.availabeQuantity,
                                    ItemObject.rate = Poitems.shippingCost,
                                    ItemObject.subTotal = Poitems.item.subTotal,
                                    ItemObject.markup = (angular.isDefined(Poitems.item.markUp) ? Poitems.item.markUp : 0),
                                    ItemObject.total = Poitems.item.total,
                                    ItemObject.saleTax = Poitems.item.saleTax,
                                    ItemObject.amount = Poitems.item.billableAmount
                                    ItemObject.chargeType = "SHIPPING-FEE"
                                    ItemObject.replacementItemId = Poitems.item.id;
                                    ItemObject.purchaseOrderId = Poitems.purchaseOrderId;
                                }
                                if ( Poitems.OrderType.name == "Shipment") {                                    
                                    ItemObject.item.itemId = invoiceitem.claimItem.id;
                                    ItemObject.itemService.id = 7 ;
                                    ItemObject.description = Poitems.OrderType.name, //Poitems.item.description,//Poitems.OrderType.name,
                                    ItemObject.quantity = Poitems.item.availabeQuantity,
                                    ItemObject.rate = Poitems.shippingCost,
                                    ItemObject.subTotal = Poitems.item.subTotal,
                                    ItemObject.markup = (angular.isDefined(Poitems.item.markUp) ? Poitems.item.markUp : 0),
                                    ItemObject.total = Poitems.item.total,
                                    ItemObject.saleTax = Poitems.item.saleTax,
                                    ItemObject.amount = Poitems.item.billableAmount
                                    ItemObject.chargeType = "SHIPPING-FEE"
                                    ItemObject.replacementItemId =null, //Poitems.item.id;
                                    ItemObject.purchaseOrderId = Poitems.purchaseOrderId;
                                }
                                else if (Poitems.OrderType.name == "Labor Charges") {

                                    ItemObject.item.itemId = invoiceitem.claimItem.id;
                                    ItemObject.itemService.id = 5;
                                    ItemObject.description = Poitems.description, //Poitems.OrderType.name,
                                    ItemObject.quantity = Poitems.item.availabeQuantity,
                                    ItemObject.rate = Poitems.laborCost,
                                    ItemObject.subTotal = Poitems.item.subTotal,
                                    ItemObject.markup = (angular.isDefined(Poitems.item.markUp) ? Poitems.item.markUp : 0),
                                    ItemObject.total = Poitems.item.total,
                                    ItemObject.saleTax = Poitems.item.saleTax,
                                    ItemObject.amount = Poitems.item.billableAmount,
                                    ItemObject.chargeType = "LBR-FEE"
                                    ItemObject.replacementItemId = Poitems.item.id;
                                    ItemObject.purchaseOrderId = Poitems.purchaseOrderId;
                                }
                                else if (Poitems.OrderType.name == "Pick up from Vendor/Email Label" || Poitems.OrderType.name == "Order from Vendor") {

                                    ItemObject.item.itemId = invoiceitem.claimItem.id;
                                    ItemObject.itemService.id = 6;
                                    ItemObject.description = Poitems.item.description,//Poitems.OrderType.name,
                                    ItemObject.quantity = Poitems.item.availabeQuantity,
                                    ItemObject.rate = Poitems.item.unitPrice,
                                    ItemObject.subTotal = Poitems.item.subTotal,
                                    ItemObject.markup = (angular.isDefined(Poitems.item.markUp) ? Poitems.item.markUp : 0),
                                    ItemObject.total = Poitems.item.total,
                                    ItemObject.saleTax = Poitems.item.saleTax,
                                    ItemObject.amount = Poitems.item.billableAmount,
                                    ItemObject.chargeType = "SKU"
                                    ItemObject.replacementItemId = Poitems.item.id;
                                    ItemObject.purchaseOrderId = Poitems.purchaseOrderId;

                                }
                                ItemsForInvoice.push(ItemObject);
                            });
                        }

                    //}
                });
            // });

                if (angular.isDefined($scope.VendorInvoiceDetails.invoiceDetails.id) && $scope.VendorInvoiceDetails.invoiceDetails.id != null)
                {
                    
                    invoiceParam = {
                        "id": $scope.VendorInvoiceDetails.invoiceDetails.id,
                        "claimId": $scope.CommonObj.ClaimId,
                        "serviceRequestNumber":null,
                        "vendorAssignmentId": $scope.CommonObj.AssignmentId,
                        "paymentTermDetails": {
                            "id": $scope.VendorInvoiceDetails.invoiceDetails.paymentTerm.id
                        },                     
                        "insuranceCompany": {
                            "companyId": $scope.VendorInvoiceDetails.invoiceDetails.insuranceCompany.id
                        },
                        "vendorAssociateId": $scope.AssociateIdValue,
                        "draft": InvoiceStatus, // true for save as draft and false for submit invoice. DateFormatyyyyMMddHHmmTime
                        "invoiceDate": $filter('DatabaseDateFormatMMddyyyy')($scope.VendorInvoiceDetails.invoiceDetails.createDate), //"2018-01-22T00:00:00Z",
                        "dueDate": $filter('DatabaseDateFormatMMddyyyy')($scope.VendorInvoiceDetails.invoiceDetails.dueDate),         // "2018-01-22T00:00:00Z", 
                        "vendorNote": $scope.VendorInvoiceDetails.invoiceDetails.vendorNote,
                        "currencyDetails": $scope.VendorInvoiceDetails.invoiceDetails.currencyDetails,
                        "subTotal": $scope.TotalSubForAllItems,
                        "grandTotal": $scope.GrandTotal,
                        "totalSaleTax": 100,
                        "shippingCharge": $scope.PaymentDetails.ShippCharge,
                        "deductions": $scope.PaymentDetails.Deductible,
                        "advancePayment": $scope.PaymentDetails.AdvancePayment,
                        "taxRate": $scope.VendorInvoiceDetails.invoiceDetails.taxRate,
                        "invoiceItems": ItemsForInvoice,
                        "remitAddress": {
                            "streetAddressOne": angular.isDefined($scope.VendorInvoiceDetails.vendorRemitAddress) && $scope.VendorInvoiceDetails.vendorRemitAddress != null ? $scope.VendorInvoiceDetails.vendorRemitAddress.streetAddressOne : null,
                            "streetAddressTwo": angular.isDefined($scope.VendorInvoiceDetails.vendorRemitAddress) && $scope.VendorInvoiceDetails.vendorRemitAddress != null ? $scope.VendorInvoiceDetails.vendorRemitAddress.streetAddressTwo : null,
                            "city": angular.isDefined($scope.VendorInvoiceDetails.vendorRemitAddress) && $scope.VendorInvoiceDetails.vendorRemitAddress != null ? $scope.VendorInvoiceDetails.vendorRemitAddress.city : null,
                            "state": {
                                "id": angular.isDefined($scope.VendorInvoiceDetails.vendorRemitAddress) && $scope.VendorInvoiceDetails.vendorRemitAddress != null ? $scope.VendorInvoiceDetails.vendorRemitAddress.state.id : null
                            },
                            "zipcode": angular.isDefined($scope.VendorInvoiceDetails.vendorRemitAddress) && $scope.VendorInvoiceDetails.vendorRemitAddress != null ? $scope.VendorInvoiceDetails.vendorRemitAddress.zipcode : null
                        },
                        "billingAddress": {
                            "streetAddressOne": $scope.VendorInvoiceDetails.vendorBillAddress.streetAddressOne,
                            "streetAddressTwo": $scope.VendorInvoiceDetails.vendorBillAddress.streetAddressTwo,
                            "city": $scope.VendorInvoiceDetails.vendorBillAddress.city,
                            "state": {
                                "id": $scope.VendorInvoiceDetails.vendorBillAddress.state.id
                            },
                            "zipcode": $scope.VendorInvoiceDetails.vendorBillAddress.zipcode
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
                }
                else {                    
                    invoiceParam = {
                        "id": null,
                        "claimId": $scope.CommonObj.ClaimId,
                         "serviceRequestNumber": null,
                        "vendorAssignmentId": $scope.CommonObj.AssignmentId,
                        "paymentTermDetails": {
                            "id": $scope.VendorInvoiceDetails.invoiceDetails.paymentTerm.id
                        },
                        // "vendorId": sessionStorage.getItem("VendorId"),
                        "insuranceCompany": {
                            "companyId": sessionStorage.getItem("CompanyId")
                        },
                        "vendorAssociateId": $scope.AssociateIdValue,
                        "draft": InvoiceStatus, // true for save as draft and false for submit invoice. DateFormatyyyyMMddHHmmTime
                        "invoiceDate": $filter('DatabaseDateFormatMMddyyyy')($scope.VendorInvoiceDetails.invoiceDetails.createDate), //"2018-01-22T00:00:00Z",
                        "dueDate": $filter('DatabaseDateFormatMMddyyyy')($scope.VendorInvoiceDetails.invoiceDetails.dueDate),         // "2018-01-22T00:00:00Z", 
                        "vendorNote": $scope.VendorInvoiceDetails.invoiceDetails.vendorNote,
                        "currencyDetails": $scope.VendorInvoiceDetails.invoiceDetails.currencyDetails,
                        "subTotal": $scope.TotalSubForAllItems,
                        "grandTotal": $scope.GrandTotal,
                        "totalSaleTax": 100,
                        "shippingCharge": $scope.PaymentDetails.ShippCharge,
                        "deductions": $scope.PaymentDetails.Deductible,
                        "advancePayment": $scope.PaymentDetails.AdvancePayment,
                        "taxRate": $scope.ClaimDetails.taxRate,
                        "invoiceItems": ItemsForInvoice,
                        "remitAddress": {
                            "streetAddressOne": angular.isDefined($scope.VendorInvoiceDetails.vendorRemitAddress) && $scope.VendorInvoiceDetails.vendorRemitAddress != null ? $scope.VendorInvoiceDetails.vendorRemitAddress.streetAddressOne : null,
                            "streetAddressTwo":angular.isDefined($scope.VendorInvoiceDetails.vendorRemitAddress) && $scope.VendorInvoiceDetails.vendorRemitAddress != null ? $scope.VendorInvoiceDetails.vendorRemitAddress.streetAddressTwo : null, 
                            "city": angular.isDefined($scope.VendorInvoiceDetails.vendorRemitAddress) && $scope.VendorInvoiceDetails.vendorRemitAddress !=null? $scope.VendorInvoiceDetails.vendorRemitAddress.city : null,
                            "state": {
                                "id": angular.isDefined($scope.VendorInvoiceDetails.vendorRemitAddress) && $scope.VendorInvoiceDetails.vendorRemitAddress != null ? $scope.VendorInvoiceDetails.vendorRemitAddress.state.id : null
                            },
                            "zipcode": angular.isDefined($scope.VendorInvoiceDetails.vendorRemitAddress) && $scope.VendorInvoiceDetails.vendorRemitAddress != null ? $scope.VendorInvoiceDetails.vendorRemitAddress.zipcode : null
                        },
                        "billingAddress": {
                            "streetAddressOne": $scope.VendorInvoiceDetails.vendorBillAddress.streetAddressOne,
                            "streetAddressTwo": $scope.VendorInvoiceDetails.vendorBillAddress.streetAddressTwo,
                            "city": $scope.VendorInvoiceDetails.vendorBillAddress.city,
                            "state": {
                                "id": $scope.VendorInvoiceDetails.vendorBillAddress.state.id
                            },
                            "zipcode": $scope.VendorInvoiceDetails.vendorBillAddress.zipcode
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
                }
                 
                paramInvoice.append("invoiceDetails", JSON.stringify(invoiceParam));
            if ($scope.InvoiceList.length > 0) {
                var filesDetails = [];
                angular.forEach($scope.InvoiceList, function (item) {
                    filesDetails.push({
                        "fileName": item.FileName, "fileType": item.FileType, "extension": item.FileExtension,
                        "filePurpose": "INVOICE"
                    });
                });
                paramInvoice.append("filesDetails", JSON.stringify(filesDetails));
                angular.forEach($scope.InvoiceList, function (item) {
                    paramInvoice.append("file", item.File)
                });
            }
            else {
                paramInvoice.append("filesDetails", null);
                paramInvoice.append("file", null);
            }

             
            var AddInvoice = ThirdPartyInvoiceDetailsService.CreateInvoice(paramInvoice);
            AddInvoice.then(function (success) {
                if (success.data.status === 200) {
                    toastr.remove();
                    toastr.success(success.data.message, "Confirmation");
                    $scope.GetInvoicesAgainstAssignment();
                    $scope.GoBack();
                }

            }, function (error) {
                toastr.remove()
                toastr.error(error.data.errorMessage, "Error");
               
            });

        }

    };

    $scope.GoBack = GoBack;
    function GoBack() {
        //sessionStorage.setItem("ClaimDetailsForInvoice", "");
        //$location.url('ThirdPartyClaimDetails');
        $rootScope.CreateInvoice = false;
    };

    $scope.goToDashboard = goToDashboard;
    function goToDashboard() {

        $location.url('ThirdPartyVendorDashboard');
    };

    //Selet all item for quote only fee
    $scope.SelectAll = function () {
        if ($scope.CheckAll) {
            $scope.CheckAll = true;
        }
        else {
            $scope.CheckAll = false;
        }
    };

    $scope.AddQuoteFeeForAll = AddQuoteFeeForAll;
    function AddQuoteFeeForAll() {
        angular.forEach($scope.VendorInvoiceDetails.InvoiceItems, function (item) {
            if (angular.isDefined(item.claimItem.servicesCost) && item.claimItem.servicesCost.length >= 0) {
                item.claimItem.servicesCost.push({
                    "serviceId": null, "name": 0, "description": null, "quantity": null, "rate": null,
                    "salesTax": (angular.isDefined($scope.ClaimDetails.taxRate) && $scope.ClaimDetails.taxRate != null ? $scope.ClaimDetails.taxRate : 0),
                    "amount": null
                });
            }
            else {
                item.claimItem.servicesCost = [];
                item.claimItem.servicesCost.push({
                    "serviceId": null, "name": 0, "description": null, "quantity": null, "rate": null,
                    "salesTax": (angular.isDefined($scope.ClaimDetails.taxRate) && $scope.ClaimDetails.taxRate != null ? $scope.ClaimDetails.taxRate : 0),
                    "amount": null
                });
            }

        });
    }

    $scope.RowIndexToShow = 0;
    $scope.AddServcies = AddServcies;
    function AddServcies(item, indexRow) {
         
        $scope.RowIndexToShow = indexRow;
        if (angular.isDefined(item.claimItem.servicesCost) && item.claimItem.servicesCost.length > 0) {
            item.claimItem.servicesCost.push({
                "serviceId": null, "name": null, "description": null, "quantity": null, "rate": null,
                "salesTax": (angular.isDefined($scope.ClaimDetails.taxRate) && $scope.ClaimDetails.taxRate != null ? $scope.ClaimDetails.taxRate : 0),
                "amount": null
            });
        }
        else {
            item.claimItem.servicesCost = [];
            item.claimItem.servicesCost.push({
                "serviceId": null, "name": null, "description": null, "quantity": null, "rate": null,
                "salesTax": (angular.isDefined($scope.ClaimDetails.taxRate) && $scope.ClaimDetails.taxRate != null ? $scope.ClaimDetails.taxRate : 0),
                "amount": null
            });
        }

    }
    //Delete from service request rows.
    $scope.DeleteServiceItem = function (item, index) {

        if ($scope.GrandTotal != 0 && $scope.GrandTotal != null) {
            $scope.GrandTotal = (parseFloat($scope.GrandTotal) - item[index].amount)
        }
        item.splice(index, 1);
        $scope.CalculateTotalForMainItem();
    }
    $scope.ExpandServiceRow = ExpandServiceRow;
    function ExpandServiceRow(indexRow, item) {
         
        $scope.RowIndexToShow = indexRow;
        if (!angular.isDefined(item.claimItem.servicesCost)) {
            item.claimItem.servicesCost = [];
            item.claimItem.servicesCost.push({
                "serviceId": null, "name": null, "description": null, "quantity": null, "rate": null,
                "salesTax": (angular.isDefined($scope.ClaimDetails.taxRate) && $scope.ClaimDetails.taxRate != null ? $scope.ClaimDetails.taxRate : 0),
                "amount": null,
                "IsReplacementItem": false
            });
        }
        else {
            //if (item.claimItem.servicesCost.length == 0) {
                //item.claimItem.servicesCost = [];
                item.claimItem.servicesCost.push({
                    "serviceId": null, "name": null, "description": null, "quantity": null, "rate": null,
                    "salesTax": (angular.isDefined($scope.ClaimDetails.taxRate) && $scope.ClaimDetails.taxRate != null ? $scope.ClaimDetails.taxRate : 0),
                    "amount": null,
                    "IsReplacementItem": false
                });
            //}
        }
    }

    $scope.ChangeServicetype = ChangeServicetype;
    function ChangeServicetype(ParentIndex, ChildIndex) {
        var ServiceTypeId = $scope.VendorInvoiceDetails.InvoiceItems[ParentIndex].claimItem.servicesCost[ChildIndex].id;
        var CompItems = $scope.VendorInvoiceDetails.InvoiceItems[ParentIndex].comparableItems;
        var item = [];
        angular.forEach(CompItems, function (comp) {

            if (comp.isReplacementItem == true) {
                item.push(comp);
            }
        });

        if (ServiceTypeId === 6) {
            var obj = {
                "items": item
            };

            var out = $uibModal.open(
            {
                animation: $scope.animationsEnabled,
                templateUrl: "views/AddServiceForInvoice/AddServiceForInvoice.html",
                controller: "AddServiceForInvoiceController",
                resolve:
                {
                    objItemDetails: function () {
                        objItemDetails = obj;
                        return objItemDetails;
                    }
                }

            });
            out.result.then(function (value) {
                //Call Back Function success

                if (value) {
                    $scope.VendorInvoiceDetails.InvoiceItems[ParentIndex].claimItem.servicesCost[ChildIndex].ReplacementId = value.id;
                    $scope.VendorInvoiceDetails.InvoiceItems[ParentIndex].claimItem.servicesCost[ChildIndex].description = value.description;
                    $scope.VendorInvoiceDetails.InvoiceItems[ParentIndex].claimItem.servicesCost[ChildIndex].quantity = 1;
                    $scope.VendorInvoiceDetails.InvoiceItems[ParentIndex].claimItem.servicesCost[ChildIndex].rate = value.unitPrice;
                    $scope.VendorInvoiceDetails.InvoiceItems[ParentIndex].claimItem.servicesCost[ChildIndex].amount = value.unitPrice * 1;
                    $scope.VendorInvoiceDetails.InvoiceItems[ParentIndex].claimItem.servicesCost[ChildIndex].IsReplacementItem = true;

                }

            }, function (res) {
                //Call Back Function close
            });
            return {
                open: open
            };
        }
    }

    // Mark up percentage 
    $scope.CheckmarkUpLimits = CheckmarkUpLimits;
    function CheckmarkUpLimits(item) {
        //In rang => true out of range => false

        if (angular.isDefined(item.subTotal) && item.subTotal !== null && item.subTotal > 0) {
            item.MarkUpLimitIndicator = false;
            angular.forEach($scope.markUpPercentageList, function (markUpItem) {
                if (item.subTotal >= markUpItem.minLimit && item.subTotal <= markUpItem.maxLimit) {
                    if (parseInt(item.markUp) >= markUpItem.VariationAcceptable && parseInt(item.markUp) <= markUpItem.MarkUpPercentage) {
                        item.MarkUpLimitIndicator = true;
                    }
                    else
                        item.MarkUpLimitIndicator = false;
                }
            });
        }
        else
            item.markUp = 0.0;
        CalculateTotalForMainItem();
    }


    $scope.CheckmarkUpLimitsForPOItems = CheckmarkUpLimitsForPOItems;
    function CheckmarkUpLimitsForPOItems(item) {
        //In rang => true out of range => false

        if (angular.isDefined(item.item.subTotal) && item.item.subTotal !== null && item.item.subTotal > 0) {
            item.MarkUpLimitIndicator = false;
            angular.forEach($scope.markUpPercentageList, function (markUpItem) {
                if (item.item.subTotal >= markUpItem.minLimit && item.item.subTotal <= markUpItem.maxLimit) {
                    if (parseInt(item.item.markUp) >= markUpItem.VariationAcceptable && parseInt(item.item.markUp) <= markUpItem.MarkUpPercentage) {
                        item.MarkUpLimitIndicator = true;
                    }
                    else
                        item.MarkUpLimitIndicator = false;
                }
            });
        }
        else
            item.markUp = 0.0;
        CalculateTotalForMainItem();
    }
    //Get markup percentage data from JSON file
    $scope.markUpPercentageList = [];
    var MarkUpPercentageList = ThirdPartyInvoiceDetailsService.GetmarkUpPercentage();
    MarkUpPercentageList.then(function (success) {
        $scope.markUpPercentageList = success.data.data;
    }, function (error) { $scope.markUpPercentageList = []; });


    $scope.RemovePOItem = RemovePOItem;
    function RemovePOItem(item, index) {

        item.claimItem.PurchaseOrderItems.splice(index, 1);
        CalculateTotalForMainItem();
    };

    $scope.GetInvoiceDueDate = GetInvoiceDueDate;
    function GetInvoiceDueDate() {

        $scope.VendorInvoiceDetails.invoiceDetails.paymentTerm.id;
        
        var termName=null
        angular.forEach($scope.PaymentTerms, function (term)
        {
            if(term.id==$scope.VendorInvoiceDetails.invoiceDetails.paymentTerm.id)
            {
                termName = term.name
            }

        });

        if(termName!=null)
        {
            if(termName=="PAY 30")
            {
               
               
                $scope.VendorInvoiceDetails.invoiceDetails.dueDate = getDateForDueDate("PAY 30");
            }
            else if (termName == "PAY 60")
            {
                $scope.VendorInvoiceDetails.invoiceDetails.dueDate = getDateForDueDate("PAY 60");
            }
            else if(termName=="PAY 90")
            {
                $scope.VendorInvoiceDetails.invoiceDetails.dueDate = getDateForDueDate("PAY 90");
            }
        }
    };


    function getDateForDueDate( term)
    {
        date = $filter('TodaysDate')();
        var result = new Date(date);
        if (term == "PAY 30") {
            result.setDate(result.getDate() + 30);
        }
        else if (term == "PAY 60") {
            result.setDate(result.getDate() + 60);
        }
        else if (term == "PAY 90") {
            result.setDate(result.getDate() + 90);
        }
        var dd = result.getDate();
        var mm = result.getMonth() + 1; //January is 0!
        var yyyy = result.getFullYear();

        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        var today = mm + '/' + dd + '/' + yyyy;
        return today
    }

    $scope.GoToPODetails = GoToPODetails;
    function GoToPODetails(POItem) {
        $scope.purchaseOrderDetails = [];
        sessionStorage.setItem('InvoicePoDetailsID', POItem.purchaseOrderId);
        url = $state.href('PoDetailsInvoice');
        window.open(url, '_blank');

    }

});