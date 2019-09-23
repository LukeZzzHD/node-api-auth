const baseURL = 'http://127.0.0.1:8000';

module.exports = {
	PORT: 8000,
	SECRET: '1234',
	HOST: {
		API: {
			USERS: {
				VERIFY: `${baseURL}/api/users/verify`,
				VERIFY_ADMIN: `${baseURL}/api/users/verifyAdmin`
			},
			SALESPERFORMANCE: {}
		}
	}
};
