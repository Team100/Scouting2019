var ps = {
    "questions": [

        {
            "type": "header",
            "content": "Intro"
        },
        {
            "type": "option",
            "prompt": "1. What kind of drivetrain? ",
            "options": [
                "West Coast",
                "Holonomic",
                "Swerve",
                "H-drive",
                "Other"
            ]
        },
        {
            "type": "num",
            "prompt": "2. How many wheels total?",
            "hint": "Enter Here"
        },

        {
            "type": "header",
            "content": "Sandstorm"
        },
        {
            "type": "option",
            "prompt": "3. Cross the line?",
            "options": [
                "No",
                "Yes (unrealiable)",
                "Yes (reliable)"
            ]
        },
        {
            "type": "option",
            "prompt": "4. Cargo",
            "options": [
                "No",
                "Yes (ship)",
                "Yes (rocket)",
                "Yes (both)"
            ]
        },
        {
            "type": "num",
            "prompt": "4a. How Many?",
            "hint": "Enter Here"
        },
        {
            "type": "option",
            "prompt": "5. Hatch",
            "options": [
                "No",
                "Yes (ship)",
                "Yes (rocket)",
                "Yes (both)"

            ]
        },
        {
            "type": "num",
            "prompt": "5a. How Many?",
            "hint": "Enter Here"
        },
        {
            "type": "option",
            "prompt": "6. Starting Pos",
            "options": [
                "Level 1",
                "Level 2 and Level 1"
            ]
        },
        {
            "type": "option",
            "prompt": "7. Driver loading station",
            "options": [
                "No",
                "Yes (unreliable)",
                "Yes (reliable)"
            ]
        },
        {
            "type": "option",
            "prompt": "8. How do they move during Sandstorm?",
            "options": [
                "Do not move",
                "Full Auton",
                "Driver (w/ vision)",
                "Driver (w/o vision)",
                "Auton and driver segments"
            ]
        },
        {
            "type": "option",
            "prompt": "9. Do they have auton driver assistance?",
            "options": [
                "No",
                "Yes (unreliable)",
                "Yes (reliable)"
            ]
        },
        {
            "type": "header",
            "content": "Teleop"
        },
        {
            "type": "option",
            "prompt": "10. Cargo",
            "options": [
                "No",
                "Yes (ship)",
                "Yes (rocket)",
                "Yes (both)"
            ]
        },
        {
            "type": "num",
            "prompt": "10a. How Many? (mark 0 if do not support cargo)",
            "hint": "Enter Here"
        },
        {
            "type": "option",
            "prompt": "11. Hatch",
            "options": [
                "No",
                "Yes (ship)",
                "Yes (rocket)",
                "Yes (both)"

            ]
        },
        {
            "type": "num",
            "prompt": "11a. How Many? (mark 0 if do not support cargo)",
            "hint": "Enter Here"
        },
        {
            "type": "option",
            "prompt": "12. Starting Pos [Mark same as above]",
            "options": [
                "Level 1",
                "Level 2 and Level 1"
            ]
        },
        {
            "type": "option",
            "prompt": "13. Driver Station Loading",
            "options": [
                "No",
                "Yes (unreliable)",
                "Yes (reliable)"
            ]
        },
        {
            "type": "option",
            "prompt": "14. What is the highest level that they can score?",
            "options": [
                "Ship",
                "Rocket LOW",
                "Rocket MED",
                "Rocket HIG",
                "None"
            ]
        },
        {
            "type": "option",
            "prompt": "15. What is their highest endstate?",
            "options": [
                "No Climb",
                "Level 1 (low)",
                "Level 2",
                "Level 3"
            ]
        },
        {
            "type": "option",
            "prompt": "16. Can they assist to endstate?",
            "options": [
                "No Assist",
                "Level 1 (low)",
                "Level 2",
                "Level 3"
            ]
        },
        {
            "type": "header",
            "content": "Reliability"
        },
        {
            "type": "num",
            "prompt": "17. How reliably can they score hatches?",
            "hint": "Enter a whole number to represent a percentage (/100)"
        },
        {
            "type": "num",
            "prompt": "18. How reliably can they score cargo?",
            "hint": "Enter a whole number to represent a percentage (/100)"
        }

    ]
};
