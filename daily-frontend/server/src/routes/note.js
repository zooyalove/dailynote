import express from 'express';
import mongoose from 'mongoose';
import OrderNote from './../models/OrderNote';
import util from './../helper';

mongoose.Promise = global.Promise;

const router = express.Router();

/*
    POST /api/note
    일일장부 등록

    ERROR CODES
        1 : EMPTY REQUIRED FIELD
        2 : BAD PHONE NUMBER
        3 : PERMISSION DENIED
*/
router.post('/', (req, res) => {
    let phoneRegex = /^\d{2,3}-\d{3,4}-\d{4}$/;

    if (typeof req.session.loginInfo === 'undefined') {
        res.status(401).json({
            error: 'PERMISSION DENIED',
            code: 3
        });
    }

    if (util.empty(req.body.orderer_name)) {
        return res.status(400).json({
            error: 'EMPTY REQUIRED FIELD',
            code: 1
        });
    }

    if (!phoneRegex.test(req.body.orderer_phone)) {
    	return res.status(400).json({
    		error: 'BAD PHONE NUMBER',
    		code: 2
    	});
    }

    if (util.empty(req.body.receiver_name)) {
        return res.status(400).json({
            error: 'EMPTY REQUIRED FIELD',
            code: 1
        });
    }

    const {
        orderer_name,       // 주문자 이름 또는 회사명
        orderer_phone,      // 주문자 연락처
        orderer_id="no",    // 주문자 고유식별자(등록된 거래처면 ID값으로, 등록되지 않았다면 "no"로 등록)
        receiver_name,      // 받는 분 이름
        receiver_phone,     // 받는 분 연락처
        delivery_category,  // 배달품 종류 (ex. 꽃바구니, 꽃다발, 관엽 등등...)
        delivery_price,     // 가격
        delivery_date,      // 배달일자
        delivery_address,   // 배달주소
        delivery_text,      // 글씨(경조사어 및 주문자 이름)
        memo
        // delivery_image,     // 배송된 물품의 사진...(차후 설계하자...)
        // is_payment          // 결제관련 여부 파악 (이것도 차후로...)

    } = req.body;

    let note = new OrderNote({
        'orderer.name': orderer_name.trim(),
        'orderer.phone': orderer_phone,
        'orderer.id': orderer_id,
        'receiver.name': receiver_name.trim(),
        'receiver.phone': receiver_phone,
        'delivery.category': delivery_category,
        'delivery.price': delivery_price,
        'delivery.date': new Date(delivery_date),
        'delivery.address': delivery_address,
        'delivery.text': delivery_text,
        // 'delivery.image': delivery_image,
        'memo': memo
        // 'is_payment': is_payment
    }); 

    note.save( (err) => {
        if (err) throw err;

        return res.json({
            success: true,
            id: note._id
        });
    });
});

/*
    GET /api/note
    모든 장부들 조회

    ERROR CODES
        1 : PERMISSION DENIED
*/
router.get('/', (req, res) => {

    if (typeof req.session.loginInfo === 'undefined') {
        res.status(401).json({
            error: 'PERMISSION DENIED',
            code: 1
        });
    }

    // 보여주고 싶은 field를 설정
    const projection = {
        '_id': 1,
        'orderer.name': 1,
        'receiver.name': 1,
        'delivery.category': 1,
        'delivery.price': 1,
        'delivery.address': 1,
        'delivery.date': 1,
        // 'delivery.image': 1,
        'is_payment': 1
        // 'memo': 1
    };

    OrderNote.find({}, projection)
        .sort({'delivery.date': -1})
        .exec( (err, notes) => {
            if (err) throw err;

            return res.json({
                success: true,
                data: notes
            });
        });
});

/*
    GET /api/note/:id
    특정 장부를 조회

    ERROR CODES
        1 : INVALID ID
        2 : PERMISSION DENIED
        3 : NO RESOURCE
*/
router.get('/:id', (req, res) => {
    if (typeof req.session.loginInfo === 'undefined') {
        res.status(401).json({
            error: 'PERMISSION DENIED',
            code: 2
        });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
            error: 'INVALID ID',
            code: 1
        });
    }

    OrderNote.findById(req.params.id, (err, note) => {
        if (err) throw err;

        if (!note) {
            return res.status(400).json({
                error: 'NO RESOURCE',
                code: 3
            });
        }
    });

});

export default router;