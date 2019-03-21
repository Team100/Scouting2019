const functions = require('firebase-functions');
const admin = require("firebase-admin");
const utils = require("./validate");

admin.initializeApp(functions.config().firebase);
admin.firestore().settings({timestampsInSnapshots: true});

// TODO: get config from database
const EVENT = "2019cada";
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
    Disable: {
        type: "boolean"
    },
    Brownout: {
        type: "boolean"
    },
    Break: {
        type: "boolean"
    },
    CrossLine: {
        type: "boolean"
    },
    EndState: {
        type: "number"
    },
    Metadata: {
        type: "object",
        properties: {
            MatchNumber: {
                type: "string"
            },
            Scouter: {
                type: "string"
            },
            TeamNumber: {
                type: "string"
            }
        }
    },
    Start: {
        type: "number"
    },
    Qual: {
        type: "array",
        contains: {
            type: "object",
            properties: {
                id: {
                    type: "string"
                },
                value: {
                    type: "string"
                }
            }
        }
    }
};
const PitFields = {
    pit: {
        type: "array",
        contains: {
            type: "object",
            properties: {
                id: {
                    type: "string"
                },
                value: {
                    type: "string"
                }
            }
        }
    }
};

/*
Expected JSON format:
{
    "type": "match" | "pit",
    "data": {...}
}
*/
exports.ingress = functions.https.onRequest((request, response) => {
    try {
        // Check if GET request
        if (request.method !== "GET") {
            response.status(405).send(JSON.stringify({"status": "error", "reason": "Method not allowed"}));
            return;
        }

        // Validate query fields
        if (!request.query.hasOwnProperty("type")) {
            response.status(400).send(JSON.stringify({"status": "error", "reason": "Invalid query parameters: must have 'type' field"}));
            return;
        } else if (!request.query.hasOwnProperty("data")) {
            response.status(400).send(JSON.stringify({"status": "error", "reason": "Invalid query parameters: must have 'data' field"}));
            return;
        }

        // Check that data is JSON
        let data;
        try {
            data = JSON.parse(request.query.data);
        } catch (e) {
            response.status(400).send(JSON.stringify({"status": "error", "reason": "Invalid JSON: field 'data' must be JSON string"}));
            return;
        }

        // Validate json data
        if (request.query.type === "match") if (!utils.validateJSON(data, MatchFields)) {
            response.status(400).send(JSON.stringify({"status": "error", "reason": `Invalid JSON: data does not match format for type '${request.query.type}'`}));
            return;
        /*} else if (request.query.type === "pit") if (!utils.validateJSON(data, PitFields)) {
            response.status(400).send(JSON.stringify({"status": "error", "reason": `Invalid JSON: data does not match format for type '${request.query.type}'`}));
            return;*/
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

            let team;
            if (request.query.type == "match") {
                // Get team data & matches
                team = doc.data()[data.Metadata.TeamNumber];
                team.matches.push(data);

                // Calculate average scoring
                let sumHR = 0, sumHS = 0, sumCR = 0, sumCS = 0;
                for (let match of team.matches) {
                    sumHR += match.HatchRocket.length;
                    sumHS += match.HatchShip.length;
                    sumCR += match.CargoRocket.length;
                    sumCS += match.CargoShip.length;
                }
                team.scoring.HatchRocket = sumHR/team.matches.length;
                team.scoring.HatchShip = sumHS/team.matches.length;
                team.scoring.CargoRocket = sumCR/team.matches.length;
                team.scoring.CargoShip = sumCS/team.matches.length;

                
            } else {
                // Get team data
                team = doc.data()[data.teamnum];
                console.log(data);
                team.pits = data;
            }

            // Fixes dynamic keys in javascript
            let updates = {};
            if (request.query.type == "match") {
                updates[data.Metadata.TeamNumber] = team;
            } else {
                updates[data.teamnum] = team;
            }

            admin.firestore().collection("events").doc(EVENT).update(updates).then(() => {
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

exports.batch_calc = functions.https.onRequest((request, response) => {
    // Check request type
    if (request.method !== "GET") {
        response.status(405).send(JSON.stringify({"status": "error", "reason": "Method not allowed"}));
        return;
    }

    admin.firestore().collection("events").doc(EVENT).get().then(doc => {
        if (!doc.exists) {
            response.status(400).send(JSON.stringify({"status": "error", "reason": "Could not retrieve current events from database"}));
            return;
        }

        let teams = doc.data();

        for (let team in teams) {
            try {
                let ss = 0;

                if (!teams[team].scoring.hasOwnProperty("HatchRocket")) continue;

                ss += (teams[team].scoring.HatchRocket/4) * 30;
                ss += (teams[team].scoring.HatchShip/4) * 30;
                ss += (teams[team].scoring.CargoRocket/4) * 30;
                ss += (teams[team].scoring.CargoShip/4) * 30;

                let count_broken = 0;
                let count_brownout = 0;
                let count_disable = 0;
                let endstate = 0;
                let start = 0;
                for (let match in teams[team].matches) {
                    if (teams[team].matches[match].Break) count_broken++;
                    if (teams[team].matches[match].Brownout) count_brownout++;
                    if (teams[team].matches[match].Disable) count_disable++;
                    endstate += teams[team].matches[match].EndState;
                    start += teams[team].matches[match].Start;
                }

                ss += (endstate/(6 * teams[team].matches.length)) * 20;
                ss += (start/(2 * teams[team].matches.length)) * 20;
                ss -= count_broken/teams[team].matches.length * 10;
                ss -= count_disable/teams[team].matches.length * 10;
                ss -= count_brownout/teams[team].matches.length * 10;

                teams[team].smartScore.weighted = Math.ceil(ss/(
                    (6*teams[team].matches.length) + (2*teams[team].matches.length) + (8*30)
                ) * 100);
            } catch (e) {console.error(e)}
        }

        admin.firestore().collection("events").doc(EVENT).update(teams).then(() => {
            response.status(200).send(JSON.stringify({"status": "success"}));
            return;
        }).catch(err => {
            // Return generic and log actual
            console.error("Error getting current event document:", err);
            response.status(500).send(JSON.stringify({"status": "error", "reason": "Could not retrieve data from the database"}));
            return;
        })
    }).catch(err => {
        // Return generic error & log actual
        console.error("Error getting current event document:", err);
        response.status(500).send(JSON.stringify({"status": "error", "reason": "Could not retrieve data from the database"}));
        return;
    });
});