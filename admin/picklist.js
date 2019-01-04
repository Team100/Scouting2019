/*
 * # What is this file?
 * This file is a mash of various configurations and logic in order to use
 * Will Vile's swiper library. It has been cusomized for the purposes of Team 100
 */


/**
 * A promise to load DOM elements for the various teams
 * [STATUS: INCOMPLETE]
 *
 * @return true completion status
 */
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
/**
 * The page initializer
 * Called from global.js
 */
function loadPage(){
    console.info("Started");
    
    loadDom.then(function(){
        window.console.log("Promise fulfilled");
	loadSwiper();

    });

    
    
}
/**
 * The code to load the swiping library
 */
function loadSwiper(){
    var simpleSwipe = $('.stack-swipe').StackSwipe();
    
    simpleSwipe.on('swipeSuccess', function(event, card, direction) {
        console.log($(card));
        console.log(direction + ' swipe SUCCESS!');
    });
    
    simpleSwipe.on('swipeUnavailable', function(event, direction) {
        alert(direction + ' swipe unavailable!');
    });
    
    simpleSwipe.on('cardsExhausted', function() {
    	window.location = "static/emptyPL.html";
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
