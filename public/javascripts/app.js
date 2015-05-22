(function() {
	var socket = io.connect();
	

	var SDebugger = angular.module('SDebugger', []);
	SDebugger.controller('MainCtrl', ['$scope' ,'$element' , function($scope, $element){
		
		$scope.logsData = [];

		socket.on("NEWS", function(data) {
			$scope.logsData.push(data);
			 $scope.$apply();
		});



		$scope.subscribe = function() {
			var orgId = $element.find("#orgId").val().trim();
			if(orgId) {
				socket.emit('SUBSCRIBE', {
					orgId : orgId
				});
			}
		}

		$scope.deleteLog = function(index) {
			$scope.logsData.splice(index, 1)	
		};

		}]);

})();