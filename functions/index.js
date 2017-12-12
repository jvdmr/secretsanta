const functions = require('firebase-functions');

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.secretSanta = functions.https.onRequest((req, res) => {
	if (req.method == 'POST') {
		res.send(req.body);
	} else {
		res.writeHead(404);
		res.end('Not Found');
	}
});
