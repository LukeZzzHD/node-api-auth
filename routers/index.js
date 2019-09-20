const express = require('express');
const { getUserRouter } = require('./user.router');

const getApiRouter = () => {
	const router = express.Router();

	router.use('/users', getUserRouter());

	return router;
};

module.exports = getApiRouter;
