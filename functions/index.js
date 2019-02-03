const functions = require('firebase-functions');
const admin = require("firebase-admin");
const utils = require("./validate");

admin.initializeApp(functions.config().firebase);
admin.firestore().settings({timestampsInSnapshots: true});

// TODO: get config from database
const EVENT = "davis";
const MatchFields =  {
    HatchRocket: {
        type: "array",
        contains: {
            type: "number"
        }
    },
    HatchShip: {
        type: "array",
        contains: {
            type: "number"
        }
    },
    CargoRocket: {
        type: "array",
        contains: {
            type: "number"
        }
    },
    CargoShip: {
        type: "array",
        contains: {
            type: "number"
        }
    },
    disable: {
        type: "boolean"
    },
    brownout: {
        type: "boolean"
    },
    break: {
        type: "boolean"
    },
    crossline: {
        type: "boolean"
    },
    endstate: {
        type: "number"
    },
    metadata: {
        type: "object",
        properties: {
            matchNumber: {
                type: "string"
            },
            scouter: {
                type: "string"
            },
            teamNumber: {
                type: "string"
            }
        }
    },
    start: {
        type: "number"
    }
};
const PitFields = {};

/*
Expected JSON format:
{
    "type": "match" | "pit",
    "data": {...}
}
*/
exports.ingress = functions.https.onRequest((request, response) => {
    try {
        // Check if POST request
        if (request.method !== "POST") {
            response.status(405).send(JSON.stringify({"status": "error", "reason": "Method not supported"}));
            return;
        }

        // Validate that data is json
        if (typeof request.body !== "object") {
            response.status(400).send(JSON.stringify({"status": "error","reason": "Invalid request"}));
            return;
        }

        // Validate json data
        if (!request.body.hasOwnProperty("type")) {
            response.status(400).send(JSON.stringify({"status": "error", "reason": "Invalid JSON: must have 'type' field"}));
            return;
        } else if (!request.body.hasOwnProperty("data")) {
            response.status(400).send(JSON.stringify({"status": "error", "reason": "Invalid JSON: must have 'data' field"}));
            return;
        } else if (request.body.type === "match") if (!utils.validateJSON(request.body.data), MatchFields) {
            response.status(400).send(JSON.stringify({"status": "error", "reason": `Invalid JSON: data does not match format for type '${request.body.type}'`}));
            return;
        } else if (request.body.type === "pit") if (!utils.validateJSON(request.body.data), PitFields) {
            response.status(400).send(JSON.stringify({"status": "error", "reason": `Invalid JSON: data does not match format for type '${request.body.type}'`}));
            return;
        } else {
            response.status(400).send(JSON.stringify({"status": "error", "reason": `Invalid JSON: unknown type '${request.body.type}'`}));
            return;
        }

        // Update current value in event
        admin.firestore().collection("events").doc(EVENT).get().then(doc => {
            if (!doc.exists) {
                response.status(400).send(JSON.stringify({"status": "error", "reason": "Could not retrieve current events from database"}));
                return;
            }

            let team = doc.data()[data.metadata.teamNumber];

            team.matches.push(data);
            
            let sumHR = 0, sumHS = 0, sumCR = 0, sumCS = 0;
            for (let match of team.matches) {
                sumHR += match.hatchRocket.length;
                sumHS += match.hatchShip.length;
                sumCR += match.cargoRocket.length;
                sumCS += match.cargoShip.length;
            }
            team.scoring.hatchRocket = sumHR/team.matches.length;
            team.scoring.hatchShip = sumHS/team.matches.length;
            team.scoring.cargoRocket = sumCR/team.matches.length;
            team.scoring.cargoShip = sumCS/team.matches.length;

            // TODO: add processing for lyingIndex, smartScore, & tba-rank

            admin.firestore().collection("events").doc(EVENT).update({[data.metadata.teamNumber]: team}).then(() => {
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
