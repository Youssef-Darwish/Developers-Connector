const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

//Load input validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

//Load user model
const User = require('../../models/User');

//@route GET api/users/test
//@desc  Test users Route
//@access Public
router.get('/test', (req, res) => {
	res.json({ msg: 'Users route works' });
});

//@route POST api/users/register
//@desc  Register a new user
//@access Public
router.post('/register', (req, res) => {
	const {errors,isValid} = validateRegisterInput(req.body);

	//Check Validation errors
	if(!isValid){
		return res.status(400).json(errors);
	}
	User.findOne({ email: req.body.email }).then((user) => {
		if (user) {
			errors.email = 'Email Already Exists';
			return res.status(400).json(errors);
		} else {
			const avatar = gravatar.url(req.body.email, {
				s: '200', // Size
				r: 'pg', // Rating
				d: 'mm' // Default
			});
			const newUser = new User({
				name: req.body.name,
				email: req.body.email,
				avatar,
				password: req.body.password
			});
			bcrypt.genSalt(10, (err, salt) => {
				bcrypt.hash(newUser.password, salt, (err, hash) => {
					if (err) throw err;
					newUser.password = hash;
					newUser.save().then((user) => res.json(user)).catch((err) => console.log(err));
				});
			});
		}
	});
});

//@route Post api/users/login
//@desc  Login user (returning token)
//@access Public
router.post('/login', (req, res) => {
	const {errors,isValid} = validateLoginInput(req.body);

	//Check Validation errors
	if(!isValid){
		return res.status(400).json(errors);
	}
	const email = req.body.email;
	const password = req.body.password;

	//Find user by email
	User.findOne({ email })
		.then((user) => {
			//chek if user doesn't exist
			if (!user) {
				errors.email = 'User not found'
				return res.status(404).json(errors);
			}
			//Check Password
			bcrypt.compare(password, user.password).then((isMatch) => {
				//password match with stored hashed password
				if (isMatch) {
					// User matched
					const payload = { id: user.id, name: user.name, avatar: user.avatar }; // create jwt payload
					//sign the token
					jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
						res.json({
							success: true,
							token: 'Bearer ' + token
						});
					});
				} else {
					errors.password = 'Password Incorrect'
					return res.status(400).json(errors);
				}
			});
		})
		.catch((err) => {
			return res.status(400).json(err);
		});
});

//@route GET api/users/current
//@desc  return the current user
//@access private

router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
	res.json({
		id: req.user.id,
		name: req.user.name,
		email: req.user.email
	});
});

module.exports = router;
