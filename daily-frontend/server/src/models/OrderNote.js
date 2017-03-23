import mongoose, { Schema } from 'mongoose';

const OrderNote = new Schema({
	orderer: {
		name: {
			type: String,
			required: [true, '주문자 이름을 입력하세요']
		},
		phone: {
	        type: String,
	        validate: {
	            validator: (v) => {
	                return /\d{2,3}-\d{3,4}-\d{4}/.test(v);
	            }
	        },
	        required: [true, '주문자 전화번호는 필수항목입니다']
		}
	},
	receiver: {
		name: {
			type: String,
			required: [true, '받는 사람 이름을 입력하세요']
		},
		phone: String
	},
	delivery_info: {
		category: String,
		date: {
			type: Date,
			default: Date.now
		},
		address: String,
		text: String,
		image: String
	},
	is_payment: Boolean,
	created: {
		type: Date,
		default: Date.now
	}
});

export default mongoose.model('ordernote', OrderNote);