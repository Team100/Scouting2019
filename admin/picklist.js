$(document).ready(function() {
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