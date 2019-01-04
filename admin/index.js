var pinInput = document.getElementById("pin");
function loadPage(){
    
    document.getElementById("logInBTN").onclick = function(){
        if(pinInput.value != ""){
            window.location = "login.html?id="+pinInput.value;
        }
        
    }
}