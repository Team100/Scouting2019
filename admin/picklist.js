

var loadDom = new Promise(function(resolve, reject) {
    
    var pickHolder = document.getElementById("swiper-stack");
    var team = {
        "num": 123,
        "score": 12345
    };
    for(var i = 0; i < 10; i ++){
        var teamCard = document.createElement("li");
        teamCard.setAttribute("data-swipe-right", "true");
        teamCard.setAttribute("data-swipe-left","true");
        var teamNum = document.createElement("h1");
        var teamNumText = document.createTextNode(team.num);
	var teamScore = document.createElement("h2");
	var teamScoreText = document.createTextNode(team.score);
	teamScore.appendChild(teamScoreText);
        teamNum.appendChild(teamNumText);
        teamCard.appendChild(teamNum);
	teamCard.appendChild(teamScore);
        pickHolder.appendChild(teamCard);
    }
    
    resolve(true);
  });
function loadPage(){
    console.info("Started");
    
    loadDom.then(function(){
        window.console.log("Promise fulfilled");
	loadSwiper();

    });

    
    
}
function loadSwiper(){
    var simpleSwipe = $('.stack-swipe').StackSwipe();
    
    simpleSwipe.on('swipeSuccess', function(event, card, direction) {
        console.log($(card));
        console.log(direction + ' swipe SUCCESS!');
    });
    
    /*
    simpleSwipe.on('swipeUnavailable', function(event, direction) {
        alert(direction + ' swipe unavailable!');
    });
    */
    
    simpleSwipe.on('cardsExhausted', function() {
        console.log('All cards exhausted');
    });
    
    /*
    simpleSwipe.on('swipeStart', function() {
        console.log('swipe started');
    });
    */
    
    /*
    simpleSwipe.on('swipeDrop', function() {
        console.log('swipe dropped');
    });
    */
    
    /*
    simpleSwipe.on('swipeMove', function(event, coords) {
        console.log(coords.x);
        console.log(coords.y);
        */
};
