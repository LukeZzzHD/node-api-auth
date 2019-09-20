const salesperformanceModel = require('../models/salesperformance.model');
const userModel = require('../models/user.model');
const axios = require('axios');
const CONFIG = require('../config');

const salesperformanceController = {
	increase: (req, res) => {
		const { performance_name } = req.params;
		const { username } = req.query;
		const { token } = req.body;

		// Make a http request to verify user
		let config = {
			'Content-Type': 'application/json'
		};
		let data = { token };
		axios
			.post(`${CONFIG.HOST}/api/users/verify`, data, config)
			.then(response => {
				if (response.data.ok == true) {
					// Token verified succesfully
					console.log('1234567890\n\n');
					userModel
						.findOne({ username })
						.then(user => {
							if (user) {
								// If queried user exists
								if (user.username === username) {
									// Request for user was made by same user -> no admin action
									// Increase salesperformance
									salesperformanceModel
										.findOne({ user, name: performance_name })
										.then(spo => {
											if (spo) {
												// spo exists
												spo.performances = [...spo.performances, { date: Date.now() }];
												spo.save();
												return res.json({
													ok: true,
													message: 'User increased his performances'
												});
											} else {
												return res.json({
													ok: false,
													message: `Couldn't find an SPO with a performance name of ${performance_name}.`
												});
											}
										})
										.catch(err => console.log(err));
								} else {
									// Request for user was made by diffrent user (has to be admin)
									// Check if user is admin
									let config = {
										'Content-Type': 'application/json'
									};
									let data = { token };
									axios
										.post(`${CONFIG.HOST}/api/users/verifyAdmin`, data, config)
										.then(response => {
											if (response.data.ok) {
												// User is an admin
												// Increase salesperformance
												userModel
													.findOne({ username })
													.then(user => {
														salesperformanceModel
															.findOne({ user, name: performance_name })
															.then(spo => {
																if (spo) {
																	// spo exists
																	spo.performances = [...spo.performances, { date: Date.now() }];
																	spo.save();
																	return res.json({
																		ok: true,
																		message: `Admin increased performance fro user ${username}`
																	});
																} else {
																	return res.json({
																		ok: false,
																		message: `Couldn't find an SPO with a performance name of ${performance_name}.`
																	});
																}
															})
															.catch(err => console.log(err));
													})
													.catch(err => console.log(err));
											} else {
												return res.json({
													ok: false,
													message: 'User has insufficient permissions to perform this action'
												});
											}
										})
										.catch(err => console.log(err));
								}
							}
						})
						.catch(err => console.log(err));
				} else {
					return res.json({
						ok: false,
						message: "User couldn't be verified!"
					});
				}
			})
			.catch(err => console.log(err));
	},
	decrease: (req, res) => {},
	weekly: (req, res) => {},
	monthly: (req, res) => {},
	yearly: (req, res) => {}
};

module.exports = salesperformanceController;
