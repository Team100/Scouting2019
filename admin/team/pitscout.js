/**
 * The parameters from the url
 */

var urlParams;
/**
 * An object with the page parameters in an easy to use format
 */
var pageParams = {
	"team":"000"
};

var jsonDataURL = "https://s3-us-west-2.amazonaws.com/frc100-scouting-asset/pitscout.json";
var data;
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

    document.getElementById("form").onsubmit = processData
    data = {
        "type":"pit",
        
    };
    document.getElementById("data_commit").onclick = processData;
    generatePitScout();


}

function generatePitScout() {
    var formNode = document.getElementById("form");
    //document.getElementById("debug").innerText = `SRC: ${jsonDataURL} \n`
    var data = ps;
    //Increment through each entry and display it
    var inc = 0;
    for (var i = 0; i < data.questions.length; i++) {

        /**
         * The question being worked upon
         */
        var q = data.questions[i];
        console.info(data.questions[i]);

        var questionNode = document.createElement("div");

        if (q.type == "header") { //Generate a header object
            questionNode.setAttribute('id',"head-"+i);
            var h1 = document.createElement("h1");
            var content = document.createTextNode(q.content);
            h1.appendChild(content);
            questionNode.appendChild(h1);
        } else if (q.type == "alert") { //Generate an alert object
            var alert = document.createElement("div");
            alert.classList.add("alert");
            alert.classList.add("alert-" + q.category);
            alert.setAttribute("role", "alert");
            var text = document.createTextNode(q.content);
            alert.appendChild(text);
            questionNode.appendChild(alert);
        } else if (q.type == "submit") {
            var submit = document.createElement("input");
            submit.setAttribute("type", "submit");
            submit.setAttribute("value", "submit");
            submit.classList.add("pillButton");
            submit.classList.add("orButton");
            questionNode.appendChild(submit);
        } else { //Any object that has a question number
            questionNode.setAttribute("id", "psq-" + inc);

            var prompt = document.createTextNode(q.prompt);
            questionNode.appendChild(prompt);
            if (q.type == "option") { //Add a dropdown
                var selector = document.createElement("select");
                selector.classList.add("form-control");
                selector.classList.add("form-control-lg");
                for (var x = 0; x < q.options.length; x++) {
                    var option = document.createElement("option");
                    option.innerText = q.options[x];
                    selector.appendChild(option);
                }
                selector.setAttribute("name", "q" + inc);

                questionNode.appendChild(selector);
                console.log(questionNode);

            } else if (q.type == "num") { //Add a number input
                var input = document.createElement("input");
                input.setAttribute("inputmode", "numeric");
                input.setAttribute("pattern", "[0-9]*");
                input.setAttribute("placeholder", q.hint);
                input.setAttribute("name", "q" + inc);
                input.classList.add("smallInput");
                questionNode.appendChild(input);
            }
            inc += 1;
        }


        formNode.appendChild(questionNode);
        for (var a = 0; a < 2; a++) {
            var br = document.createElement("br");
            formNode.appendChild(br);
        }
    }

}

function processData(){
    var formChildren = document.getElementById("form");
    console.error("In Process Data")
    console.info(formChildren.children.length);
    console.info(formChildren);
    for(var i = 0; i < formChildren.children.length; i++){
        try{
        console.info(i);
        if(formChildren[i].name != "" && formChildren[i].name != null){
            try {
                data[formChildren[i].name] = formChildren[i].value;
                
            } catch (error) {
                window.console.error(error);
            }
        }
        else if(formChildren[i][0].name != ""){
            try {
                data[formChildren[i].name] = formChildren[i].value;
                
            } catch (error) {
                window.console.error(error);
            }
        }
    }catch(error){
        console.error(error);
    }

        
    }

    window.open(`https://us-central1-scouting-2019-team-100.cloudfunctions.net/ingress?type=pit&data=${JSON.stringify(data)}`,'_blank');
}
function loadPage(){
    refreshPage();
    
}