var urlParams;

var pageParams = {
	"team":"000"
}
function loadPage(){
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

function renderTeamScoringData(){
	// TODO Update to have actual team scoring data
	var data = [{
		values: [19, 26, 55],
		labels: ['Residential', 'Non-Residential', 'Utility'],
		type: 'pie'
	  }];
	  
	  var layout = {
		
	  };
	  
	  Plotly.newPlot('scoring', data, layout, {responsive: true});
}