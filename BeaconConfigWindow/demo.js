

var angularApp = angular.module('angularApp',['ngAria','ngMaterial']);


angularApp.controller("demoController",["$scope","$timeout","$mdDialog",function($scope,$timeout,$mdDialog){

	$scope.h1Demo = "DEMO DEMO DEMO";

	$scope.buttonName = "CLICK ME";
	
	$timeout(function(){
		alert("PASARON 3000ms");
		$scope.botonDemo = "HOLA";
		$scope.h1Demo = "ADIOS";
		console.log($scope);
	},3000);	

	$scope.alertIt = function()
	{
		alert("ALERT!");
	}


	$scope.showAdvanced = function(ev) {
	    $mdDialog.show({
	      	//controller: DialogController,
	      	templateUrl: 'bcwContent2.html',
			parent: angular.element(document.body),
			targetEvent: ev,
			clickOutsideToClose:true,
			fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
	    })
	    .then(function(answer) {
			$scope.status = 'You said the information was "' + answer + '".';
	    }, function() {
			$scope.status = 'You cancelled the dialog.';
	    });
	};


}]);