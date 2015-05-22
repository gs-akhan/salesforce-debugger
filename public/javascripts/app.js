(function() {
	var socket = io.connect();
	

	var SDebugger = angular.module('SDebugger', []);
	SDebugger.controller('MainCtrl', ['$scope' ,'$element' , function($scope, $element){
		

		$scope.logsData = [];
		
		
		socket.on("NEWS", function(data) {
			$scope.logsData.push(data);
			 $scope.$apply();
		});



		$scope.subscribe = function(id) {
			var orgId = $scope.sDebuggerId;
			if(orgId) {
				socket.emit('SUBSCRIBE', {
					orgId : orgId
				});
				//Storing ORGID into local storage
				window.localStorage.setItem('sDebuggerId', orgId);
			}

		}


		$scope.deleteLog = function(index) {
			$scope.logsData.splice(index, 1)	
		};


		$scope.sDebuggerId = window.localStorage.getItem('sDebuggerId') || "";
		if($scope.sDebuggerId) {
			$scope.subscribe();
		}


		}]);

})();