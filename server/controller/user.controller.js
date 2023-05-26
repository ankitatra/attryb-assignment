require("dotenv").config();
const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const { Owner } = require("../model/user.model");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const saltRounds = 6;

const loginController = asyncHandler(async (req, res) => {
    const {email, password} = req.body;
  try {
    // If any error exists then throw Error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ error: errors.array()[0].msg });
    }

    // If this email not exists throw error
    const isUser = await Owner.findOne({email});
    if(!isUser){
        return res.status(400).send({error : "You have to register first!"})
    }
    // Check Password is valid
    let isPassword = await bcrypt.compare(password, isUser.password);
    console.log(isUser.password)
    if(!isPassword){
        return res.status(400).send({error : "Invalid credential"})
    }
    // if email and password match login

    // create jwt token
    const token = jwt.sign({ _id: isUser._id }, "masai");

    return res.send({ msg : "Successfully Login", user : {username : isUser.username, pic : isUser.profile_picture,id:isUser._id ,token}});
  } catch (error) {
    console.log(error)
    return res.status(500).send({ error: "Somthing Went Wrong!" });
  }
});


const registerController = asyncHandler(async (req, res) => {
    let {username, email, password, profile_picture} = req.body;
  try {
    // If any error exists then throw Error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ error: errors.array()[0].msg });
    }

    // check if username exists
    const isUsername = await Owner.findOne({username});
    if(isUsername){
        return res.status(400).send({error : "This username already Exists!"})
    }

    // Check if email exists 
    const isEmail = await Owner.findOne({email});
    if(isEmail){
        return res.status(400).send({error : "This email already Exists!"})
    }

    // if username and email are not exists then create user

    // convert password to hash password
    let hashPassword = await bcrypt.hash(password, saltRounds);

    // Create user

    let createUser = await Owner.create({username, email, password : hashPassword, profile_picture})

    return res.send({msg : "Successfully Register!"});
  } catch (error) {
    return res.status(500).send({ error: "Somthing Went Wrong!" });
  }
});


// app.put('/users/:id', (req, res) => {
  


module.exports = {
  registerController, loginController,
};



