const express = require("express");
const app = express();
const { connectdb } = require("./config/mongodb.js");
const User = require("./models/user.js");
const { validateUser } = require("./utils/validate.js");
const bcrypt = require("bcrypt");
app.use(express.json());
app.post("/signup",async(req,res)=>{
    const token='qwerthfjsodnabcgnahrmsoieilcfme'
    try{
        validateUser(req.body);
        const {emailId,password,firstName,lastName,age,gender}=req.body;
        const passwordHash=await bcrypt.hash(password,10);

        const user=new User({emailId,password:passwordHash,firstName,lastName,age,gender});
        await user.save();
        res.cookie("token",token);
        res.send("User created successfully");
    }catch(err){
        return res.status(500).send("Error creating user "+err.message);
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
