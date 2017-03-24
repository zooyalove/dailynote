import mongoose, { Schema } from 'mongoose';

const OrderNote = new Schema({
	orderer: {
		name: {
			type: String,
			required: true
		},
		phone: {
	        type: String,
	        required: true
		},
		id: {
			type: String,
			default: "0"
		}
	},
	receiver: {
		name: {
			type: String,
			required: true
		},
		phone: String
	},
	delivery_info: {
		category: String,
		price: {
			type: Number,
			default: 0
		},
		date: {
			type: Date,
			default: Date.now
		},
		address: String,
		text: String,
		image: String
	},
	is_payment: {
		type: Boolean,
		default: false
	},
	date: {
		created: {
			type: Date,
			default: Date.now
		},
		modified: {
			type: Date,
			default: Date.now
		}
	}
});

export default mongoose.model('ordernote', OrderNote);