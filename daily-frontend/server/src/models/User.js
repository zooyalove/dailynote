const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const User = new Schema({
	userid: {
		type: String,
		required: true
	},
	username: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	is_admin: {
		type: Boolean,
		default: false
	},
	created: {
		type: Date,
		default: Date.now
	}
});

User.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, 8);
};

User.methods.validateHash = function(password) {
	return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('user', User);