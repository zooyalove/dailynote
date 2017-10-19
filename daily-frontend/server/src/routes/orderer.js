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
		return res.status(401).json({
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
	GET /api/orderer/stat


	ERROR CODES
	1 : PERMISSION DENIED
*/
router.get('/stat', (req, res) => {
	const session = req.session;
	
	if (typeof session.loginInfo === 'undefined') {
		console.log('perm denied');
		return res.status(401).json({
			error: 'PERMISSION DENIED',
			code: 1
		});
	}

	const c_year = (new Date()).getFullYear();
	
	OrderNote.aggregate([
		{ $match: {
			'delivery.date': {
				$gte: new Date((c_year-1), 0, 1),
				$lt: new Date((c_year+1), 0, 1)
			}
		}},
		{ $group: {
			_id: null,
			totalPrice: { $sum: '$delivery.price' },
			ordererPrice: { $sum: {
								$cond: {
									if: { $ne: ['$orderer.id', 'no'] },
									then: '$delivery.price',
									else: 0
								}
							}}
		}}
	], (err, p_res) => {
		if (err) {
			console.log(err);
			throw err;
		}

		if (!p_res || p_res.length === 0) {
			return res.json({
				priceData: null,
				yearData: null
			});
		}

		OrderNote.aggregate([
			{ $match: {
				$and : [
					{ 'delivery.date': {
						$gte: new Date((c_year-1), 0, 1),
						$lt: new Date((c_year+1), 0, 1)
					}},
					{ 'orderer.id': {
						$ne: 'no'
					}}
				]}					
			},
			{ $project: {
				yearMonth: { $dateToString: { format: '%Y-%m', date: '$delivery.date' }},
				price: '$delivery.price'
			}},
			{ $group: {
				_id: '$yearMonth',
				monthPrice: { $sum: '$price' }
			}},
			{ $sort: { _id: 1 }}
		], (err2, y_res) => {
			if (err2) {
				console.log(err2);
				throw err2;
			}

			if (!y_res || y_res.length === 0) {
				return res.json({
					priceData: p_res[0],
					yearData: null
				});
			}

			return res.json({
				priceData: p_res[0],
				yearData: y_res
			});
		});
	});
});


/*
	GET /api/orderer/:id
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
		return res.status(401).json({
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

		if (!orderer || orderer.length === 0) {
			console.log('orderer not exists');
	        return res.status(400).json({
	            error: "ORDERER NOT EXISTS",
	            code: 2
	        });
		}

		const c_year = (new Date()).getFullYear();

		OrderNote.find({
			$and: [
				{'orderer.id': req.params.id},
				{'delivery.date': { $gte: (new Date(c_year, 0, 1)), $lt: (new Date((c_year+1), 0, 1))}}
			]
		}, {
			__v: 0,
			_id: 0,
			orderer: 0,
			'delivery.text': 0,
			date: 0,
			memo: 0
		}, {
			sort: {
				'delivery.date': -1	// 배송일자 내림차순 정렬
			}
		}, (err2, orders_res) => {
			const data = {};

			if (orders_res.length > 0) {
				let totalPrice = 0;
				let count = 0;

				orders_res.forEach((order) => {
					totalPrice += order['delivery'].price;
					count++;
				});

				data['total'] = {price: totalPrice, count};
				data['orders'] = orders_res;
			}

			return res.json({
				ordererInfo: orderer[0],
				data
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
		return res.status(401).json({
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
		3 : PERMISSION DENIED
		4 : ORDERER NOT EXISTS
*/
router.put('/:id', (req, res) => {
	const session = req.session;
	
	if (typeof session.loginInfo === 'undefined') {
		return res.status(401).json({
			error: 'PERMISSION DENIED',
			code: 3
		});
	}
	
	if(!shortid.isValid(req.params.id)) {
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

    Orderer.findById(req.params.id, (err, orderer) => {
		if (err) throw err;

		if (!orderer) {
			return res.status(400).json({
				error: "ORDERER NOT EXISTS",
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
		3 : PERMISSION DENIED
		4 : NO RESOURCES
*/
router.delete('/:id', (req, res) => {
	const session = req.session;
	
	if (typeof session.loginInfo === 'undefined') {
		return res.status(401).json({
			error: 'PERMISSION DENIED',
			code: 3
		});
	}

	if (!shortid.isValid(req.params.id)) {
		return res.status(400).json({
			error: 'INVALID ID',
			code: 1
		});
	}

	Orderer.findOne({'_id': req.params.id}, (err, result) => {
		if (err) throw err;

		if (!result) {
			return res.status(400).json({
				error: 'ORDERER NOT EXISTS',
				code: 2
			});
		}

		let data;

		OrderNote.findOne({'orderer.id': req.params.id}, (err2, noteExists) => {
			if (err2) throw err2;

			if (noteExists) {
				OrderNote.update(
					{'orderer.id': req.params.id},
					{'orderer.id': 'no'},
					(err, raw) => {
						if (err) throw err;

						data = raw;
					});
			} else {
				data = [];
			}

			Orderer.remove({'_id': req.params.id}, (err3) => {
				if (err3) throw err3;

				return res.json({
					result: 'success',
					data: data
				});
			});
		})
	});
});

export default router;
