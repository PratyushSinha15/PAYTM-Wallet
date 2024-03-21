const express = require('express');

const router = express.Router();
const userRouter = require('./user');
const accountRouter = require('./account');


router.use('/user', userRouter);
router.use('/account',accountRouter);

module.exports = router;

//why we are creating a router object here?
//what is the use of this router object?
//this router object is used to create routes for the application
//because we know that all api requests will start from /api/v1 so requests will be like /api/v1/user or /api/v1/transaction