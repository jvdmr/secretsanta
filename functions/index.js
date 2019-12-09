const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const isUrl = require("is-url");

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.nextstep = functions.https.onRequest(post((req, res) => {
	res.send(req.body);
}));

exports.secretSanta = functions.https.onRequest(post((req, res) => {
	const originalSantas = req.body.santas;
	const santacycle = calculateSecretSanta(originalSantas);
	res.send(santacycle);
}));

exports.send = functions.https.onRequest(post((req, res) => {
	const santacycle = req.body.santas;
	sendSantaMails(santacycle);
	res.send(santacycle);
}));

function calculateSecretSanta(originalSantas) {
	const santas = JSON.parse(JSON.stringify(originalSantas));
	santas.forEach(santa =>
		santa.victims = santa.victims.filter(victim => victim != null)
	);
	const firstVictim = santas[0];
	return buildSantaCycle(removeEl(santas, santas[0]), firstVictim, JSON.parse(JSON.stringify(firstVictim)));
};

function buildSantaCycle(santas, currentVictim, firstVictim) {
	//  console.log(currentVictim.name + " => " + (currentVictim.victim ? currentVictim.victim.name : "nobody yet") + " :: " + santas.map(s => s.name));
	if (santas.length == 0) {
		if (firstVictim.victims.filter(victim =>
			victim.email === currentVictim.email
		).length > 0) {
			firstVictim.victim = currentVictim;
			delete firstVictim.victims;
			return firstVictim;
		} else {
			return -1;
		}
	}
	const possibleSantas = santas.filter(santa =>
		santa.victims.filter(victim =>
			victim.email === currentVictim.email
		).length > 0
	);
	shuffle(possibleSantas);
	var result;
	for (var santa of possibleSantas) {
		santa.victim = currentVictim;
		result = buildSantaCycle(removeEl(santas, santa), santa, firstVictim);
		if (result !== -1) {
			delete santa.victims;
			return result;
		}
	}
	return -1;
};

function removeEl(array, el) {
	return array.filter(v => v != el);
}

function shuffle (array) {
  var i = 0
    , j = 0
    , temp = null;

  for (i = array.length - 1; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1));
    temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

function sendSantaMails(santa) {
	if (santa.victim) {
		sendMail(santa.email, "About your secret santa event...",
			`<p>Hi ${santa.name}!</p>` +
			`<p>The names have been drawn. You have been chosen as the Secret Santa for ${santa.victim.name}.</p>` +
			(santa.victim.wishlist !== "" ?
				"<p>Here's some more information on them, should you need it:</p>" +
				"<p>" + (isUrl(santa.victim.wishlist) ? `<a href="${santa.victim.wishlist}">${santa.victim.wishlist}</a>` : santa.victim.wishlist) + "</p>"
				:
				"<p>Unfortunately, we have no further information on this individual. You may be able to contact their spouse/friends/... or subtly interrogate them directly to find out more about them, or just get something completely random.</p>") +
			"<p>Now go and find them the most awesome present you can think of!</p>" +
			"<p>Good luck!</p>"
		);
		sendSantaMails(santa.victim);
	}
}

function sendMail(to, subject, body) {
	const mailOptions = {
		from: '"SecretSanta" <noreply@secretsanta.vdmr.be>',
		to: to,
		subject: subject,
		html: body
	};
	mailTransport.sendMail(mailOptions);
}

const creds = functions.config().gmail;
const mailTransport = nodemailer.createTransport({
	service: 'Gmail',
	auth: {
		user: creds ? creds.email : "joris.vdmr@gmail.com",
		pass: creds ? creds.password : "cimxbbpwcmlrndxo"
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
