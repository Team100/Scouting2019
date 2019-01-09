var pages = {
    LOGIN: "login",
    MATCHSETUP: "match-setup",
    DATAENTRY: "data-entry",
    WOW: "wowPage",
    ENDPOS: "endPos",
    QR:"qr"
};


var data;
var page = pages.LOGIN;

var scouter = 0;

var currentLoaderWidth = 0;
var loaderTimer;

function goToMatchSetUp() {
    
    if(document.getElementById("studid").value){
        console.log(document.getElementById("studid").value);
        scouter = document.getElementById("studid").value;
        page = pages.MATCHSETUP;
        pager();
    }
    
}

function registerButtonTaps(){
	/*
	 * I am unsure if Cordova will handle the inline onclicks properly.
	 * I have not tested it, but we will need to replace all of them with
	 * this format if it doesn't support inline onclick
	 */
	document.getElementById("login-login").addEventListener('click',goToMatchSetUp);
	document.getElementById("matchsetup-start").addEventListener('click',startMatch);
}

/**
 * The code to run at the start of a match. Instantiates a timer
 **/
function startMatch() {
    if(document.getElementById("matchnum").value && document.getElementById("teamnum").value){
        data = {
            HatchRocket: [],
            HatchShip: [],
            CargoRocket: [],
            CargoShip:[],
            disable: false,
            brownout: false,
            break: false,
            crossline: false,
            endstate: -1,
            metadata: {
                matchNumber: -1,
                scouter: -1,
                teamNumber: -1
            }
        };
        page = pages.DATAENTRY;
        data.metadata.scouter = scouter;
        data.metadata.matchNumber = document.getElementById("matchnum").value;
        data.metadata.teamNumber = document.getElementById("teamnum").value;
        console.log(data)
        pager();
    }
    
}


function pager() {
    var openLoaderAnimation = anime({
        targets: '#loader',
        width: '100%',
        easing: 'easeInOutQuad',
        duration: 500
    });

    var openProimse = openLoaderAnimation.finished.then(function () {
        Object.keys(pages).forEach(function (e) {
            let el = document.getElementById(pages[e]);
            if (el) el.hidden = true;
        });
        document.getElementById(page).hidden = false;
       
        if (page === pages.DATAENTRY) {
            let modetxt = document.getElementById("mode");
            modetxt.innerText = "Autonomous: ";
            mode = 1;
            startTimer();
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

var uniTimer = 0;
var timer;
var timerInterval;
var mode = 1;

let HatchRocketp;
let HatchShipp;
let CargoRocketp;
let CargoShipp;

let disable;
let brownout;
let breakb;
let crossline;

window.onload = function () {
	registerButtonTaps();	
    HatchRocketp = document.getElementById("hatch-rocket-count");
    HatchShipp = document.getElementById("hatch-ship-count");
    CargoRocketp = document.getElementById("cargo-rocket-count");
    CargoShipp = document.getElementById("cargo-ship-count");
    timer = document.getElementById("time");

    disable = (document.getElementById("base")).getElementsByClassName("yeButton")[0];
    brownout = (document.getElementById("base")).getElementsByClassName("bluButton")[0];
    breakb = (document.getElementById("base")).getElementsByClassName("grButton")[0];
    crossline = (document.getElementById("base")).getElementsByClassName("orButton")[0];

    disable.onclick = function () {
        data.disable = !data.disable;
        disable.classList.remove("yeButtons");
        if (data.disable) {
            disable.classList.add("yeButtons");
        }
    };

    brownout.onclick = function () {
        data.brownout = !data.brownout;
        brownout.classList.remove("bluButtons");
        if (data.brownout) {
            brownout.classList.add("bluButtons");
        }
    };

    breakb.onclick = function () {
        data.break = !data.break;
        breakb.classList.remove("grButtons");
        if (data.break) {
            breakb.classList.add("grButtons");
        }
    };

    crossline.onclick = function () {
        data.crossline = !data.crossline;
        crossline.classList.remove("orButtons");
        if (data.crossline) {
            crossline.classList.add("orButtons");
        }
    };



    var assistClimb = document.getElementById("ep-assist-climb");
    var climb = document.getElementById("ep-self-climb");
    var assistedClimb = document.getElementById("ep-assisted-climb");
    var noClimb = document.getElementById("ep-none");

    assistClimb.onclick = function(){
        data.endstate = 0;
        goToQRPage();
    }
    climb.onclick = function(){
        data.endstate = 1;
        goToQRPage();
    }
    assistedClimb.onclick = function(){
        data.endstate = 2;
        goToQRPage();
    }
    noClimb.onclick = function(){
        data.endstate = 3;
        goToQRPage();
    }


    var doneButton = document.getElementById("qr-done");
    doneButton.onclick = function(){
        data = {};
        page = pages.MATCHSETUP;
        pager();
    }
};

var time = 30;

function startTimer(a) {
    timerInterval = setInterval(countDown, 100, 0.1);
    uniTimerInterval = setInterval(function (a) {
        uniTimer += a;
        uniTimer = Math.round(uniTimer * 10) / 10;
    }, 100, 0.1);
}

function countDown(a) {
    time -= a;
    let txt = "" + Math.round((time < 0 ? (3.5 + time) / 10 : time) * 10) / 10 * (time < 0 ? 10 : 1);
    if (time >= 0) {
        txt = txt.length < 3 ? txt + ".0" : txt;
        txt = txt.length < 4 ? "&nbsp;" + txt : txt;
    } else if (mode === 1) {
        let modetxt = document.getElementById("mode");
        modetxt.innerText = "";
        if (txt === "3") timer.style.color = "#1fdd10";
        if (txt === "2") timer.style.color = "#f6a314";
        if (txt === "1") timer.style.color = "#dd262c";
    }
    if (mode === 2) {
        txt = time < 0 ? "" + 0.0 : "" + Math.round(time * 10) / 10;
        txt = txt.length < 4 ? txt + ".0" : txt;
        txt = txt.length < 5 ? "&nbsp;" + txt : txt;
        if (time < 10) {
            txt = "&nbsp;&nbsp;" + (time < 0 ? "0.0" : Math.round(time * 10) / 10);
            if (Math.round(time * 10) / 10 === Math.round(time)) txt += ".0";
        }
        if (time < 0) txt = "&nbsp;&nbsp;0.0";
        timer.style.color = "#000000";
    }
    timer.innerHTML = txt + "s";
    if (time <= -3 && mode === 1) {
        clearInterval(timerInterval);
        startTele();
        mode = 2;
    }
    if(time <= 0 && mode === 2){
        clearInterval(timerInterval);
        page = pages.ENDPOS;
        pager();
    }
}

function startTele() {
    timer.style.color = "#000000";
    time = 132;
    timer.innerText = "132.0";
    timerInterval = setInterval(countDown, 100, 0.1);
    let modetxt = document.getElementById("mode");
    modetxt.innerText = "Teleop: ";
}



var lastHatchRocket;
var HatchRocketDeleteTime = -10;

function updateHRCount(n) {
    if (n === 1 && uniTimer - HatchRocketDeleteTime < 3) {
        data.HatchRocket.push(lastHatchRocket);
        HatchRocketDeleteTime = -10;
    }
    else if (n === 1) {
        data.HatchRocket.push(uniTimer);
    }
    else {
        HatchRocketDeleteTime = uniTimer;
        lastHatchRocket = data.HatchRocket.pop();
    }
    HatchRocketp.innerText = data.HatchRocket.length;
}

var lastHatchShip;
var HatchShipDeleteTime = -10;

function updateHSCount(n) {
    if (n === 1 && uniTimer - HatchShipDeleteTime < 3) {
        data.HatchShip.push(lastHatchShip);
        HatchShipDeleteTime = -10;
    }
    else if (n === 1) {
        data.HatchShip.push(uniTimer);
    }
    else {
        HatchShipDeleteTime = uniTimer;
        lastHatchShip = data.HatchShip.pop();
    }
    HatchShipp.innerText = data.HatchShip.length;
}

var lastCargoRocket;
var CargoRocketDeleteTime = -10;



function updateCRCount(n) {
    if (n === 1 && uniTimer - CargoRocketDeleteTime < 3) {
        data.CargoRocket.push(lastCargoRocket);
        CargoRocketDeleteTime = -10;
    }
    else if (n === 1) {
        data.CargoRocket.push(uniTimer);
    }
    else {
        CargoRocketDeleteTime = uniTimer;
        lastCargoRocket = data.CargoRocket.pop();
    }
    CargoRocketp.innerText = data.CargoRocket.length;
}
var lastCargoShip;
var CargoShipDeleteTime = -10;
function updateCSCount(n) {
    if (n === 1 && uniTimer - CargoShipDeleteTime < 3) {
	data.CargoShip.push(lastCargoShip);
        CargoShipDeleteTime = -10;
    }
    else if (n === 1) {
        data.CargoShip.push(uniTimer);
    }
    else {
        CargoShipDeleteTime = uniTimer;
        lastCargoShip = data.CargoShip.pop();
    }
    CargoShipp.innerText = data.CargoShip.length;
}

function updateEndStatus(n){
    if(n >= -1){
        data.endstate = n;
    }
}

function goToQRPage(){
    page = pages.QR;
    var widthToSet = 0;
    if(window.innerWidth < window.innerHeight - 64){
        widthToSet = window.innerWidth;
        console.info("Width is less");
    }
    else{
        widthToSet = window.innerHeight - 64;
        console.info("Height is less");
    }
    var qrcode = new QRCode("qrcode", {
        
        text: JSON.stringify(data),
        width: widthToSet,
        height: widthToSet,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.L
        
    });
    pager();
}
