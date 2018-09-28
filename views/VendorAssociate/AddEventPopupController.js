angular.module('MetronicApp').controller('AddEventPopupController', function ($rootScope,$filter, VendorAssociateClaimDetailsService, $uibModal, $scope, $translate, $translatePartialLoader, objClaim) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });
    $translatePartialLoader.addPart('AdjusterPropertyClaimDetails');
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
    $scope.ClaimParticipantsList = objClaim.ParticipantList;
    $scope.participantsForEvent = [];
    $scope.CommonObject = { "SeletedId": null };
    //After select particiapnt
    $scope.afterSelectedParticipant = function () {
        var list = [];
        list = $filter('filter')($scope.ClaimParticipantsList, { participantId: $scope.CommonObject.SeletedId });
        if (list !== null) {
            var seleted = [];
            seleted = $filter('filter')($scope.participantsForEvent, { ParticipantId: $scope.CommonObject.SeletedId });
            if (seleted.length == 0 || angular.isUndefined(seleted)) {
                $scope.participantsForEvent.push({
                    "ParticipantId": list[0].participantId,
                    "ParticipantName": list[0].firstName + " " + ((list[0].lastName !== null) ? list[0].lastName : ''),
                    "designation": list[0].designation
                });
            }
        }
    }
    //End selected participant
    // search function to match full text 
    $scope.localSearch = function (str) {

        var matches = [];
        $scope.ClaimParticipantsList.forEach(function (person) {

            var fullName = person.firstName + ' ' + person.lastName;
            if ((person.firstName.toLowerCase().indexOf(str.toString().toLowerCase()) >= 0) ||
                (person.lastName.toLowerCase().indexOf(str.toString().toLowerCase()) >= 0) ||
                (fullName.toLowerCase().indexOf(str.toString().toLowerCase()) >= 0)) {
                matches.push(person);
            }
        });
        return matches;
    };
    //Get Event date format
    function returnDateForEvent(dt, time) {
        //EventDate
        var eventdate = new Date(dt);
        eventdate = new Date(eventdate.toISOString());
        var date = eventdate.getDate();
        var month = eventdate.getMonth() + 1;
        var year = eventdate.getFullYear();
        time = new Date(time);
        time.setDate(date);
        time.setMonth(month - 1);
        time.setYear(year);
        time = time.toISOString().split('.')[0];
        time = time + 'Z';
        var dateForEvent = time.split('T')[0];
        var Setyear = dateForEvent.split('-')[0];
        var SetMonth = dateForEvent.split('-')[1];
        var SetDate = dateForEvent.split('-')[2];
        return SetMonth + '-' + SetDate + '-' + Setyear + 'T' + time.split('T')[1];
    }

    //Add note function
    $scope.ok = function (e) {
        $scope.currentDate = $filter("date")(Date.now(), 'MM/dd/yyyy');//current Date
        $scope.currentTime = $filter('date')(new Date(), 'HH:mm');//current time
        var ParticipantIds = [];
        angular.forEach($scope.SelectedParticipants, function (item) {
            ParticipantIds.push({
                "participantId": item
            });
        });
        var isInternal = true;
        var internalCount = 0;
        var ParticipantIds = [];
        var registrationNumber = null;
        registrationNumber = sessionStorage.getItem("CompanyCRN");
        angular.forEach(objClaim.ParticipantList, function (Participant) {
            angular.forEach($scope.SelectedParticipants, function (item) {
                if (Participant.participantId == item) {
                    ParticipantIds.push({
                        "email": Participant.email,
                        "vendorRegistration": angular.isUndefined(Participant.vendorRegistration) ? null : Participant.vendorRegistration
                    });
                    if (Participant.participantType.participantType.toUpperCase() == 'EXTERNAL' || Participant.participantType.participantType.toUpperCase() == 'POLICY HOLDER' || Participant.participantType.participantType.toUpperCase() == 'SUPERVISOR' ||
                  Participant.participantType.participantType.toUpperCase() == 'INTERNAL') {
                        isInternal = false;
                    }
                }
            })
        });
        var paramEvent = {
            "id": objClaim.claimId,
            "claim": {
                "id": objClaim.claimId
            },
            "createDate": returnDateForEvent($scope.currentDate, $scope.currentTime),//"2017-01-11T12:10:30Z"
            "endTiming": returnDateForEvent($scope.CreateEventObject.EventStartDate, $scope.CreateEventObject.EndTime),//"2017-01-11T12:10:30Z"
            "isDone": false,
            "isReschedule": false,
            "item": {
                "id": null
            },
            "purpose": $scope.CreateEventObject.EventNote,
            "startTiming": returnDateForEvent($scope.CreateEventObject.EventStartDate, $scope.CreateEventObject.StartTime),//"2017-01-12T12:00:00Z".toISOString()
            "title": $scope.CreateEventObject.EventTitle,
            "participants": ParticipantIds,
            "organizer": {
                "email": sessionStorage.getItem("UserName")
            },
            "registrationNumber": registrationNumber,
            "internal": isInternal
        };

        var EventPromise = VendorAssociateClaimDetailsService.CreateEvent(paramEvent);
        EventPromise.then(function (success) {
            
            $scope.$close("Success");
            toastr.remove();
            toastr.success(success.data.message, "Confirmation");
        }, function (error) {
            toastr.remove();
            toastr.error(error.data.errorMessage, "Error");
        });
    }
    //Cancel
    $scope.cancel = function () {
        $scope.$close();
    };
});