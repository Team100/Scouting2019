const functions = require('firebase-functions');
const admin = require("firebase-admin");

admin.initializeApp(functions.config().firebase);
admin.firestore().settings({timestampsInSnapshots: true});

// TODO: get config from database
const EVENT = "2019cada";

// TODO: update for 2019 game
exports.ingress = functions.https.onRequest((request, response) => {
    try {
        // Validate that data exists
        if (!request.query.hasOwnProperty("data")) {
            response.status(400).send(JSON.stringify({"status": "error","reason": "Invalid request"}));
            return;
        }

        // Convert query data into JSON
        let data = JSON.parse(request.query.data);

        // Validate json data
        // Currently only for match data
        // TODO: pit data
        if (!data.hasOwnProperty("switch")) {
            response.status(400).send(JSON.stringify({"status": "error", "reason": "Invalid JSON format"}));
            return;
        } else if (!data.hasOwnProperty("scale")) {
            response.status(400).send(JSON.stringify({"status": "error", "reason": "Invalid JSON format"}));
            return;
        } else if (!data.hasOwnProperty("exchange")) {
            response.status(400).send(JSON.stringify({"status": "error", "reason": "Invalid JSON format"}));
            return;
        } else if (!data.hasOwnProperty("disable")) {
            response.status(400).send(JSON.stringify({"status": "error", "reason": "Invalid JSON format"}));
            return;
        } else if (!data.hasOwnProperty("brownout")) {
            response.status(400).send(JSON.stringify({"status": "error", "reason": "Invalid JSON format"}));
            return;
        } else if (!data.hasOwnProperty("break")) {
            response.status(400).send(JSON.stringify({"status": "error", "reason": "Invalid JSON format"}));
            return;
        } else if (!data.hasOwnProperty("crossline")) {
            response.status(400).send(JSON.stringify({"status": "error", "reason": "Invalid JSON format"}));
            return;
        } else if (!data.hasOwnProperty("endstate")) {
            response.status(400).send(JSON.stringify({"status": "error", "reason": "Invalid JSON format"}));
            return;
        } else if (!data.hasOwnProperty("metadata")) {
            response.status(400).send(JSON.stringify({"status": "error", "reason": "Invalid JSON format"}));
            return;
        } else if (!data.metadata.hasOwnProperty("matchNumber")) {
            response.status(400).send(JSON.stringify({"status": "error", "reason": "Invalid JSON format"}));
            return;
        } else if (!data.metadata.hasOwnProperty("scouter")) {
            response.status(400).send(JSON.stringify({"status": "error", "reason": "Invalid JSON format"}));
            return;
        } else if (!data.metadata.hasOwnProperty("teamName")) {
            response.status(400).send(JSON.stringify({"status": "error", "reason": "Invalid JSON format"}));
            return;
        }

        // Update current value in event
        admin.firestore().collection("events").doc(EVENT).get().then(doc => {
            if (!doc.exists) {
                response.status(400).send(JSON.stringify({"status": "error", "reason": "Could not retrieve current events from database"}));
                return;
            }

            let team = doc.data()[data.metadata.teamName];

            team.matches.push(data);
            
            let sumSwitch = 0;
            let sumScale = 0;
            let sumExchange = 0;
            for (let match of team.matches) {
                sumSwitch += match.switch.length;
                sumScale += match.scale.length;
                sumExchange += match.exchange.length;
            }
            team.scoring.switch = sumSwitch/team.matches.length;
            team.scoring.scale = sumScale/team.matches.length;
            team.scoring.exchange = sumExchange/team.matches.length;

            // TODO: add processing for lyingIndex, smartScore, & tba-rank

            admin.firestore().collection("events").doc(EVENT).update({"254": team}).then(() => {
                response.status(200).send(JSON.stringify({"status": "success"}))
                return;
            }).catch(err => {
                // Return generic error and log actual
                console.error("Error getting current event document:", err);
                response.status(500).send(JSON.stringify({"status": "error", "reason": "Could not retrieve data from the database"}));
                return;
            });
        }).catch(err => {
            // Return generic error and log actual
            console.error("Error getting current event document:", err);
            response.status(500).send(JSON.stringify({"status": "error", "reason": "Could not retrieve data from the database"}));
            return;
        });
    } catch (e) {
        // Catch all for errors
        console.error(e);
        response.status(500).send(JSON.stringify({"status": "error", "reason": "Something went wrong and we're looking into it"}));
    }
});

// Usage:
// - get data from TBA
//   - https://www.thebluealliance.com/api/v3/event/{EVENT_KEY}/rankings
// - pipe data to this function
exports.tba = functions.https.onRequest((request, response) => {
    // Check if post request
    if (request.method !== "POST") {
        response.status(405).send(JSON.stringify({"status": "error", "reason": "Method not allowed"}));
        return;
    }

    // Convert TBA format to custom format
    let rankings = {};
    for (let team of request.body.rankings) {
        rankings[team.team_key.replace("frc", "") + "." + "tba-rank"] = team.rank;
    }

    // Send to firestore
    admin.firestore().collection("events").doc(EVENT).update(rankings).then(() => {
        // Return success
        response.status(200).send(JSON.stringify({"status": "success"}));
        return;
    }).catch(err => {
        // Return generic error and log actual
        console.error("Error getting current event document:", err);
        response.status(500).send(JSON.stringify({"status": "error", "reason": "Could not retrieve data from the database"}));
        return;
    });
});
