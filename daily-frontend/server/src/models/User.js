import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

const User = new Schema({
	userid: {
		type: String,
		required: [true, '아이디를 입력하세요']
	},
	email: {
		type: String,
		validate: {
			validator: (v) => {
				const regexp = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
				return regexp.test(v);
			}
		}
		required: [true, '이메일을 입력하세요']
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

export default mongoose.model('user', User);