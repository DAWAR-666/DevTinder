const express = require("express");
const app = express();
const { connectdb } = require("./config/mongodb.js");
const cookieParser = require("cookie-parser");


app.use(cookieParser());
app.use(express.json());
const authRouter=require('./routes/auth.js')
const profileRouter=require('./routes/profile.js')
const connectionRequest=require('./routes/connectionRequest.js')
const user=require('./routes/user.js')
app.use('/',authRouter)
app.use('/',profileRouter)
app.use('/',connectionRequest)
app.use('/',user)

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
