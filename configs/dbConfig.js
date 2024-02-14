require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
	user: process.env.USER,
	database: process.env.DATABASE,
	host: process.env.HOST,
	password: process.env.PASSWORD,
	port: process.env.PORT,
});

const db = async () => {
	try {
		await pool.connect();
		console.log("db connected!");
	} catch (err) {
		console.log(err.stack);
	}
};

module.exports = { db, pool: pool };
