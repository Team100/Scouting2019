/**
 * Runs each time the window is loaded
 * 
 * Calls loadPage()
 */

var GLOBAL_FOUND = true;
window.onload = function(){
    var loc = location.href.split("/").slice(-1);
    
    if(loc[0] != "index.html" && loc[0] != "login.html" && (typeof localStorage.getItem("userID") == null || localStorage.getItem("userID")=="" )){
        if(loc.length == 1){
            window.location = "./index.html";

        }
        else{
            window.location.pathname = "index.html";
        }
    }
    var backNav = document.getElementsByClassName("goBack");
    for(var i = 0; i < backNav.length; i++){
        backNav[i].onclick = function(){
            window.history.back();
        }
    }

    var menuNav = document.getElementsByClassName("goToMenu");
    for(var i = 0; i < menuNav.length; i++){
        menuNav[i].onclick = function(){
            window.location = "menu.html";
        }
    }
    if(typeof loadPage === "function"){
        console.log("About to load page");
        loadPage();
    }else{
        console.error("loadPage not found");
    }
}
