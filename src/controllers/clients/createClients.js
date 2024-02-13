const { pool } = require("../../../configs/dbConfig");

const transaction = async function (req, res) {
	const { id } = req.params;
	const cliente = await pool.query(`select * from clientes where id = ${id}`);
	console.log(cliente.rows[0].id);
	if (!cliente.rows[0].id) {
		return res.status(404).json({ message: "Usuário não cadastrado" });
	}
	const { valor, tipo, descricao } = req.body;
	// melhorar validação depo
	if (!valor || !tipo || !descricao) {
		return res
			.status(400)
			.json({ message: "Campos obrigatórios não preenchidos" });
	}
	let saldo = await pool.query(`select valor from saldos where id = ${id}`);
	console.log("saldo", saldo);
	if (tipo === "d") {
		saldo.rows[0].valor -= Number(valor);
		if (-cliente.rows[0].limite > saldo) {
			return res.status(422).json({ message: "Limite insuficiente" });
		}
	}
	if (tipo === "c") {
		saldo.rows[0].valor += Number(valor);
	}

	await pool.query(
		`UPDATE saldos SET valor=${saldo.rows[0].valor} where cliente_id = ${id}`
	);
	await pool.query(
		`INSERT INTO transacoes(cliente_id,tipo,valor,realizado_em,descricao) VALUES (${Number(
			id
		)},'${tipo}',${Number(valor)},'${new Date().toISOString()}','${descricao}')`
	);

	res
		.status(200)
		.json({ limite: cliente.rows[0].limite, saldo: saldo.rows[0].valor });
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
module.exports = {
	// createClient,
	transaction,
	extrato,
};
