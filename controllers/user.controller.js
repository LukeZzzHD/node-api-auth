const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const CONFIG = require('../config');

const userController = {
	signUp: (req, res) => {
		const { username, password, password2, image, firstName, lastName } = req.body;

		// Does user allready exist?
		userModel
			.findOne({ username })
			.then(user => {
				if (!user) {
					console.log(`Success, there is currently no user with username: ${username}`);
				}
			})
			.catch(err => {
				console.error(err);
			});

		// Validate provided username and password
		const errors = [];
		if (username.length < 4) {
			errors.push({ message: 'The provided username is too short, it must be at least 4 characters long.' });
		}
		if (username.length > 20) {
			errors.push({ message: 'The provided username is too long, it can only be 20 characters long.' });
		}
		if (password !== password2) {
			errors.push({ message: "The two passwords don't match." });
		}

		// Check if there are errors
		if (errors.length > 0) {
			return res.json({
				ok: false,
				message: 'User credentials not valid, check errors property.',
				errors
			});
		} else {
			//Create password hash with bcrypt
			bcrypt.hash(password, 10).then(hash => {
				const newUser = new userModel({
					username,
					password: hash,
					firstName,
					lastName
				});

				// Create a jwt with the usernem firstName and lastName that expires in one hour
				const token = jwt.sign({ username, firstName, lastName, isAdmin: false }, CONFIG.SECRET, { expiresIn: '1h' });

				// Save the user to the database
				newUser
					.save()
					.then(user => {
						console.log(JSON.stringify(user));

						return res.json({
							ok: true,
							message: `Succesfully created user ${user.username}!`,
							token
						});
					})
					.catch(err => {
						console.log(err.errmsg);
						return res.json({
							ok: false,
							message: 'Error while creating user!'
						});
					});
			});
		}
	},

	signIn: (req, res) => {
		const { username, password, rememberMe } = req.body;

		// Check db if user with username and password exists
		userModel
			.findOne({ username })
			.then(user => {
				bcrypt
					.compare(password, user.password)
					.then(result => {
						if (result == true) {
							console.log('Signin succesful!');
							const token = jwt.sign(
								{
									username,
									firstName: user.firstName,
									lastName: user.lastName,
									isAdmin: user.isAdmin
								},
								CONFIG.SECRET,
								rememberMe ? {} : { expiresIn: '1h' }
							);

							return res.json({
								ok: true,
								message: `Sign in succesful for user ${username}`,
								token
							});
						} else {
							return res.json({
								ok: false,
								message: 'Invalid credentials!'
							});
						}
					})
					.catch(err => console.log('Bcrypt compare failed: ' + err));
			})
			.catch(err => {
				console.error(err);
			});
	},

	verify: (req, res) => {
		const { token } = req.body;
		jwt.verify(token, CONFIG.SECRET, (err, decoded) => {
			if (err) {
				console.log('verify -> ' + err.message);
				return res.json({
					ok: false,
					message: "User couldn't be verified, please log in!"
				});
			} else {
				return res.json({
					ok: true,
					message: `User ${decoded.username} verified succesfully!`
				});
			}
		});
	},

	verifyAdmin: (req, res) => {
		const { token } = req.body;
		jwt.verify(token, CONFIG.SECRET, (err, decoded) => {
			if (err) {
				console.error(err);
				return res.json({
					ok: false,
					message: "User couldn't be verified, please log in!"
				});
			} else {
				if (decoded.isAdmin == true) {
					return res.json({
						ok: true,
						message: `${decoded.username} has been succesfully verified as an admin!`
					});
				} else {
					return res.json({
						ok: false,
						message: `${decoded.username} has insufficient permissions!`
					});
				}
			}
		});
	}
};

module.exports = userController;
