var tosave = [];

function loadPage(){
    var teamsDomRef = document.getElementById('teams');
	document.getElementById("save").onclick = saveContent;
	document.getElementById("load").onclick = loadData;
	loadData();
	
}

function loadData(){
	var teams = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
	var teamsDomRef = document.getElementById('teams');
	teamsDomRef.innerHTML = "";

	for(var i = 0; i < teams.length; i++){
		var li = document.createElement('li');
		var div1 = document.createElement('div');
		div1.className = "uk-card uk-card-default uk-card-body";
		var handle = document.createElement('span');
		handle.className = "uk-sortable-handle uk-margin-small-right";
		handle.setAttribute('uk-icon', 'icon: table');
		
		var teamNumSpan = document.createElement('span');
		teamNumSpan.className = "teamnum";
		
		var teamNumTextNode = document.createTextNode(teams[i]);
		teamNumSpan.appendChild(teamNumTextNode);
		div1.appendChild(handle);
		div1.appendChild(teamNumSpan);
		li.appendChild(div1);
		teamsDomRef.appendChild(li);

	}
}

function saveContent(){
	tosave = [];
	var topLevel = document.getElementsByClassName("teamnum");
	console.log(topLevel);
	//console.warn(topLevel.length);
	
	for(var i = 0; i < topLevel.length; i++){
		console.info('adding ' + i);
			var teamNumber = topLevel[i].innerText;
			//console.log(teamNumber);
			var data = {'teamnum':teamNumber, 'rank':i};
			//console.log(JSON.stringify(data));
			tosave.push(data);
			//console.info(data);
		
	}
	console.log(tosave);
	
}