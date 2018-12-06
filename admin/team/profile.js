var urlParams;

var pageParams = {
	"team":"000"
}
window.onload = function(){
	console.log("Page loaded");
	var currentUrl = new URL(window.location);
	urlParams = new URLSearchParams(currentUrl.search);

	pageParams.team = urlParams.get("team");

	populatePage();	
	
};
function populatePage(){
	var teamNumberInstances = document.getElementsByClassName("data-team-num");
	for(var i = 0; i < teamNumberInstances.length; i++){
		teamNumberInstances[i].innerText = pageParams.team;
	}
}