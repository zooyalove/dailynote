const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderNote = new Schema({
	orderer: {
		id: {
			type: String,
			default: "no"
		},
		name: {
			type: String,
			required: true
		},
		phone: {
	        type: String,
	        required: true
		}
	},
	receiver: {
		name: {
			type: String,
			required: true
		},
		phone: String
	},
	delivery: {
		category: String,
		price: {
			type: Number,
			min: 0,
			default: 0
		},
		date: {
			type: Date,
			default: Date.now
		},
		address: String,
		text: String
		// image: String
	},
	memo: {
		type: String,
		default: ""
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