const express = require('express');
const {User}= require('../db');
const zod= require('zod');
const jwt= require('jsonwebtoken');
const {JWT_SECRET}= require('../config');
const {authMiddleware}= require('../middleware');
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

//Signin route
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

//updating user details
const updateSchema= zod.object({
    password:zod.string().optional(),
    firstName:zod.string().optional(),
    lastName:zod.string().optional()
})

//route to update user details
router.put('/',authMiddleware,async(req,res)=>{
    const {sucess} =updateSchema.safeParse(req.body);
    if(!sucess){
        res.status(411).json({
            message:"Error while updating user details"
        });
    }

    //this means that we are updating the user details of the user who is logged in
    //req.body will contain the details that the user wants to update
    //req.userId will contain the id of the user who is logged in
    await User.updateOne({
        _id:req.userId
    },req.body);


    res.json({
        message:"User Details Updated"
    });
})

// if the request URL is http://example.com/bulk?filter=John, req.query.filter will be "John".
router.get('/bulk', async(req,res)=>{
    const filter=req.query.filter||"";
    const users= await User.find({
        //using regex to search for the user
        //regex is used to search for the user in the database using the filter that is being sent to the server by the user
        $or: [{
            firstName:{
                "$regex" : filter
            }
        },{
            lastName:{
                "$regex":filter
            }
        }]
    })
    res.json({
        user:users.map(user=>({
            username: user.username,
            firstName:user.firstName,
            lastname: user.lastName,
            _id: user._id
        }))
    })
})


module.exports= router;