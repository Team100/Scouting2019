/**
 * The parameters from the url
 */

var urlParams;
/**
 * An object with the page parameters in an easy to use format
 */
var pageParams = {
	"team":"000"
}

var jsonDataURL = "https://s3-us-west-2.amazonaws.com/frc100-scouting-asset/pitscout.json";
/**
 * Gets the json data from the file
 * @param {*} url 
 * @param {*} callback 
 */
function ajax_get(url, callback) {
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

/**
 * Loads the page with its form
 */
function refreshPage(){

    var currentUrl = new URL(window.location);
	urlParams = new URLSearchParams(currentUrl.search);

    pageParams.team = urlParams.get("team");
    
    document.getElementById("tn").value=pageParams.team;
    document.getElementById("scouter").value = localStorage.getItem("userID");
    var tnLocations = document.getElementsByClassName("data-team-num");
    for(var i = 0; i < tnLocations.length; i++){
        tnLocations[i].innerText = pageParams.team;
    }


    var formNode = document.createElement("div"); //the div that the form is in
    formNode.id = "ps-data";


    //Load the data from the JSON file using AJAX
    ajax_get(jsonDataURL, function(data) {
        document.getElementById("form").appendChild(formNode);
        document.getElementById("debug").innerText = `SRC: ${jsonDataURL} \n
        DATA: ${JSON.stringify(data)}`;
        
        //Increment through each entry and display it
        for(var i = 0; i < data.questions.length; i++){
            
            /**
             * The question being worked upon
             */
            var q = data.questions[i];
            console.info(data.questions[i]);
            
            var questionNode = document.createElement("div");
            questionNode.setAttribute("id", "psq-"+i);

            if(q.type == "header"){ //Generate a header object
                var h1 = document.createElement("h1");
                var content = document.createTextNode(q.content);
                h1.appendChild(content);
                questionNode.appendChild(h1);
            }
            else if (q.type == "alert"){ //Generate an alert object
                var alert = document.createElement("div")
                alert.classList.add("alert");
                alert.classList.add("alert-"+q.category);
                alert.setAttribute("role","alert");
                var text = document.createTextNode(q.content);
                alert.appendChild(text);
                questionNode.appendChild(alert);
            }
            else if(q.type == "submit"){
                var submit = document.createElement("input");
                submit.setAttribute("type","submit");
                submit.setAttribute("value","submit");
                submit.classList.add("pillButton");
                submit.classList.add("orButton");
                questionNode.appendChild(submit);
            }
            else{ //Any object that has a question number
                var prompt = document.createTextNode(q.prompt);
                questionNode.appendChild(prompt);
                if(q.type == "option"){ //Add a dropdown
                    var selector = document.createElement("select");
                    selector.classList.add("form-control");
                    selector.classList.add("form-control-lg");
                    for(var x = 0; x < q.options.length; x++){
                        var option = document.createElement("option");
                        option.innerText = q.options[x];
                        selector.appendChild(option);
                    }
                    selector.setAttribute("name","q"+i)

                    questionNode.appendChild(selector);
                    console.log(questionNode);
                    
                }
                else if(q.type == "num"){ //Add a number input
                    var input = document.createElement("input");
                    input.setAttribute("inputmode","numeric");
                    input.setAttribute("pattern","[0-9]*");
                    input.setAttribute("placeholder",q.hint);
                    input.setAttribute("name","q"+i)
                    input.classList.add("smallInput");
                    questionNode.appendChild(input);
                }
            }
            
            
            formNode.appendChild(questionNode);
            for(var a = 0; a < 2; a++){
                var br = document.createElement("br");
                formNode.appendChild(br);
            }
        }
        
    });

}
function loadPage(){
    refreshPage();
    
}