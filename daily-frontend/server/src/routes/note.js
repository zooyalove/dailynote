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

    if (typeof req.session.loginInfo === 'undefined') {
        res.status(401).json({
            error: 'PERMISSION DENIED',
            code: 3
        });
    }

    const {
        orderer_name,
        orderer_phone,
        orderer_id,
        receiver_name,
        receiver_phone,
        delivery_category,
        delivery_price,
        delivery_date,
        delivery_address,
        delivery_text,
        delivery_image,
        is_payment

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
        'delivery.image': delivery_image,
        'is_payment': is_payment
    }); 

    note.save( (err) => {
        if (err) throw err;

        return res.json({
            success: true
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
        'orderer.name': 1,
        'receiver.name': 1,
        'delivery.category': 1,
        'delivery.price': 1,
        'delivery.address': 1,
        'delivery.date': 1,
        'delivery.image': 1,
        'is_payment': 1
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
    })

});

export default router;
