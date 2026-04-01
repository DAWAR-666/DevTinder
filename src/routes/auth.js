const express=require('express')
const authRouter=express();
const { validateUser } = require("../utils/validate.js");
const bcrypt = require("bcrypt");
const User = require("../models/user.js");

authRouter.post("/signup",async(req,res)=>{
    try{
        validateUser(req.body);
        const {emailId,password,firstName,lastName,age,gender}=req.body;
        const passwordHash=await bcrypt.hash(password,10);

        const user=new User({emailId,password:passwordHash,firstName,lastName,age,gender});
        await user.save();
        res.send("User created successfully");
    }catch(err){
        return res.status(500).send("Error creating user "+err.message);
    }
})

authRouter.post("/login",async(req,res)=>{
    try{
        const {emailId,password}=req.body;
        const user=await User.findOne({emailId});
        if(!user){
            return res.status(400).send("Invalid email or password");
        }
        const isMatch=await user.ispasswordValid(password);
        if(!isMatch){
            return res.status(400).send("Invalid email or password");
        }
        
        const token=await user.getjwt();
        res.cookie("token",token,{expires:new Date(Date.now()+8*3600000)});
        res.send(user);
    }catch(err){
        return res.status(500).send("Error logging in user "+err.message);
    }
})

authRouter.post('/logout',(req,res)=>{
    res.cookie("token",null,{expires:new Date(Date.now())})
    res.send('logout done!')
})

module.exports=authRouter