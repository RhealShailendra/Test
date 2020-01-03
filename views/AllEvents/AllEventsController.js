angular.module('MetronicApp').controller('AllEventsController', function ($rootScope, $log, $scope,
    settings, $http, $timeout, $uibModal, $location, $translate, $translatePartialLoader, $compile, uiCalendarConfig, $filter, AllEventsService) {

    //set language
    $translatePartialLoader.addPart('AllEvents');
    $translate.refresh();
    $scope.ParticipantList;
    $scope.EventList;
    $scope.ClaimDetails = JSON.parse(sessionStorage.getItem("ClaimObj"));
    function init() {
        if ($scope.ClaimDetails != null&& angular.isDefined($scope.ClaimDetails))
        {
            if ($scope.ClaimDetails.IsClaimEvent == false) {
                $(".page-spinner-bar").removeClass("hide");
                GetParticipantList();
                populateUpcomingEvent();
            }
            else {
                $(".page-spinner-bar").removeClass("hide");
                GetParticipantList();
                populate();
            }
        }    
    }
    init();
    $scope.GetParticipantList = GetParticipantList;
    function GetParticipantList() {
        var param = { "claimNumber": $scope.ClaimDetails.ClaimNumber }
        var GetParticipants = AllEventsService.GetParticipants(param);
        GetParticipants.then(function (success) {
            $scope.ParticipantList = success.data.data;
        }, function (error) { $scope.ErrorMessage = error.data.errorMessage; })

    };

    //Event Claendar
    $scope.SelectedEvent = null;
    var isFirstTime = true;
    $scope.events = [];
    $scope.eventSources = [$scope.events];

    $scope.NewEvent = {};
    //this function for get datetime from json date
    function getDate(datetime) {
        if (datetime != null) {
            var mili = datetime.replace(/\/Date\((-?\d+)\)\//, '$1');
            return new Date(parseInt(mili));
        }
        else {
            return "";
        }
    }
    // this function for clear clender enents
    function clearCalendar() {
        if (uiCalendarConfig.calendars.myCalendar != null) {
            uiCalendarConfig.calendars.myCalendar.fullCalendar('removeEvents');
            uiCalendarConfig.calendars.myCalendar.fullCalendar('unselect');
        }
    }

    //Load events from server
    // will put this to a method 
    function populate() {
        clearCalendar();
        var paramClaimId = { "id": $scope.ClaimDetails.ClaimId }
        var EventListPromise = AllEventsService.GetEventList(paramClaimId);
        EventListPromise.then(function (data) {
            $scope.events.slice(0, $scope.events.length);
            angular.forEach(data.data.data, function (value) {
                var dt = new Date($filter('DateFormatyyyyMMddHHmmTime')(value.startTiming));
                $scope.events.push({
                    Event: value,
                    id: value.id,
                    title: value.title,
                    description: value.purpose,
                    start: new Date($filter('DateFormatyyyyMMddHHmmTime')(value.startTiming)),
                    end: new Date($filter('DateFormatyyyyMMddHHmmTime')(value.endTiming)),
                    allDay: false,
                    stick: true,
                    className: ((value.isDone) ? 'isDone' : ((value.isReschedule) ? 'isReschedule' : 'isNotDone'))

                });
            });
            uiCalendarConfig.calendars.myCalendar.fullCalendar('gotoDate', $scope.events[0].start);
        });
        $(".page-spinner-bar").addClass("hide");
    };

    function populateUpcomingEvent() {
         
        clearCalendar();
        var GetEventList = AllEventsService.getEventList();
        GetEventList.then(function (success) {
            $scope.EventList = success.data.data;
             
            angular.forEach($scope.EventList, function (event) {
                event.PrticipantString = "";
                angular.forEach(event.participants, function (participant, key) {
                    event.PrticipantString += participant.firstName == null ? "" : participant.firstName;
                    event.PrticipantString += participant.lastName == null ? "" : participant.lastName;
                    if (key != event.participants.length - 1) {
                        event.PrticipantString += ",";
                    }
                });

            });

            $scope.events.slice(0, $scope.events.length);
            angular.forEach($scope.EventList, function (value) {
                var dt = new Date($filter('DateFormatyyyyMMddHHmmTime')(value.startTiming));
                $scope.events.push({
                    Event: value,
                    id: value.id,
                    title: value.title,
                    description: value.purpose,
                    start: new Date($filter('DateFormatyyyyMMddHHmmTime')(value.startTiming)),
                    end: new Date($filter('DateFormatyyyyMMddHHmmTime')(value.endTiming)),
                    allDay: false,
                    stick: true,
                    className: ((value.isDone) ? 'isDone' : ((value.isReschedule) ? 'isReschedule' : 'isNotDone'))

                });
            });
            uiCalendarConfig.calendars.myCalendar.fullCalendar('gotoDate', $scope.events[0].start);
            $(".page-spinner-bar").addClass("hide");
           
        }, function (error) {
          
            $scope.ErrorMessage = error.data.errorMessage;
            $(".page-spinner-bar").addClass("hide");
         
        });

    };

    //configure calendar
    $scope.uiConfig = {
        calendar: {
            height: 500,
            editable: false,
            displayEventTime: true,
            header: {
                left: 'agendaWeek,agendaDay',
                center: 'title',
                right: 'today prev,next'
            },
            timeFormat: {
                month: ' ', // for hide on month view
                agenda: 'h:mm a'
            },
            selectable: false,
            selectHelper: true, defaultView: 'agendaWeek',
            select: function (start, end) {
                var fromDate = moment(start).format('YYYY/MM/DD LT');
                var endDate = moment(end).format('YYYY/MM/DD LT');
                $scope.NewEvent = {
                    EventID: 0,
                    StartAt: fromDate,
                    EndAt: endDate,
                    IsFullDay: false,
                    Title: '',
                    Description: ''
                }

                //$scope.ShowModal();
                //$scope.alertOnEventClick();
            },
            eventClick: function (event) {

                $scope.SelectedEvent = event;
                var fromDate = moment(event.start).format('YYYY/MM/DD LT');
                var endDate = moment(event.end).format('YYYY/MM/DD LT');
                $scope.NewEvent = {
                    EventID: event.id,
                    StartAt: fromDate,
                    EndAt: endDate,
                    IsFullDay: false,
                    Title: event.title,
                    Description: event.description
                }

                //$scope.ShowModal();
                $scope.ShowEventModal(event);
            },
            eventAfterAllRender: function () {
                if ($scope.events.length > 0 && isFirstTime) {
                    //Focus first event
                    uiCalendarConfig.calendars.myCalendar.fullCalendar('gotoDate', $scope.events[0].start);
                    $scope.date = $scope.events[0].start;
                    isFirstTime = false;
                }
            }
        }
    };

    //This function for show modal dialog
    //$scope.ShowModal = function () {
    //    $scope.option = {
    //        templateUrl: 'modalContent.html',
    //        controller: 'modalController',
    //        backdrop: 'static',
    //        resolve: {
    //            NewEvent: function () {
    //                return $scope.NewEvent;
    //            }
    //        }
    //    };
    //    var modal = $uibModal.open($scope.option);
    //    modal.result.then(function (data) {
    //        $scope.NewEvent = data.event;
    //        switch (data.operation) {
    //            case 'Save':
    //                //Save here
    //                $http({
    //                    method: 'POST',
    //                    url: '/home/SaveEvent',
    //                    data : $scope.NewEvent
    //                }).then(function (response) {
    //                    if (response.data.status) {
    //                        populate();
    //                    }
    //                })
    //                break;
    //            case 'Delete':
    //                //Delete here $http({
    //                $http({
    //                    method: 'POST',
    //                    url: '/home/DeleteEvent',
    //                    data: {'eventID' : $scope.NewEvent.EventID }
    //                }).then(function (response) {
    //                    if (response.data.status) {
    //                        populate();
    //                    }
    //                })
    //                break;
    //            default:
    //                break;
    //        }
    //    }, function () {
    //        console.log('Modal dialog closed');
    //    })
    //}


    $scope.GoToDashboard = function () {
        $location.url("HomeScreen");
    };
    $scope.Back = function () {
        window.history.back();
    };

    $scope.ShowEventModal = function (event) {

        var obj = {
            "claimId": $scope.ClaimDetails.ClaimId,
            "ParticipantList": $scope.ParticipantList,
            "event": angular.copy(event.Event)
        };
        $scope.animationsEnabled = true;
        var out = $uibModal.open(
        {
            animation: $scope.animationsEnabled,
            templateUrl: "views/ThirdPartyVendor/EventDetails.html",
            controller: "EventDetailsController",
            resolve:
            {
                objClaim: function () {
                    objClaim = obj;
                    return objClaim;
                }
            }
        });
        out.result.then(function (value) {
            //Call Back Function success
            if (value === "Success") {

                //$scope.GetEventList();
                populate();
            }

        }, function (res) {
            //Call Back Function close
        });
        return {
            open: open
        };
    };

    //Add New Event
    $scope.AddNewEvent=function()
    {
        var obj = {
            "claimId": $scope.ClaimDetails.ClaimId,
            "ParticipantList": $scope.ParticipantList
        };

        $scope.animationsEnabled = true;
        var out = $uibModal.open(
        {
            animation: $scope.animationsEnabled,
            templateUrl: "views/ThirdPartyVendor/AddEventPopup.html",
            controller: "AddEventPopupController",
            resolve:
            {
                objClaim: function () {
                    objClaim = obj;
                    return objClaim;
                }
            }

        });
        out.result.then(function (value) {
            //Call Back Function success
            if (value === "Success") {
                populate();
            }

        }, function (res) {
            //Call Back Function close
        });
        return {
            open: open
        };
        //}

    }

    //--------------------------------   
    $scope.GoToDt = function () {
        uiCalendarConfig.calendars.myCalendar.fullCalendar('gotoDate', $scope.date);
    }

});