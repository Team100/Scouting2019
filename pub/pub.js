var URL_GET_EVENT = "https://raw.githubusercontent.com/alexanderbeaver799710/t100scoutingremote_resources/master/event.txt";
var eventName;
var data;
var teamNumber;
function getEventName() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            console.log('responseText:' + xmlhttp.responseText);
            eventName = xmlhttp.responseText;
            /*
            try {
                var data = xmlhttp.responseText;

                
            } catch(err) {
                console.log(err.message + " in " + xmlhttp.responseText);
                return;
            }*/
            
        }
        
        
    };
    
    xmlhttp.open("GET", URL_GET_EVENT, true);
    xmlhttp.send();
    handleURLGetEvent();

}

function ajax_json_get(url, callback) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            console.log('responseText:' + xmlhttp.responseText);
            try {
                var data = JSON.parse(xmlhttp.responseText);
            } catch(err) {
                console.log(err.message + " in " + xmlhttp.responseText);
                return;
            }
            callback(data);
        }
    };
    
    xmlhttp.open("GET", url, true);
    xmlhttp.send();

}

function handleURLGetEvent(){
    var db = firebase.firestore();
    db.settings({
        timestampsInSnapshots: true
      });
      var currentUrl = new URL(window.location);
      urlParams = new URLSearchParams(currentUrl.search);
      data = JSON.parse(urlParams.get("data"));
      teamNumber = data.teamNumber;
      putData();

}
function putData(){
    var dbref = db.collection("events").doc(eventName);

    dbref.update({
        
    }).then(function() {
        console.log("Document successfully written!");
    })
    .catch(function(error) {
        console.error("Error writing document: ", error);
    });

}
document.addEventListener('DOMContentLoaded', function () {
    /* your logic here */
    console.log("started load");
    var eventName = ajax_raw_get(URL_GET_EVENT);
    console.log(eventName);
    
 });

