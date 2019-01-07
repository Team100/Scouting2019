const functions = require('firebase-functions');
const admin = require("firebase-admin");

admin.initializeApp(functions.config().firebase);

exports.ingress = functions.https.onRequest((request, response) => {
    try {
        // Validate that data exists
        if (!request.query.hasOwnProperty("data")) {
            response.status(400).send(JSON.stringify({"status": "error","reason": "Invalid request"}));
            return;
        }

        // Convert query data into JSON
        let data = JSON.parse(request.query.data);

        // Update current value in unprocessed
        admin.firestore().collection("unprocessed").doc(data.metadata.teamName).update({
            match: admin.firestore.FieldValue.arrayUnion(data)
        }).then(() => {
            // Return success
            response.status(200).send(JSON.stringify({"status": "success"}));
            return;
        }).catch(err => {
            // Return generic error and log actual
            console.error("Error updating document:", err);
            response.status(500).send(JSON.stringify({"status": "error", "reason": "Could not update the database"}));
            return;
        });
    } catch (e) {
        // Catch all for errors
        console.error(e);
        response.status(500).send(JSON.stringify({"status": "error", "reason": "Something went wrong and we're looking into it"}));
    }
});
