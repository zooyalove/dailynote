import express from 'express';
import mongoose from 'mongoose';
import Orderer from './../models/Orderer';
import OrderNote from './../models/OrderNote';

const router = express.Router();

/*
	GET /api/orderer
	등록된 거래처 리스트를 조회

	ERROR CODES
		1 : PERMISSION DENIED
		2 : NO RESOURCES

*/
router.get('/', (req, res) => {
	Orderer.find().sort({name: 1}).exec( (err, orderers) => {
		if (err) throw err;

		if(!orderers.length) {
			return res.status(400).json({
				error: 'NO RESOURCES',
				code: 2
			});
		}

		return res.json({
			success: true,
			orderers
		});
	});

});

/*
	GET /api/orderer/:orderer
	특정 거래처 정보를 조회

	ERROR CODES
		1 : INVALID ID
		2 : ORDERER NOT EXISTS
		3 : PERMISSION DENIED
		4 : NO RESOURCES
*/
router.get('/:id', (req, res) => {
	if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
            error: "INVALID ID",
            code: 1
        });
	}

	Orderer.findById(req.params.id, (err, orderer) => {
		if (err) throw err;

		if (!orderer) {
	        return res.status(400).json({
	            error: "ORDERER NOT EXISTS",
	            code: 2
	        });
		}

		OrderNote.aggregate([
			{ $match: {
				'orderer.id': req.params.id
			}},
			{ $group: {
				_id: null,
				totalPrice: { $sum: '$delivery_info.price' },
				count: { $sum: 1 }
			}}
		], (err, result) => {
			if (err) throw err;

			if (!result) {
				return res.status(400).json({
					error: "NO RESOURCES",
					code: 4
				});
			}

			console.log(result);

			return res.json({
				success: true,
				data: result
			});
		});
	});
});

/*
	POST /api/orderer
	거래처 정보 등록

	ERROR CODES
		1 : BAD ORDERER NAME
		2 : BAD PHONE NUMBER
		3 : PERMISSION DENIED
		4 : ORDERER EXISTS


	=== request body ===
	name
	phone
	address
	manager
	manager_phone
	def_ribtext
	description
*/
router.post('/', (req, res) => {
    let phoneRegex = /^\d{2,3}-\d{3,4}-\d{4}$/;

    if (req.body.name.length === 0 || !req.body.name.trim()) {
    	return res.status(400).json({
    		error: 'BAD ORDERER NAME',
    		code: 1
    	});
    }

    if (!phoneRegex.test(req.body.phone)) {
    	return res.status(400).json({
    		error: 'BAD PHONE NUMBER',
    		code: 2
    	});
    }

    Orderer.findOne({ name: req.body.name.trim() }, (err, exists) => {
    	if (err) throw err;

    	if (exists) {
    		return res.status(409).json({
                error: "ORDERER EXISTS",
                code: 4
            });
    	}

    	const {
    		name,
    		phone,
    		address,
    		manager,
    		manager_phone,
    		def_ribtext,
    		description
    	} = req.body;

    	let orderer = new Orderer({
    		name: name.trim(),
    		phone,
    		address,
    		manager,
    		manager_phone,
    		def_ribtext,
    		description
    	});

    	orderer.save((err) => {
    		if (err) throw err;

    		console.log(orderer);

    		return res.json({
    			success: true,
    			data: orderer
    		});
    	});
    });
});

/*
	PUT /api/orderer/:id
	특정 거래처 정보 수정

	ERROR CODES
		1 : INVALID ID
		2 : BAD ORDERER NAME
		3 : BAD PHONE NUMBER
		4 : PERMISSION DENIED
		5 : ORDERER NOT EXISTS
*/
router.put('/:id', (req, res) => {
    let phoneRegex = /^\d{2,3}-\d{3,4}-\d{4}$/;

	if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
            error: "INVALID ID",
            code: 1
        });
    }

    if (req.body.name.length === 0 || !req.body.name.trim()) {
    	return res.status(400).json({
    		error: 'BAD ORDERER NAME',
    		code: 2
    	});
    }

    if (!phoneRegex.test(req.body.phone)) {
    	return res.status(400).json({
    		error: 'BAD PHONE NUMBER',
    		code: 3
    	});
    }

    Orderer.findById(req.params.id, (err, orderer) => {
		if (err) throw err;

		if (!orderer) {
			return res.status(400).json({
				error: "ORDERER NOT EXISTS",
				code: 5
			});
		}

    	const {
    		name,
    		phone,
    		address,
    		manager,
    		manager_phone,
    		def_ribtext,
    		description
    	} = req.body;

		orderer.name = name.trim();
		orderer.phone = phone;
		orderer.address = address;
		orderer.manager = manager;
		orderer.manager_phone = manager_phone;
		orderer.def_ribtext = def_ribtext;
		orderer.description = description;
		orderer.date.modified = new Date();

		orderer.save( (err) => {
			if (err) throw err;
			
			return res.json({
				success: true,
				data: orderer
			});
		});
	});
});

/*
	DELETE /api/orderer/:id
	특정 거래처 정보 삭제
	이와 동시에 OrderNote 테이블 내에 있는 거래처 주문 내역을 조회해서
	orderer -> id 값을 초기화 상태인 "0"로 초기화 한다.

	ERROR CODES
		1 : INVALID ID
		2 : ORDERER NOT EXISTS
*/
router.delete('/:id', (req, res) => {

});

export default router;
