import express from 'express';
import User from './../models/User';

const router = express.Router();

router.get('/', (req, res) => {

});

/*
    USER SIGNUP: POST /api/user/signup
    BODY SAMPLE: {
        "userid": "test",
        "email": "test@test.com",
        "password": "test",

    }
    ERROR CODES:
        1: BAD USERID
        2: BAD EMAIL
        3: BAD PASSWORD
        4: USERID EXISTS
        5: EMAIL EXISTS
        
*/
router.post('/signup', (req, res) => {
    const useridRegex = /^[a-z0-9]+$/;
	const emailRegex = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;

    if(!useridRegex.test(req.body.userid)) {
        return res.status(400).json({
            error: "BAD USERID",
            code: 1
        });
    }

    // CHECK EMAIL VALIDATE
    if(!emailRegex.test(req.body.email)) {
        return res.status(400).json({
            error: "BAD EMAIL",
            code: 2
        });
    }

    // CHECK PASS LENGTH
    if(req.body.password.length < 4 || typeof req.body.password !== "string") {
        return res.status(400).json({
            error: "BAD PASSWORD",
            code: 3
        });
    }

    // CHECK USER EXISTANCE
    User.findOne({ userid: req.body.userid }, (err, exists) => {
        if (err) throw err;
        if (exists) {
            if (exists.userid === req.body.userid) {
                return res.status(409).json({
                    error: "USERID EXISTS",
                    code: 4
                });
            }

            if (exists.email === req.body.email) {
                return res.status(409).json({
                    error: "EMAIL EXISTS",
                    code: 5
                });
            }
        }

        // CREATE User
        let user = new User({
            userid: req.body.userid,
            email: req.body.email,
            password: req.body.password
        });

        user.password = user.generateHash(user.password);

        // SAVE IN THE DATABASE
        user.save( (err) => {
            if(err) throw err;
            return res.json({ success: true });
        });
    });
});

router.post('/signin', (req, res) => {

});

router.put('/', (req, res) => {

});

router.delete('/', (req, res) => {

});

export default router;