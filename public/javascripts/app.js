(function() {
	var socket = io.connect();
	

	var SDebugger = angular.module('SDebugger', []);
	SDebugger.controller('MainCtrl', ['$scope' ,'$element' , function($scope, $element){
		

		$scope.logsData = [{
			logName : "Azhar",
			logs  : JSON.stringify({name : "azhar"})
		},{
			logName : "Azhar",
			logs  : JSON.stringify({name : "azhar"})
		}];
		
		
		socket.on("NEWS", function(data) {
			$scope.logsData.push(data);
			 $scope.$apply();
		});



		$scope.subscribe = function(id) {
			var userName = $scope.sDebuggerId;
			if(userName) {
				socket.emit('SUBSCRIBE', {
					userName : userName
				});
				//Storing userName into local storage
				window.localStorage.setItem('sDebuggerId', userName);
			}

		}


		$scope.deleteLog = function(index) {
			$scope.logsData.splice(index, 1)	
		};

		$scope.prettifyJSON = function($event) {
			var $target = $($event.currentTarget).closest('.logsArea');
			var jsonText = $target.find("pre").text().trim();
			if(jsonText) {
				jsonText = JSON.parse(jsonText);
				$target.find("pre").html(JSON.stringify(jsonText, null, 2));
			}
			
		}


		$scope.sDebuggerId = window.localStorage.getItem('sDebuggerId') || "";
		if($scope.sDebuggerId) {
			$scope.subscribe();
		}


		}]);

})();

$(document).ready(function() {


	$('[data-toggle="tooltip"]').tooltip();
});