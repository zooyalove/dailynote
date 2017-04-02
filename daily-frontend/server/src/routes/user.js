import express from 'express';
import User from './../models/User';

const router = express.Router();

/*
    USER SIGNUP: POST /api/user/signup
    BODY SAMPLE: {
        "userid": "test",
        "username": "test",
        "email": "test@test.com",
        "password": "test"
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
	const emailRegex = /^([a-zA-Z0-9_.+-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    // const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;

    if (!useridRegex.test(req.body.userid)) {
        return res.status(400).json({
            error: "BAD USERID",
            code: 1
        });
    }

    // CHECK EMAIL VALIDATE
    console.log(req.body.email);

    if (!emailRegex.test(req.body.email)) {
        return res.status(400).json({
            error: "BAD EMAIL",
            code: 2
        });
    }

    // CHECK PASS LENGTH
    if (req.body.password.length < 4 || typeof req.body.password !== "string") {
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

        const {
            userid,
            username,
            email,
            password
        } = req.body;

        // CREATE User
        let user = new User({
            userid,
            username,
            email,
            password
        });

        user.password = user.generateHash(user.password);

        // SAVE IN THE DATABASE
        user.save( (err) => {
            if (err) throw err;

            return res.json({ success: true });
        });
    });
});

/*
    USER SIGNIN POST /api/user/signin
    BODY SAMPLE {
        userid : id or email
        password : password
    }

    ERROR CODES
        1 : LOGIN FAILED
*/
router.post('/signin', (req, res) => {
    if (typeof req.body.password !== "string") {
        return res.status(401).json({
            error: 'LOGIN FAILED',
            code: 1
        });
    }

    User.findOne({$or: [{'userid': req.body.userid}, {'email': req.body.userid}]}, (err, user) => {
        if (err) throw err;

        if (!user) {
            return res.status(401).json({
                error: 'LOGIN FAILED',
                code: 1
            });
        }

        if(!user.validateHash(req.body.password)) {
            return res.status(401).json({
                error: 'LOGIN FAILED',
                code: 1
            });
        }

        let session = req.session;

        session.loginInfo = {
            _id: user._id,
            username: user.username,
            is_admin: user.is_admin
        };

        return res.json({ success: true });
    });
});

router.post('/logout', (req, res) => {
    req.session.destroy( (err) => { if (err) throw err; });

    return res.json({ success: true });
});

/*
router.put('/:id', (req, res) => {

});

router.delete('/:id', (req, res) => {

});
*/

router.get('/getinfo', (req, res) => {
    if (typeof req.session.loginInfo === 'undefined') {
        res.status(401).json({
            error: 'NOT LOGINED',
            code: 1
        });
    }

    return res.json({ info: req.session.loginInfo });
});

export default router;
