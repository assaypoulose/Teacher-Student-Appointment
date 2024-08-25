const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("DB Connected");
    } catch (error) {
        console.error("Error connecting to MongoDB", error);
        process.exit(1);  // Exit process on failure
    }
}

module.exports = connectDB;
