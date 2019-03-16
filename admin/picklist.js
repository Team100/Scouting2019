/*
 * # What is this file?
 * This file is a mash of various configurations and logic in order to use
 * Will Vile's swiper library. It has been cusomized for the purposes of Team 100
 */

var EVENT_ID = '2019casf'; //TODO Update EventID

var teams = [];
// Initialize Firebase

var addedTeams = [];
var config = {
    apiKey: "AIzaSyDb93QE2tpS5ROHIBfbMh_re5Ogg-nsCzA",
    authDomain: "scouting-2019-team-100.firebaseapp.com",
    databaseURL: "https://scouting-2019-team-100.firebaseio.com",
    projectId: "scouting-2019-team-100",
    storageBucket: "scouting-2019-team-100.appspot.com",
    messagingSenderId: "922379069595"
};
firebase.initializeApp(config);
var db = firebase.firestore();
var currIndex = 0;


/**
 * A promise to load DOM elements for the various teams
 * [STATUS: INCOMPLETE]
 *
 * @return true completion status
 */

var loadDom = new Promise(function(resolve, reject) {

    resolve(true);
  });
/**
 * The page initializer
 * Called from global.js
 */
function loadPage(){
    console.info("Started");

    db.collection("events").doc(`${EVENT_ID}`).collection('picklist').doc('global').get().then(function(doc) {
        // Document was found in the cache. If no cached document exists,
        // an error will be returned to the 'catch' block below.
        var docData = doc.data();
        console.info(doc.data());

        if(docData.currentIndex){
            this.currIndex = docData.currentIndex;
        }
        else{
            this.currIndex = 0;

        }
        promiseLevel1();


    }).catch(function(error) {
        console.log("Error getting cached document:", error);
        this.currIndex = 0;
        promiseLevel1();
    });



    
    
}
function promiseLevel1(){
    db.collection("events").doc(`${EVENT_ID}`).get().then(function(doc) {
        teams = [];
        var objectKeys = Object.keys(doc.data());
        for(var i = 0; i < objectKeys.length; i++){
            teams.push(objectKeys[i]);

        }
        console.log(teams);
        var cardStack = document.getElementById('swiper-stack');
        cardStack.innerHTML = "";

        for(var i = 0; i < teams.length; i++){
            var li = document.createElement('li');
            li.setAttribute('data-swipe-right', "true");
            li.setAttribute('data-swipe-left', "true");
            var header = document.createElement('h1');
            var text = document.createTextNode(teams[i]);
            header.appendChild(text);
            li.appendChild(header);
            cardStack.appendChild(li);
            console.log(li);
        }
        console.info('began promise');

        loadDOMContent();
    });
}

function loadDOMContent(){
    console.log("Starting loadDOMContent");
    var pickHolder = document.getElementById("swiper-stack");

    loadSwiper();

}
/**
 * The code to load the swiping library
 */
function loadSwiper(){
    addedTeams = [];
    var simpleSwipe = $('.stack-swipe').StackSwipe();
    
    simpleSwipe.on('swipeSuccess', function(event, card, direction) {
        console.log($(card));
        console.log(direction + ' swipe SUCCESS!');
        if(direction == 'left'){
            // Rejected
        }
        else if(direction == 'right'){
            addedTeams.push(teams[currIndex]);

        }
        currIndex += 1;


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
