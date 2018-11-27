var counter = 0;

var pages = {
    LOGIN: "login",
    MATCHSETUP: "match-setup",
    DATAENTRY: "data-entry",
    WOW: "wowPage"
};
var page = pages.LOGIN;

function updateCounter() {
    counter += 1;
}

var timer;


var currentLoaderWidth = 0;
var loaderTimer;

function goToMatchSetUp() {
    page = pages.MATCHSETUP;
    pager();
}

/**
 * The code to run at the start of a match. Instantiates a timer
 **/
function startMatch() {
    page = pages.DATAENTRY;
    timer = window.setInterval(updateCounter(), 1000);
    pager();
}


function pager() {
    var openLoaderAnimation = anime({
        targets: '#loader',
        width: '100%',
        easing: 'easeInOutQuad',
        duration: 500
    });

    var openProimse = openLoaderAnimation.finished.then(function () {
        Object.keys(pages).forEach(function(e) {
            console.log(pages[e]);
            let el = document.getElementById(pages[e]);
            if (el) el.hidden = true;
        });
        document.getElementById(page).hidden = false;
        if (page === pages.WOW) {
            wowText();
        }
        closeLoader();
    });
}

function closeLoader() {
    var dismissLoaderAnimation = anime({
        targets: '#loader',
        width: '0%',
        easing: 'easeInOutQuad',
        duration: 500
    });
    dismissLoaderAnimation.play();
}

function wowText() {

}

pager();