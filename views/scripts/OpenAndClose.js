var followListButton = $("#followListButton");
var followList = $("#followList");
$(document).ready(function(){
	followListButton.mouseenter(function(){
		followList.css("visibility","visible");
	});
	followListButton.mouseleave(function(){
		followList.css("visibility","hidden");
	});
	followList.mouseenter(function(){
		followList.css("visibility","visible");
	});
	followList.mouseleave(function(){
		followList.css("visibility","hidden");
	});
;})

var collapsed=false;

//code to open and collapse menu on mobile
var btnCollapseMenu = $("#btnCollapseMenu");
var menu = $("#menubar");
btnCollapseMenu.click(function(){
	if(!collapsed){
		menu.css("visibility","hidden");
		collapsed=true;
	}else{
		menu.css("visibility","visible");
		collapsed=false;
	}
});