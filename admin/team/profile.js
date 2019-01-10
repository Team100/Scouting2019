/**
 * The parameters from the url
 */
var urlParams;

var pageParams = {
	"team":"000"
}
/**
 * Gets the page parameters and populates the page
 */
function loadPage(){
	console.log("Page loaded");
	var currentUrl = new URL(window.location);
	urlParams = new URLSearchParams(currentUrl.search);

	pageParams.team = urlParams.get("team");

	populatePage();	
	
};
/**
 * Populates each page element with the appropriate data
 */
function populatePage(){
	var teamNumberInstances = document.getElementsByClassName("data-team-num");
	for(var i = 0; i < teamNumberInstances.length; i++){
		teamNumberInstances[i].innerText = pageParams.team;
	}

	var smartScoreInstances = document.getElementsByClassName("data-team-smartscore");
	for(var i = 0; i < smartScoreInstances.length; i++){
		smartScoreInstances[i].innerText = "123";
	}

	var tbaRankInstances = document.getElementsByClassName("data-team-tba-rank");
	for(var i = 0; i < tbaRankInstances.length; i++){
		tbaRankInstances[i].innerText = "1";
	}
	renderTeamScoringData();
	
}

/**
 * Renders the Plotly.js graph for each team
 */
function renderTeamScoringData(){
	// TODO Update to have actual team scoring data
	var data = [{
		values: [19, 26, 55, 20],
		labels: ['Cargo in Ship', 'Cargo in Rocket', 'Hatch in Ship', 'Hatch in Rocket'],
		type: 'pie'
	  }];
	  
	  var layout = {
		
	  };
	  
	  Plotly.newPlot('scoring', data, layout, {responsive: true});
}