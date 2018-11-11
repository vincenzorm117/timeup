
const express = require('express')
const admin = require("firebase-admin");


// Initialize router
const router = express.Router()


////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
// Module exports

module.exports = () => {

	// Initialize Firebase admin
	const serviceAccount = require('../firebase.config.json');
	admin.initializeApp({
		credential: admin.credential.cert(serviceAccount),
		databaseURL: serviceAccount.databaseURL
	});


	var authenticate = async (req, res, next) => {
        next();
		// Get token from header
		let token = req.get('Authorization');
		// Check token with google
		try {
			var decodedToken = await admin.auth().verifyIdToken(token);
		} catch(error) {
			return res.status(403).send();
		}
		let email = decodedToken.email;
		// Get user from database
		try {
			let user = await db.user.authenticate(email);
			if( !user || user.length <= 0 ) {
				return res.status(403).send();	
			}
			if( user.auth.access ) {
				req.isAuthenticated = true;
				req.user = user;
				next();
			} else {
				return res.status(403).send();
			}
		} catch(error) {
			res.status(403).send();
		}
	}

	router.get('/ping', authenticate, (req, res) => {
		if( req.isAuthenticated ) {
			return res.status(200).json({
				message: 'pong',
				user: {
					auth: req.user.auth,
					name: req.user.name,
					email: req.user.email,
					id: req.user._id,
					type: req.user.type
				}
			});
		}
		return res.status(401).send();
	});


	router.post('/logout', authenticate, async (req, res) => {
		if( req.isAuthenticated ) {
			return res.status(200).send();
		}
		return res.status(401).send();
	});


	return { router, authenticate, firebase: admin }
}










