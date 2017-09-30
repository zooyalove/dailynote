import express from 'express';
import mongoose from 'mongoose';
import shortid from 'shortid';
import Orderer from './../models/Orderer';
import OrderNote from './../models/OrderNote';

mongoose.Promise = global.Promise;

const router = express.Router();

/*
	GET /api/orderer
	등록된 거래처 리스트를 조회

	ERROR CODES
		1 : PERMISSION DENIED
		2 : NO RESOURCES

*/
router.get('/', (req, res) => {
	const session = req.session;

	if (typeof session.loginInfo === 'undefined') {
		return res.status(400).json({
			error: 'PERMISSION DENIED',
			code: 1
		});
	}

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
*/
router.get('/:id', (req, res) => {
	const session = req.session;

	if (typeof session.loginInfo === 'undefined') {
		console.log('perm denied');
		return res.status(400).json({
			error: 'PERMISSION DENIED',
			code: 3
		});
	}

	if (!shortid.isValid(req.params.id)) {
		console.log('invalid id');
        return res.status(400).json({
            error: "INVALID ID",
            code: 1
        });
	}

	Orderer.find({'_id': req.params.id}, (err, orderer) => {
		if (err) throw err;
		// console.log(orderer);

		if (!orderer || orderer.length === 0) {
			console.log('orderer not exists');
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

			return res.json({
				success: true,
				ordererInfo: orderer[0],
				data: result
			});
		});
	});
});

/*
	POST /api/orderer
	거래처 정보 등록

	ERROR CODES
		1 : MISSING REQUIRED FIELD
		2 : PERMISSION DENIED
		3 : ORDERER EXISTS


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
    // const phoneRegex = /^\d{2,3}-\d{3,4}-\d{4}$/;

	const session = req.session;
	
	if (typeof session.loginInfo === 'undefined') {
		return res.status(400).json({
			error: 'PERMISSION DENIED',
			code: 2
		});
	}
	
	if ((req.body.name.length === 0 || !req.body.name.trim()) ||
		(req.body.phone.length === 0 || !req.body.phone.trim())) {
    	return res.status(400).json({
    		error: 'MISSING REQUIRED FIELD',
    		code: 1
    	});
    }

    Orderer.findOne({ name: req.body.name.trim() }, (err, exists) => {
    	if (err) throw err;

    	if (exists) {
    		return res.status(409).json({
                error: "ORDERER EXISTS",
                code: 3
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
    		name,
    		phone,
    		address,
    		manager,
    		manager_phone,
    		def_ribtext,
    		description
    	});

    	orderer.save((err) => {
    		if (err) throw err;

    		// console.log(orderer);

    		return res.json({
    			success: true,
    			orderer
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
	const session = req.session;
	
	if (typeof session.loginInfo === 'undefined') {
		return res.status(400).json({
			error: 'PERMISSION DENIED',
			code: 4
		});
	}
	
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

		orderer.name = name;
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
