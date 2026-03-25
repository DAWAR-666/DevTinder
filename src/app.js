const express = require("express");
const app = express();
const { connectdb } = require("./config/mongodb.ts");
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
