const express = require('express');
const user = require('./user');
const orderer = require('./orderer');
const note = require('./note');

const router = express.Router();

router.use('/*', (req, res, next) => {
    res.setHeader("Expires", "-1");
    res.setHeader("Cache-Control", "must-revalidate, private");
    next();
});

router.use('/user', user);
router.use('/orderer', orderer);
router.use('/note', note);

export default router;