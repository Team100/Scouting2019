//Copy JSON file below
var questionGenerator = {
    "questions":[
        {
            "type":"header",
            "content":"Robot Performance"
        },
        {
            "type":"option",
            "prompt":"How reliable was their robot?",
            "options":[
                "---",
                "Fatal Issue",
                "Major Issue",
                "Minor Issue",
                "No Issue"
            ]
        },
        {
            "type":"option",
            "prompt":"How good were they at placing scoring objects?",
            "options":[
                "---",
                "Very Bad",
                "Moderately Bad",
                "Okay",
                "Decent",
                "Good"
            ]
        },
        {
            "type":"option",
            "prompt":"How was their Sandstorm performance?",
            "options":[
                "---",
                "Far below average",
                "Below average",
                "Average",
                "Above average",
                "Far above average",
                "Powerhouse Team"
            ]
        },
        {
            "type":"option",
            "prompt":"Robot status",
            "options":[
                "---",
                "Active in match",
                "At field but not moving",
                "Not at field",
                "Event DQ"
            ]
        },
        {
            "type":"option",
            "prompt":"Disqualifiers",
            "options":[
                "---",
                "No Issues",
                "Foul",
                "Tech Foul",
                "Yellow Card",
                "Red Card",
                "Event Disqualified"
            ]
        }
    ]
}