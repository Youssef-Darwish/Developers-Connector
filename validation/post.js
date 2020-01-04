const Validator = require('validator');
const isEmpty = require('../validation/is-empty');
module.exports = function validatePostInput(data) {
	let errors = {};

	data.text = !isEmpty(data.text) ? data.text : '';

	if (!Validator.isLength(data.text, { min: 10, max: 400 })) {
		errors.text = 'Post must be between 10 and 400 characters';
	}

	if (Validator.isEmpty(data.text)) {
		errors.text = 'Post cannot be empty';
	}

	return {
		errors,
		isValid: isEmpty(errors)
	};
};
