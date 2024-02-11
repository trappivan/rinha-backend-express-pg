// Purpose: Create a new client in the database.
const Cliente = require("../../models/clients.model.js");
const Transacoes = require("../../models/transactions.model.js");

const createClient = async function (req, res) {
	const { id, limite, saldo_inicial } = req.body;

	const result = await Cliente.create({
		id: id,
		limite: limite,
		saldo_inicial: saldo_inicial,
	});

	res.send(result);
};

const transaction = async function (req, res) {
	const { id } = req.params;
	const cliente = await Cliente.findOne({ id: id });
	console.log(cliente);
	if (!cliente) {
		return res.status(404).json({ message: "Usuário não cadastrado" });
	}
	const { valor, tipo, descricao } = req.body;
	// melhorar validação depo
	if (!valor || !tipo || !descricao) {
		return res
			.status(400)
			.json({ message: "Campos obrigatórios não preenchidos" });
	}
	let saldo;
	if (tipo === "d") {
		saldo = cliente.saldo_inicial - Number(valor);

		if (-cliente.limite <= saldo) {
			cliente.saldo_inicial = saldo;
		} else {
			return res.status(422).json({ message: "Limite insuficiente" });
		}
	}
	if (tipo === "c") {
		saldo = cliente.saldo_inicial + Number(valor);
		cliente.saldo_inicial = saldo;
	}
	cliente.save();

	const transac = await Transacoes.findOne({ id: id });
	if (!transac) {
		const transsave = await Transacoes.create({
			id: id,
			transactions: [
				{
					valor: valor,
					tipo: tipo,
					descricao: descricao,
					data_realizada: Date.now(),
				},
			],
		});
		transsave.save();
	} else {
		transac.transactions.push({
			valor: valor,
			tipo: tipo,
			descricao: descricao,
			data_realizada: Date.now(),
		});
		transac.save();
	}

	res
		.status(200)
		.json({ limite: cliente.limite, saldo: cliente.saldo_inicial });
};

const extrato = async function (req, res) {
	const { id } = req.params;

	const cliente = await Cliente.findOne({ id: id });
	if (!cliente) {
		return res.status(404).json({ message: "Usuário não cadastrado" });
	}

	const transac = await Transacoes.findOne({ id: id }, "transactions", {
		limit: 10,
	})
		.where("transactions")
		.slice(-10);

	res.status(200).json({
		saldo: {
			total: cliente.saldo_inicial,
			data_extrato: Date.now(),
			limite: cliente.limite,
		},
		ultimas_transacoes: transac.transactions,
	});
};
module.exports = { createClient, transaction, extrato };
