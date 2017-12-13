const functions = require('firebase-functions');
const nodemailer = require('nodemailer');

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.echo = functions.https.onRequest(post((req, res) => {
	res.send(req.body);
}));

exports.secretSanta = functions.https.onRequest(post((req, res) => {
	res.send(req.body);
}));

exports.mail = functions.https.onRequest(post((req, res) => {
	const data = req.body;
	const mailOptions = {
		from: '"SecretSanta" <noreply@secretsanta.vdmr.be>',
		to: data.email,
		subject: "Test",
		html: "ikel<br/>hahaha"
	};
	mailTransport.sendMail(mailOptions);
}));

const mailTransport = nodemailer.createTransport({
	service: 'Gmail',
	auth: {
		user: functions.config().gmail.email,
		pass: functions.config().gmail.password
	}
});


function post(f) {
	return (req, res) => {
		if (req.method == 'POST') {
			f(req, res);
		} else {
			res.writeHead(404);
			res.end('Not Found');
		}
	}
}
