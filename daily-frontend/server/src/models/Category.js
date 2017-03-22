import mongoose, { Schema } from 'mongoose';

const Category = new Schema({
    name: {
        type: String,
        required: true
    }
});

export default mongoose.model('category', Category);
