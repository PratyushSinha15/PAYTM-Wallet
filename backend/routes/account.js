const express = require("express");
const {authMiddleware} = require('../middleware');
const {Account, User}= require('../db');
const {default:mongoose} = require("mongoose");

const router = express.Router();

//creating a route to get the balance
//it is an endpoint for user to get their balance 
router.get("/balance", authMiddleware, async(req,res)=>{
    const account=await Account.findOne({
        //find one account with user id 
        userId:req.userId
    });
    res.json({
        //access the balance for that user id
        balance:account.balance
    })
});



//transfering money to another account

router.post("/transfer", authMiddleware, async(req, res)=>{
    const session= await mongoose.startSession();
    

    session.startTransaction();
    
    const {amount, to}=req.body;

    //Fetch the accounts within transaction
    const account = await Account.findOne({ userId: req.userId})
    if(!account || account.balance<amount){
        await session.abortTransaction();
        return res.status(400).json({
            message:"Insufficient balance"
        });
    }

    const toAccount = await Account.findOne({ userId: to}).session(session);

    if(!toAccount){
        await session.abortTransaction();
        return res.status(400).json({
            message:"Invalid Account"
        });
    }

    //once all these checks are perfonmer then we will  proceed transfer
    await Account.updateOne({userId: req.userId},{$inc:{balance: -amount}}).session(session);
    await Account.updateOne({userId: to},{$inc:{balance: amount}}).session(session);
    
    //commit the transaction
    await session.commitTransaction();
    res.json({
        message: "Transfer sucessfull"
    });
});
module.exports= router;