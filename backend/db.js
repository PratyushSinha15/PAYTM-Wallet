const app= require('express')();
const http= require('http').createServer(app);
const bcrypt= require('bcrypt');
const mongoose = require('mongoose');



// importing mongoose and connecting it to a database of my choice

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

//using bcrypt to hash the password before saving it to the database and adding saltRounds to password
userSchema.methods.createHashedPassword= async function(plainTextPassword){
    const saltRounds=10;

    //here we are directly returning the hashed password with saltRounds
    return await bcrypt.hash(plainTextPassword, saltRounds);
}

//using bcrypt to compare the password entered by the user with the hashed password in the database
userSchema.methods.comparePassword= async function(plainTextPassword){
    return await bcrypt.compare(plainTextPassword, this.password);
}

// creating a model for accountSchema
const accountSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId, //this is the id of the user who is logged in
        required:true,
        ref:'User'
    },
    //balance of the user
    balance:{
        type:Number,
        required:true,
    }
});

const Account= mongoose.model('Account', accountSchema);
const User = mongoose.model('User', userSchema);

module.exports={
    User
};