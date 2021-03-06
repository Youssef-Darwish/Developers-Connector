const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');
const passport = require('passport');
const app = express();

//Body parser middle ware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//DB config
const db = require('./config/keys').monogURI;

//Connect to MongoDB
mongoose.connect(db).then(() => console.log('mongoDB connectd')).catch((err) => console.log(err));

//Passport Middleware

app.use(passport.initialize());

//Passport Config
require('./config/passport')(passport);

// user routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

const port = process.env.PORT || 5000;

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
