const express = require("express");
const connectDB = require("./config/db.js");

const app = express();

connectDB();

app.listen(5000, () => {
    console.log("App is running");
})