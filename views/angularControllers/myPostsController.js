var app = angular.module('myApp',[]);
var follows = {};

app.controller('myCtrl',function($http,$scope){
	$http.get('/findUsersFollows').success(function(response){
		$scope.follows = response;
	});
	
	$http.get('/findAllPostsForUser/<%= user %>').success(function(response3){
		var arr = [];
			var jsn = response3;
				for (i in jsn){
					//change date according to client's local time
					var Dates = new Date(jsn[i].DateTime);
					var hours = Dates.getHours();
					jsn[i].DateTime=Dates.toString();
					jsn[i].DateTime = jsn[i].DateTime.split("GMT")[0];
					arr.push(jsn[i]);
				}
		$scope.posts = arr.reverse();
	});
	
	$http.get('/checkFollowButton',{params:{id:"<%= user %>"}}).success(function(response){
		if(response=="false"){
			$("#followButton").html("<a href='/followUser/<%= user %>'>Follow this user</a>");
			$("#followButton").css("visibility","visible");
			console.log("false");
		}else{
			console.log(response);
		}
	});



	
	
});