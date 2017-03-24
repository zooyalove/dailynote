import express from 'express';
import OrderNote from './../models/OrderNote';

const router = express.Router();

/*
    POST /api/note
    일일장부 등록

    ERROR CODES
        1: 
*/
router.post('/', (req, res) => {

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

export default router;