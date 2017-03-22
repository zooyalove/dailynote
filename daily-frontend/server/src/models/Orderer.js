import mongoose, { Schema } from 'mongoose';

const Orderer = new Schema({
    name: {
        type: String,
        required: [true, '거래처명을 입력하세요']
    },
    phone: {
        type: String,
        validate: {
            validator: (v) => {
                return /\d{3}-\d{3,4}-\d{4}/.test(v) || /\d{2,3}-\d{3,4}-\d{4}/.test(v);
            }
        },
        required: [true, '거래처 전화번호는 필수항목입니다']
    },
    address: String,
    manager: String,
    manager_phone: String,
    def_ribtext: String,
    description: String
});

export default mongoose.model('orderer', Orderer);