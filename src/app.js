const express = require("express");
const app = express();
const { connectdb } = require("./config/mongodb.js");
const User = require("./models/user.js");
app.use(express.json());
app.post("/signup",async(req,res)=>{
    const user=new User(req.body);
    try{
        await user.save();
        res.send("User created successfully");
    }catch(err){
        return res.status(500).send("Error creating user");
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
