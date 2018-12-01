var counter = 0;

var pages = {
    LOGIN:"login",
    METADATA:"metadata",
    AUTON:"auton",
    WOW: "wowPage"
};
var page;

var currentLoaderWidth = 0;
var loaderTimer;


function updateCounter(){
	counter += 1;

}
var timer;


function goToMetadata(){
    page = pages.METADATA;
    pager();
}
/**
  * The code to run at the start of a match. Instantiates a timer
 **/
function startMatch(){
    page = pages.AUTON;
	timer = window.setInterval( updateCounter(),1000);
	pager();
}


function pager(){

    var openLoaderAnimation = anime({
        targets: '#loader',
        width: '100%',
        easing: 'easeInOutQuad',
        duration: 500
    });
    var openProimse = openLoaderAnimation.finished.then( function() {
    if(page == pages.LOGIN){
        document.getElementById(pages.LOGIN).hidden = false;
        document.getElementById(pages.METADATA).hidden = true;
        document.getElementById(pages.AUTON).hidden = true;
        document.getElementById(pages.WOW).hidden = true;

    }
    else if (page == pages.METADATA){
        document.getElementById(pages.LOGIN).hidden = true;
        document.getElementById(pages.METADATA).hidden = false;
        document.getElementById(pages.AUTON).hidden = true;
        document.getElementById(pages.WOW).hidden = true;

    }
    else if (page == pages.AUTON){
        document.getElementById(pages.LOGIN).hidden = true;
        document.getElementById(pages.METADATA).hidden = true;
        document.getElementById(pages.AUTON).hidden = false;
        document.getElementById(pages.WOW).hidden = true;
    }
    else if(page == pages.WOW){
        document.getElementById(pages.LOGIN).hidden = true;
        document.getElementById(pages.METADATA).hidden = true;
        document.getElementById(pages.AUTON).hidden = true;
        document.getElementById(pages.WOW).hidden = false;
        wowText();
    }
    closeLoader();


    });
}

function closeLoader(){

    var dismissLoaderAnimation = anime({
        targets: '#loader',
        width: '0%',
        easing: 'easeInOutQuad',
        duration: 500
    });
    dismissLoaderAnimation.play();
}

function wowText(){

}


page = pages.LOGIN;
pager();