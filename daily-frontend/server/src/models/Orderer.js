import mongoose, { Schema } from 'mongoose';

const Orderer = new Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: String,
    manager: String,
    manager_phone: String,
    def_ribtext: String,
    description: String,
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

export default mongoose.model('orderer', Orderer);