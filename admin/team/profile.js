/**
 * The parameters from the url
 */
var urlParams;

var pageParams = {
	"team":"000"
}

var eventID = "davis";
var eventData;
/**
 * Gets the page parameters and populates the page
 */
function loadPage(){
	console.log("Page loaded");
	var currentUrl = new URL(window.location);
	urlParams = new URLSearchParams(currentUrl.search);

	pageParams.team = urlParams.get("team");

	populatePage();
	document.getElementById("ps").onclick = function(){window.location=`pitscout.html?team=${pageParams.team}`;};
	
}

function updateData(ref){
	this.eventData = ref.data();
}
/**
 * Populates each page element with the appropriate data
 */
function populatePage(){
	var teamNumberInstances = document.getElementsByClassName("data-team-num");
	var data;
	var firestore;
	try{
		firestore = firebase.firestore();

		firestore.settings({
			timestampsInSnapshots: true
		});
	}catch (e) {
		teamNumberInstances.innerText = "Team not found"

		throw new Error("DB failed" + e);
	}

	var docRef = firestore.collection("events").doc(eventID);
	var teamDoc = [];
	docRef.get().then(function(a) {
		if (a.exists) {
			console.log("Document data:", a.data());

			updateData(a);
			console.log("Teamdoc", eventData);
		} else {
			// doc.data() will be undefined in this case
			console.log("No such document!");
			teamDoc = {"Error":"ID"};
		}

		for(var i = 0; i < teamNumberInstances.length; i++){
			teamNumberInstances[i].innerText = pageParams.team;
		}

		console.warn(teamDoc);

		if(!eventData[pageParams.team]){
			alert("TEAM NOT FOUND");
		}
		var teamData = eventData[`${pageParams.team}`];
		console.warn(teamData);

		var smartScoreInstances = document.getElementsByClassName("data-team-smartscore");
		for(var i = 0; i < smartScoreInstances.length; i++){
			smartScoreInstances[i].innerText = teamData.smartScore.weighted.toString();
		}
		var smartScoreUnweightedInstances = document.getElementsByClassName("data-team-smartscore-unweighted");
		for(var i = 0; i < smartScoreUnweightedInstances.length; i++){
			smartScoreUnweightedInstances[i].innerText = teamData.smartScore.unweighted.toString();;
		}

		var tbaRankInstances = document.getElementsByClassName("data-team-tba-rank");
		for(var i = 0; i < tbaRankInstances.length; i++){
			tbaRankInstances[i].innerText = teamData['tba-rank'];
		}
		var reliabilityInstances = document.getElementsByClassName('data-team-reliability');
		for(var i = 0; i < reliabilityInstances.length; i++){
			reliabilityInstances[i].innerText = teamData['lyingIndex'];
		}

		renderTeamScoringData();
		var data = [{
			values: [teamData.scoring.CargoShip, teamData.scoring.CargoRocket, teamData.scoring.HatchShip, teamData.scoring.HatchRocket],
			labels: ['Cargo in Ship', 'Cargo in Rocket', 'Hatch in Ship', 'Hatch in Rocket'],
			type: 'pie'
		}];

		var layout = {

		};

		Plotly.newPlot('scoring', data, layout, {responsive: true});
		document.getElementById('rawData').innerText = JSON.stringify(teamData);
	}).catch(function(error) {
		console.log("Error getting document:", error);
	});

	
}

/**
 * Renders the Plotly.js graph for each team
 */
function renderTeamScoringData(){
	// TODO Update to have actual team scoring data

}
