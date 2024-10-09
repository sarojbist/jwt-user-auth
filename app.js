const express = require("express");
const connectDB = require("./config/db.js");
const User = require("./models/userModel.js");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const app = express();
app.use(express.json())  //will understand json format of input
app.use(cookieParser());

connectDB();

app.get("/", (req, res) => {
    res.send("Say Hello")
})

app.post("/register-user", async (request, response) => {
    try {
        // getting data from body
        const { name, email, password } = request.body; //without parsing json, we'll get undefined
        // make sure all data exists
        if (!name || !email || !password) {
            return response.status(400).send("Please Provide all the data");
        }

        // check if user already exits -email
        const userExists = await User.findOne({ email })
        if (userExists) {
            return response.status(401).send("User Already Exists");
        }
        //encrypt password
        const encPass = await bcrypt.hash(password, 10)

        // add user to db
        const newUser = new User({
            name,
            email,
            password: encPass
        });
       
        // send jwt token to user
        const token = jwt.sign(
            { id: newUser._id, email },
            'shhhhhhhhhh', //jwt secret
            {
                expiresIn: "2h"
            }
        )
        newUser.token = token;
      
        // Save the new user to the database
        await newUser.save();
        newUser.password = undefined;

        response.status(201).json(newUser);
       
    } catch (err) {
        console.log(err)
    }
})

app.post("/login-user", async (request, response) => {
    try {
        // get data from body
        const {email, password} = request.body;

        //check data is not empty
        if (!email || !password) {
            return response.status(400).send("Please Provide all the data");
        }

        // find user in db
        const user = await User.findOne({email})
        if(!user) {
            return response.status(404).send("User Not Found");
        }
        // match password
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return response.status(401).send("Invalid password");
        }
        // send a token
        const token = jwt.sign(
            { id: user._id, email },
            'shhhhhhhhhh', // jwt secret
            { expiresIn: "2h" }
        );
        // Hide password in the response
        user.token = token;
        user.password = undefined;

        // cookie section
        const options = {
            expires: new Date(Date.now() + 24* 60 * 60 * 1000),
            httpOnly: true,

        }
        response.status(200).cookie("token", token, options).json({
            success: true,
            token,
            user
        })

    } catch(error) {
        console.log(error)
    }
})

app.listen(5000, () => {
    console.log("App is running");
})