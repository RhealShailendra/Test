angular.module('MetronicApp').controller('EventDetailsController', function ($rootScope, $filter, $uibModal, $scope, $translate, $translatePartialLoader,
    EventService, objClaim) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });
    $translatePartialLoader.addPart('EventDetails');
    $translate.refresh();

    // -------Time picker--------------------------------
    /** @type {Date} */
    $scope.EventTime = new Date;
    /** @type {number} */
    $scope.hstep = 1;
    /** @type {number} */
    $scope.mstep = 15;
    $scope.options = {
        hstep: [1, 2, 3],
        mstep: [1, 5, 10, 15, 25, 30]
    };
    /** @type {boolean} */
    $scope.ismeridian = true;
    /**
     * @return {undefined}
     */
    $scope.toggleMode = function () {
        /** @type {boolean} */
        $scope.ismeridian = !$scope.ismeridian;
    };
    /**
     * @return {undefined}
     */
    $scope.update = function () {
        /** @type {Date} */

        var d = new Date;
        d.setHours(14);
        d.setMinutes(0);
        /** @type {Date} */
        $scope.EventTime = d;
    };
    /**
     * @return {undefined}
     */
    $scope.changed = function () {

        //$log.log("Time changed to: " + $scope.EventTime);
    };
    $scope.changed1 = function () {

        //$log.log("Time changed to: " + $scope.EventTime);
    };
    /**
     * @return {undefined}
     */
    $scope.clear = function () {
        /** @type {null} */
        $scope.EventTime = null;
    };

    //--------End Time Picker-------------------------------------------------------------  

    $scope.ParticipantsList = objClaim.ParticipantList;
    $scope.EventStartDate;
    $scope.EventEndDate;
    
    angular.forEach($scope.ParticipantsList, function (particiapant) {

        if (particiapant.firstName === null) {
            particiapant.firstName = "";
        };

        if (particiapant.lastName === null) {
            particiapant.lastName = "";
        };
    });
    $scope.EventDetails = objClaim.event;
     
    $scope.PraticipantIdList = [];
    $scope.OldParticipantList = [];
    //Adding participants to list
    $scope.showisAccepted = false;
    $scope.showisRejected = false;
    angular.forEach($scope.EventDetails.participants, function (particiapnt) {
        $scope.PraticipantIdList.push(particiapnt.participantId);
        $scope.OldParticipantList.push(particiapnt.participantId);

        if (angular.isDefined(particiapnt.isAccepted)) {
            if (particiapnt.isAccepted == true)
                $scope.showisAccepted = true;
        }
        if (angular.isDefined(particiapnt.isRejected)) {
            if (particiapnt.isRejected == true)
                $scope.showisRejected = true;
        }
    });
    $scope.EventDate = $filter("DateFormatMMddyyyy")($scope.EventDetails.startTiming);
    //get start time
    $scope.EventStartDate = $filter("DateFormatMMddyyyy")($scope.EventDetails.startTiming);
    $scope.EventEndDate = $filter("DateFormatMMddyyyy")($scope.EventDetails.endTiming);
    $scope.EventDetails.startTiming = $filter("TimeFilterHHmm")($scope.EventDetails.startTiming);
  
   // $scope.EventDetails.startTiming = new Date($scope.EventDetails.startTiming);
    //get end time
    // $scope.EventDetails.endTiming = $filter("DateFormatMMddyyyyHHmmTime")($scope.EventDetails.endTiming);
    $scope.EventDetails.endTiming = $filter("TimeFilterHHmm")($scope.EventDetails.endTiming);
    //$scope.EventDetails.endTiming = new Date($scope.EventDetails.endTiming);
    $scope.reminderTime = angular.isUndefined($scope.EventDetails.reminderTime) ? "15" : $scope.EventDetails.reminderTime
    $scope.commonObj =
         {
             ClaimId: objClaim.claimId,
             OragnizerId: parseInt(sessionStorage.getItem("UserId"))
         };

    $scope.cancel = function () {

        $scope.$close();
    };

    //Get Event date format
    function returnDateForEvent(dt,time) {
       
        var data = new Date(dt);
        data.setHours(parseInt(time.split(':')[0]),parseInt(time.split(':')[1]));
        data = data.toISOString().split('.')[0];
        data = data + 'Z';
        var dateForEvent = data.split('T')[0];
        var Setyear = dateForEvent.split('-')[0];
        var SetMonth = dateForEvent.split('-')[1];
        var SetDate = dateForEvent.split('-')[2];
        return SetMonth + '-' + SetDate + '-' + Setyear + 'T' + data.split('T')[1];
      
     
    }

    //Update Event - Only Organizer can update event
    $scope.UpdateEvent = function () {

        ////var OldSelected = [];
        //////Get removed and selected particiapnt from old list
        ////angular.forEach($scope.OldParticipantList, function (participant) {
        ////    var count = 0;
        ////    angular.forEach($scope.PraticipantIdList, function (SelectedParticipant) {
        ////        if (SelectedParticipant == participant) {
        ////              count++;
        ////        }
        ////    });
        ////    if (count > 0) {
        ////        OldSelected.push({
        ////            "isDelete": false, "participantId": participant
        ////        });
        ////    }
        ////    else {
        ////        OldSelected.push({
        ////            "isDelete": true, "participantId": participant
        ////        });
        ////    }
        ////});
        //////Get newly added participants
        ////angular.forEach($scope.PraticipantIdList, function (SelectedParticipant) {
        ////    var count = 0;
        ////    angular.forEach($scope.OldParticipantList, function (participant) {
        ////        if (SelectedParticipant == participant) {
        ////            count++;
        ////        }
        ////    });
        ////    if (count == 0) {
        ////        OldSelected.push({
        ////            "isDelete": false, "participantId": SelectedParticipant
        ////        });
        ////    }
        ////});
        ////var param =
        ////    {
        ////        "id": $scope.EventDetails.id,
        ////        "claim": {
        ////            "id": $scope.commonObj.ClaimId
        ////        },
        ////        "createDate": null,
        ////        "endTiming": returnDateForEvent($scope.EventStartDate, $scope.EventDetails.endTiming),
        ////        "isDone": false,
        ////        "isReschedule": false,
        ////        "item": {
        ////            "id": null
        ////        },
        ////        "purpose": $scope.EventDetails.purpose,
        ////        "startTiming": returnDateForEvent($scope.EventEndDate, $scope.EventDetails.startTiming),//"2017-01-12T12:00:00Z".toISOString(),
        ////        "title": $scope.EventDetails.title,
        ////        "participants": OldSelected,
        ////        "organizer": {
        ////            "id": sessionStorage.getItem("UserId") //$scope.EventDetails.organizer.id
        ////        }
        ////    };
        //////var param = {
        //////    "id": $scope.EventDetails.id,
        //////    "endTiming": returnDateForEvent($scope.EventDate, $scope.EventDetails.endTiming),
        //////    "eventStatus": {
        //////        "id": 2
        //////    },
        //////    "purpose": $scope.EventDetails.purpose,
        //////    "title": $scope.EventDetails.title,
        //////    "participants": OldSelected
        //////    };

        var isInternal = false;
        var internalCount = 0;
        var ParticipantIds = [];
        var registrationNumber = null;
        registrationNumber = sessionStorage.getItem("CompanyCRN");
        angular.forEach(objClaim.ParticipantList, function (Participant) {
            angular.forEach($scope.PraticipantIdList, function (item) {
                if (Participant.participantId == item) {
                    if (Participant.participantType.participantType == 'EXISTING VENDOR') {
                        ParticipantIds.push({
                            "vendorRegistration": angular.isUndefined(Participant.vendorRegistration) ? null : Participant.vendorRegistration
                        });
                    }
                    //else if (Participant.participantType.participantType == 'VENDOR ASSOCIATE') {
                    //    angular.forEach(objClaim.ParticipantList, function (OrignalParticipant) {
                    //        if (OrignalParticipant.participantType.participantType == 'EXISTING VENDOR') {
                    //            ParticipantIds.push({
                    //                "vendorRegistration": angular.isDefined(OrignalParticipant) ? OrignalParticipant.vendorRegistration : null
                    //            });
                    //        }
                    //    });
                    //}
                    else {
                        ParticipantIds.push({
                            "email": Participant.emailId,
                            "vendorRegistration": angular.isUndefined(Participant.vendorRegistration) ? null : Participant.vendorRegistration
                        });
                    }

                    if (Participant.participantType.participantType == "INTERNAL")
                        internalCount++;
                }
            })
        });
        if (internalCount == $scope.PraticipantIdList.length) {
            isInternal = true;
        }
        else {
            isInternal = false;
        }

        var paramEvent = {
            "id": $scope.EventDetails.id,
            "claim": {
                "id": $scope.commonObj.ClaimId
            },
            "createDate": returnDateForEvent($scope.EventEndDate, $scope.EventDetails.endTiming),//"2017-01-11T12:10:30Z"
            "endTiming": returnDateForEvent($scope.EventEndDate, $scope.EventDetails.endTiming),//"2017-01-11T12:10:30Z"
            "isDone": false,
            "isReschedule": false,
            "item": {
                "id": null
            },
            "purpose": $scope.EventDetails.purpose,
            "startTiming": returnDateForEvent($scope.EventEndDate, $scope.EventDetails.endTiming),//"2017-01-12T12:00:00Z".toISOString(),
            "title": $scope.EventDetails.title,
            "participants": ParticipantIds,
            "organizer": {
                "email": sessionStorage.getItem("UserName")
            },
            "registrationNumber": registrationNumber,
            "internal": isInternal,
            "isReminder": true,  // new added
            "reminderTime": $scope.reminderTime, // new added
        };

        var updateEvent = EventService.UpdateEvent(paramEvent);
        updateEvent.then(function (success) {
            $scope.$close("Success");
            toastr.remove();
            toastr.success(success.data.message, "Confirmation");
        }, function (error) {
            toastr.remove();
            toastr.error(error.data.errorMessage, "Error");
        });
    };


    $scope.AcceptOrRejectEvent = AcceptOrRejectEvent;
    function AcceptOrRejectEvent(status) {
        var param = {
            "id": $scope.EventDetails.id,
            "isAccepted": status
        };

        var AcceptOrRejectEventByParticipant = EventService.AcceptRejectEvent(param);
        AcceptOrRejectEventByParticipant.then(function (success) {
            $scope.$close("Success");
            toastr.remove();
            toastr.success(success.data.message, "Confirmation");
        }, function (error) {
            toastr.remove();
            toastr.error(error.data.errorMessage, "Error");
        });
    };


    $scope.DeleteEvent = DeleteEvent;
    function DeleteEvent()
    {
        var msg = "";
        if (angular.isDefined($scope.EventDetails.id)) {
            msg = "Are you sure want to delete Event<b>" + $scope.EventDetails.title + "</b>?";
        }
        else {
            msg = "Are you sure want to delete Event";
        }


        bootbox.confirm({
            size: "",
            title: "Delete Event",
            message: msg, closeButton: false,
            className: "modalcustom", buttons: {
                confirm: {
                    label: "Yes",
                    className: 'btn-success'
                },
                cancel: {
                    label: "No", //$translate.instant('ClaimDetails_Delete.BtnNo'),
                    className: 'btn-danger'
                }
            },
            callback: function (result) {
                if (result) {
                    if (angular.isDefined($scope.EventDetails.id) && $scope.EventDetails.id !== null) {
                        var param = {
                            "id": $scope.EventDetails.id,

                        };
                        var Delete = EventService.DeleteEventByUser(param);
                        Delete.then(function (success) {
                            $scope.$close("Success");
                            toastr.remove();
                            toastr.success(success.data.message, "Confirmation");
                        }, function (error) {
                            toastr.remove();
                            toastr.error(error.data.errorMessage, "Error");
                        });
                    };
                }
            }
        });
   
    }
});