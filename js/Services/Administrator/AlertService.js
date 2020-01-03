angular.module('MetronicApp').service('notifications', ['$http', '$rootScope', 'AuthHeaderService', function ($http, $rootScope, AuthHeaderService) {
   
    var queue = [];
    return {
        queue: queue,
        add: function (item) {
            var index = -1;
            //check alert with same body not active in dom
            for (var i = 0; i < this.queue.length; i++) {
                if (queue[i].body == item.body) {
                    index = i;
                    break;
                }
            }
            if (index != -1)
                return;
            queue.push(item);
            setTimeout(function () {
                $('.alerts .alert').eq(0).remove();
                queue.shift();
            }, 4000);
        },
        pop: function (item) {
            var index = -1;
            //to find alert from queue of active alerts in dom
            for (var i = 0; i < this.queue.length; i++) {
                if (queue[i].body == item) {
                    index = i;
                    break;
                }
            }
            if (index != -1)
                queue.splice(index, 1);
            return this.queue;
        }
    };

}]);