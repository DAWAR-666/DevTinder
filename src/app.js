const express = require("express");
const app = express();
const { connectdb } = require("./config/mongodb.ts");
const User = require("./models/user.ts");
app.post("/signup",async(req,res)=>{
    const user=new User({
        firstName:'pratham',
        lastName:'dawar',
        emailId:'qwerty@gmail.com',
        password:'123456'
    })
    await user.save();
    res.send("User created successfully");
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
