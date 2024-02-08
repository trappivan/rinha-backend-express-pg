const express = require("express");
const db = require("./dbConfig/dbConfig.js");
const Cliente = require("./services/clients/clients.model.js");
const app = express();
const createClient = require("./services/clients/createClients.js");
const port = 3000;

db();

app.use(express.json());

app.post("/clients", createClient);

app.get("/", (req, res) => {
	res.send("Hello World!");
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});

module.exports = app;
