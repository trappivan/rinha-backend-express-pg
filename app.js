const express = require("express");
const app = express();
const router = require("./src/routes/clients.js");
const { db } = require("./configs/dbConfig.js");
const port = process.env.PORT_SERVER || 4000;

try {
	db();
} catch (error) {
	console.log(error);
}

app.use(express.json());

app.use("/clientes", router);

app.get("/", (req, res) => {
	res.send("Hello World!");
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});

module.exports = app;
