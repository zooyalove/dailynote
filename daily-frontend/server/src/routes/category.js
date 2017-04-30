import express from 'express';
import mongoose from 'mongoose';
import Category from './../models/Category';

mongoose.Promise = global.Promise;

const router = express.Router();

// 모든 카테고리 정보 가져오기
router.get('/', (req, res) => {
    Category.find().exec((err, categories) => {
        if (err) throw err;
        res.json(categories);
    })
});

router.post('/', (req, res) => {
    let category = new Category({
        name: req.body.name
    });
    category.save( (err) => {
        if (err) throw err;
        res.json({ success: true });
    });
});

export default router;