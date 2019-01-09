/**
 * Runs each time the window is loaded
 * 
 * Calls loadPage()
 */
window.onload = function(){
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
        loadPage();
    }
}