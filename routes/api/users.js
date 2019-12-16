const express = require('express');
const router = express.Router();

//@route GET api/users/test
//@desc  Test users Route
//@access Public
router.get('/test', (req, res) => {
	res.json({ msg: 'Users route works' });
});

module.exports = router;
