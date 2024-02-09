const express = require("express");
const db = require("./dbConfig/dbConfig.js");
const app = express({});
const router = require("./routes/clients.js");
const port = 3000;

db();

app.use(express.json());

app.use("/clientes", router);

app.get("/", (req, res) => {
	res.send("Hello World!");
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});

module.exports = app;
