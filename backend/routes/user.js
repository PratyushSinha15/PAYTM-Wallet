const express = require('express');
const {User}= require('../db');
const zod= require('zod');
const jwt= require('jsonwebtoken');
const {JWT_SECRET}= require('../config');
const router = express.Router();

const signupSchema= zod.object({
    username:zod.string().email(),
    password:zod.string(),
    firstName:zod.string(),
    lastName:zod.string()
})
//signup route

router.post('/signup', async(req,res)=>{
    const {success}= signupSchema.safeParse(req.body); //safeParse is used to validate the data that is being sent to the server
    if(!success){
        res.status(411).json({
            message: "Email Already Taken or Invalid Data"
        });
    }

    //checking if the user already exists
    const existingUser= await User.findOne({
        username: req.body.username
    });

    if(existingUser){
        return res.status(401).json({
            message: "User Already Exists"
        });
    }

    // if user does not exist then create a new user
    const user= await User.create({
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName
    });

    const userId=user._id;//getting the id of the user

    //creating a jwt token
    const token =jwt.sign({
        userId
    }, JWT_SECRET);

    //sending the response back to the user
    res.status(201).json({
        message: "User Created",
        token: token
    });
});



const signinSchema= zod.object({
    username:zod.string().email(),
    password:zod.string()
});

//login route
router.post('/signin', async(req,res)=>{
    //validating the data that is being sent to the server using safeParse method 
    //safeParse method is used to validate the data that is being sent to the server
    //if the data is invalid then it will send a response back to the user
    const {success}= signinSchema.safeParse(req.body);

    if(!success){
        res.status(411).json({
            message: "Email already taken or Invalid Data"
        });
    }

    const user= await User.findOne({
        username: req.body.username,
        password: req.body.password
    });
    if(user){
        const token=jwt.sign({
            userId: user._id
        }, JWT_SECRET);
        res.json({
            message: "User Logged In",
            token: token
        });
    }
    else{
        res.status(401).json({
            message: "Invalid Credentials"
        });
    }
});


module.exports= router;