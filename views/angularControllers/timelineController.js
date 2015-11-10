var app = angular.module('myApp',[]);
var follows = {};
		
app.controller('myCtrl',function($http,$scope,$sce){
	$http.get('/findUsersFollows').success(function(response){
		$scope.follows = response;
		if(response.length<1){
			$http.get('/findAllPosts').success(function(response4){
				var arr2 = [];
				var jsn = response4;
				for (i in jsn){
					//change date according to client's local time
					var Dates = new Date(jsn[i].DateTime);
					var hours = Dates.getHours();
					jsn[i].DateTime=Dates.toString();
					jsn[i].DateTime = jsn[i].DateTime.split("GMT")[0];
					arr2.push(jsn[i]);
				}
				$scope.posts = arr2.reverse();
			});
		}else{
			$http.get('/findAllPostsForAllUsers',{params: {r:response}}).success(function(response3){
				//response3 comes back as a json
				//we want to convert it to an array
				//each json object is made up of username:String,message:String,DateTime:String
				//we want to take all that information and put it into an array of json objects
				//loop through json then push to array
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
				arr.sort(function(a,b){
					// Turn strings into dates, and then subtract them
					// to get a value that is either negative, positive, or zero and sort accordingly
					return new Date(b.DateTime) - new Date(a.DateTime);
				});

				for(i in arr){
					arr[i].message=arr[i].message+" ";
				}
				$scope.posts = arr;
			});
		}
	});
});
