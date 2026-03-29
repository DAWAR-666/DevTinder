const express = require("express");
const app = express();
const { connectdb } = require("./config/mongodb.js");
const User = require("./models/user.js");
const { validateUser } = require("./utils/validate.js");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const {userAuth}=require('./middleware/auth')


app.use(cookieParser());
app.use(express.json());
app.post("/signup",async(req,res)=>{
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
app.post("/login",async(req,res)=>{
    try{
        const {emailId,password}=req.body;
        const user=await User.findOne({emailId});
        if(!user){
            return res.status(400).send("Invalid email or password");
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).send("Invalid email or password");
        }
        
        const token=jwt.sign({_id:user._id},process.env.JWT_SECRET);
        res.cookie("token",token,{expires:new Date(Date.now()+8*3600000)});
        res.send("Login successful");
    }catch(err){
        return res.status(500).send("Error logging in user");
    }
})
app.get("/users",async(req,res)=>{
    try{
        const users=await User.find({emailId:req.body.emailId});
        res.send(users);
    }catch(err){
        return res.status(500).send("Error fetching users");
    }
})
app.patch("/users/:id",async(req,res)=>{
    const id=req.params.id
    try{
        const allowedUpdates=['firstName','lastName','password','age'];
        const updates=Object.keys(req.body).every((k)=>allowedUpdates.includes(k));
        if(!updates){
            throw new Error('Invalid updates! Allowed fields: '+allowedUpdates.join(', '));
        }
        const user=await User.findByIdAndUpdate(id,req.body,{runValidators:true});
        res.send("User updated successfully");
    }catch(err){
        return res.status(500).send("Error updating user:"+err.message);
    }
})
app.get("/profile",userAuth,async(req,res)=>{
    try{
        const user=req.user
        res.send(user);
    }catch(err){
        return res.status(400).send("Unauthorized: "+err.message);
    }
})
connectdb()
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(8000, () => {
      console.log("Server is running on port 8000");
    });
  })
  .catch((err) => {
    console.log("Failed to connect to MongoDB", err);
  });
