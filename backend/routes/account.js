const express = require("express");
const { authMiddleware } = require('../middleware');
const { Account } = require('../db');
const mongoose = require("mongoose");

const router = express.Router();

// Get account balance
router.get("/balance", authMiddleware, async (req, res) => {
        const account = await Account.findOne({ 
            userId: req.userId 
        });
        res.json({ balance: account.balance });
});

// Transfer funds between accounts
router.post("/transfer", authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { amount, to } = req.body;

        // Validate input
        if (!amount || isNaN(amount) || amount <= 0) {
            throw new Error("Invalid amount");
        }

        const fromAccount = await Account.findOne({ userId: req.userId }).session(session);
        if (!fromAccount || fromAccount.balance < amount) {
            throw new Error("Insufficient balance");
        }

        const toAccount = await Account.findOne({ userId: to }).session(session);
        if (!toAccount) {
            throw new Error("Recipient account not found");
        }

        // Perform transfer
        await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
        await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

        await session.commitTransaction();
        res.json({ message: "Transfer successful" });
    } catch (error) {
        console.error("Error transferring funds:", error);
        await session.abortTransaction();
        res.status(400).json({ message: error.message });
    } finally {
        session.endSession();
    }
});

module.exports = router;
