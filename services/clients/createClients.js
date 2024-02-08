// Purpose: Create a new client in the database.
const Cliente = require("./clients.model.js");

const createClient = async function (req, res) {
	const { id, limite, saldo_inicial } = req.body;

	console.log(req.body);

	const result = await Cliente.create({
		id: id,
		limite: limite,
		saldo_inicial: saldo_inicial,
	});

	console.log(result);

	res.send(result);
};

module.exports = createClient;
