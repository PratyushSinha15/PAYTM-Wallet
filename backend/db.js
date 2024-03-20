const app= require('express')();
const http= require('http').createServer(app);
import { Mongoose } from "mongoose";
import { type } from "os";


// importing mongoose and connecting it to a database of my choice

const mongoose = new Mongoose();
mongoose.connect("mongodb+srv://pratyushkumarsinha798:WBahXBVFkGcQno6M@paytmdb.bofbdg5.mongodb.net/?retryWrites=true&w=majority&appName=Paytmdb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
    username: {
        type:String,
        required:true,
        unique:true,
        trim:true,
        minLength:3,
        maxLength:20
    },
    password:{
        type:String,
        required:true,
        minLength:6
    },
    firstName:{
        type:String,
        required:true,
        trim:true,
        maxLength:40
    },
    lastName:{
        type:String,
        required:true,
        trim:true,
        maxLength:40
    }
});

const User = mongoose.model('User', userSchema);

module.exports={
    User
};