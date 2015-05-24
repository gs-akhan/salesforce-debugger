(function() {
	var socket = io.connect();
	

	var SDebugger = angular.module('SDebugger', ['ngClipboard']);
	SDebugger.controller('MainCtrl', ['$scope' ,'$element' , function($scope, $element){
		

		$scope.logsData = [];
		
		socket.on("NEWS", function(data) {
			data.timeStamp = new Date();
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
				$scope.isSubscribed = true;

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
		$scope.unsubscribeUser = function() {
			//Delete sDebuggerID  from localstorage
			//Send call to server to unsubscriber this socket for this userName
			window.localStorage.removeItem('sDebuggerId');
			$scope.sDebuggerId = null;
			$scope.isSubscribed = false;
			//When user unscribes, trigger disconnect event - It then flushes socket references on server
			socket.disconnect();
		};

		$scope.sDebuggerId = window.localStorage.getItem('sDebuggerId') || "";
		if($scope.sDebuggerId) {
			$scope.isSubscribed = true;
			$scope.subscribe();
		}


		}]);

})();

$(document).ready(function() {
	window.applicationCache.addEventListener('updateready', function(e) { 
		 if (window.applicationCache.status == window.applicationCache.UPDATEREADY) { 
		 	window.location.reload();
		 }
	});
});