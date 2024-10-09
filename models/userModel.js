const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        default: null
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        unique: true
    },
    token: {
        type: String,
        default: null
    },
},{ timestamps: true })
// model name(singular) and model name => in db: users
module.exports = mongoose.model("User", userSchema)