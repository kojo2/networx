var app = angular.module('myApp',[]);

app.controller('myCtrl',function($http,$scope){
	$http.get('/user/profile').success(function(data,status,headers,config){
		$scope.user = data;
		$scope.error = "";
	});
	error(function(data,status,headers,config){
		$scope.user = {};
		$scope.error = data;
	});
});