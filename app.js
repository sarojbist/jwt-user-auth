const express = require("express");
const connectDB = require("./config/db.js");
const User = require("./models/userModel.js");

const app = express();
app.use(express.json())  //will understand json format of input

connectDB();

app.get("/", (req, res) => {
    res.send("Say Hello")
})

app.post("/register-user", async (request, response) => {
    try {
        // getting data from body
        if (!request.body.name || !request.body.email || !request.body.password) {
            return response.status(400).send("Please Provide all the data");
        }
        const { name, email, password } = request.body; //without parsing json, we'll get undefined
        const newUser = new User({ name, email, password });
        await newUser.save();
        response.send({ message: 'User registered successfully' });

    } catch (err) {
        console.log(err)
    }
})

app.listen(5000, () => {
    console.log("App is running");
})