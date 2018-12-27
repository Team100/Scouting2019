
$(document).ready(function() {
    console.info("Started");
    var pickHolder = document.getElementsByClassName("stack-swipe-stack")[0];
    var team = {
        "num": 123,
        "score": 12345
    }

    for(var i = 0; i < 10; i ++){
        var teamCard = document.createElement("li");
        teamCard.setAttribute("data-swipe-right", "true");
        teamCard.setAttribute("data-swipe-left","true");
        var teamNum = document.createElement("h1");
        var teamNumText = document.createTextNode(team.num);
        teamNum.appendChild(teamNumText);
        teamCard.appendChild(teamNum);
        pickHolder.appendChild(teamCard);
    }

    var simpleSwipe = $('.stack-swipe').StackSwipe();
    
    simpleSwipe.on('swipeSuccess', function(event, card, direction) {
        console.log($(card));
        alert(direction + ' swipe SUCCESS!');
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
});