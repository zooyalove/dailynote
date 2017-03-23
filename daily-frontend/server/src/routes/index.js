import express from 'express';
import user from './user';
import orderer from './orderer';
import note from './note';
import category from './category';

const router = express.Router();

router.use('/*', (req, res, next) => {
    res.setHeader("Expires", "-1");
    res.setHeader("Cache-Control", "must-revalidate, private");
    next();
});

router.use('/user', user);
router.use('/orderer', orderer);
router.use('/note', note);
router.use('/category', category);

export default router;