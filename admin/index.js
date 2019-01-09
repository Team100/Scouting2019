/**
 * The value of the user pin to check against
 */
var pinInput = document.getElementById("pin");
/**
 * Functions called to load page
 */
function loadPage(){
    
    document.getElementById("logInBTN").onclick = function(){
        if(pinInput.value != ""){
            window.location = "login.html?id="+pinInput.value;
        }
        
    }
}