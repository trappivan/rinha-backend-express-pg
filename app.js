const express = require("express");
const app = express();
const router = require("./src/routes/clients.js");
const { db } = require("./configs/dbConfig.js");
const port = process.env.PORT_SERVER || 4000;
const CPU = require("os").cpus().length;

process.env.UV_THREADPOOL_SIZE = CPU;

db();

app.use(function (req, res, next) {
	res.removeHeader("x-powered-by");
	res.removeHeader("Server");
	res.removeHeader("Connection");

	next();
});

app.use(express.json());

app.use("/clientes", router);

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});

module.exports = app;
