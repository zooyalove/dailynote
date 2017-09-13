import mongoose, { Schema } from 'mongoose';
import shortid from 'shortid';

const Orderer = new Schema({
    _id: {
        type: String,
        default: shortid.generate
    },
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