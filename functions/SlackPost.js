https = require('https');

function generalPost(imgURL,title,message){

    var url = `https://slack.com/api/chat.postMessage?channel=C4AEPBZMY&token=xoxp-47875372407-232118454099-544608978016-5902d4742bab5c70cb77d1f405ee790d&text=${message}&username=${title}&icon_url=${imgURL}`
    https.get(url);

}

function errorPost(title, message){
    generalPost("https://s3-us-west-2.amazonaws.com/frc100-scouting-asset/ico/ERROR.png",title,message);
}
function okPost(title,message){
    generalPost("https://s3-us-west-2.amazonaws.com/frc100-scouting-asset/ico/OK.png",title,message);
}
function infoPost(title,message) {
    generalPost("https://s3-us-west-2.amazonaws.com/frc100-scouting-asset/ico/INFO.png", title, message);

}
function fatalPost(title,message){
    generalPost("https://s3-us-west-2.amazonaws.com/frc100-scouting-asset/ico/FATAL.png",title,message);
}
function labPost(title,message){
    generalPost("https://s3-us-west-2.amazonaws.com/frc100-scouting-asset/ico/LABS.png",title,message);
}

