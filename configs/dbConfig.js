const path = require("path");
require("dotenv").config();
const { Pool, Client } = require("pg");

const pool = new Pool({
	user: process.env.USER,
	database: process.env.DATABASE,
	host: process.env.HOST,
	password: process.env.PASSWORD,
	port: process.env.PORT,
	max: 20,
});

const db = async () => {
	try {
		await pool.connect();
		console.log("db connected!");
	} catch (err) {
		console.log(err.stack);
	}
};

module.exports = { db, pool };
