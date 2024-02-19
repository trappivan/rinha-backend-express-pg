require("dotenv").config();
const { Client, Pool } = require("pg");

const pool = new Client({
	user: process.env.USER,
	database: process.env.DATABASE,
	host: process.env.HOST,
	password: process.env.PASSWORD,
	port: process.env.PORT,
	max: 20,
});

const db = async () => {
	await pool.connect();
	console.log("db connected!");
};

module.exports = { db, pool: pool };
