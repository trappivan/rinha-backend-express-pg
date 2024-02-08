const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const db = async () => {
	try {
		const con = await mongoose.connect(MONGO_URI);
		console.log("MongoDB connected: " + con.connection.host);
	} catch (error) {
		console.error(error);
	}
};

module.exports = db;
