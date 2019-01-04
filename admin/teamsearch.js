function loadPage(){
    var goButton = document.getElementById('goButton');
    var teamNum = document.getElementById('teamNum');

    goButton.onclick = function(){
        if(teamNum.value == ''){
            console.error(teamNum.value + " is invalid")
        }
        else{
            window.location = 'team/profile.html?team='+teamNum.value;
            console.log('transitioning');
        }
    }
}