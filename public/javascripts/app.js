(function() {
	var socket = io.connect();
	

	var SDebugger = angular.module('SDebugger', ['ngClipboard']);
	SDebugger.controller('MainCtrl', ['$scope' ,'$element' , function($scope, $element){
		

		$scope.logsData = [{
			logName : "azhar",
			logs : JSON.stringify({name : "azhar", roll : "asdas"})
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
				var indentedJSON = JSON.stringify(jsonText, null, 2);
				$target.find("pre").html(indentedJSON);
				$target.find(".copyToClip").attr('data-clipboard-text',indentedJSON)
			}
			
		}
		$scope.copyClip = function($event) {
			var $target = $event.currentTarget;
			 	$target.innerHTML = "Copied";
			setTimeout(function() {
				$target.innerHTML = "Copy";
			},400);	
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