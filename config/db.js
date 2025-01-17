const mongoose = require("mongoose");
require('dotenv').config(); 

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to database');
    } catch (err) {
        console.error('Failed to connect to database', err);
    }
};

module.exports = connectDB;
