const express = require('express');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
	destination: '../public/images',
	filename: (req, file, next) => {
		next(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
	}
});

const upload = multer({
	storage
}).single('myImage');

const compatibleMimeType = type => {
	type = type.split('/')[1];
};

module.exports.getUploadRouter = () => {
	const router = express.Router();

	router.get('/', (req, res) => {
		res.send('upload file route');
	});

	router.post('/picture', (req, res) => {
		upload(req, res, err => {
			if (err) {
				res.json({
					ok: false,
					message: err
				});
			} else {
				if(req.file != undefined && compatibleMimeType(req.file.mimetype))
			}
		});
	});

	return router;
};
