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


function refreshPage(){
    var formNode = document.createElement("div");
    formNode.id = "ps-data";
    ajax_get('pitscout.json', function(data) {
        
        
        
        for(var i = 0; i < data.questions.length; i++){
            
            var q = data.questions[i];
            console.info(data.questions[i]);
            
            var questionNode = document.createElement("div");
            questionNode.setAttribute("id", "psq-"+i);

            if(q.type == "header"){
                var h1 = document.createElement("h1");
                var content = document.createTextNode(q.content);
                h1.appendChild(content);
                questionNode.appendChild(h1);
            }
            else if (q.type == "alert"){
                var alert = document.createElement("div")
                alert.classList.add("alert");
                alert.classList.add("alert-"+q.category);
                alert.setAttribute("role","alert");
                var text = document.createTextNode(q.content);
                alert.appendChild(text);
                questionNode.appendChild(alert);
            }
            
            else{
                var prompt = document.createTextNode(q.prompt);
                questionNode.appendChild(prompt);
                if(q.type == "option"){
                    var selector = document.createElement("select");
                    selector.classList.add("form-control");
                    selector.classList.add("form-control-lg");
                    for(var x = 0; x < q.options.length; x++){
                        var option = document.createElement("option");
                        option.innerText = q.options[x];
                        selector.appendChild(option);
                    }
                    questionNode.appendChild(selector);
                    console.log(questionNode);
                    
                }
                else if(q.type == "num"){
                    var input = document.createElement("input");
                    input.setAttribute("inputmode","numeric");
                    input.setAttribute("pattern","[0-9]*");
                    input.setAttribute("placeholder",q.hint);
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
        document.getElementById("form").appendChild(formNode);
    });

}
function loadPage(){
    refreshPage();
    
}