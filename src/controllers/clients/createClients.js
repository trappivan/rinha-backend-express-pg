"use strict";

const { pool: pool } = require("../../../configs/dbConfig");
const { findCliente, getLastTransactions } = require("./queries");

async function transaction(req, res) {
	const { id } = req.params;
	const { valor, tipo, descricao } = req.body;

	if (!valor || !tipo || !descricao || descricao > 10) {
		return res
			.status(400)
			.json({ message: "Campos obrigatórios não preenchidos" });
	}

	const result = await pool.query(
		'select result_code as code_int, result_message as message, saldo, limite from "inserir_transacao"($1,$2,$3,$4)',
		[id, tipo, valor, descricao]
	);
	if (result.rows[0].code_int === 1) {
		return res.status(404).json({ message: "Usuário não cadastrado" });
	}

	if (result.rows[0].code_int === 2) {
		return res.status(422).json({ message: "Limite insuficiente" });
	}

	res
		.status(200)
		.json({ limite: result.rows[0].limite, saldo: result.rows[0].saldo });
}

async function extrato(req, res) {
	const { id } = req.params;

	const cliente = await pool.query(findCliente, [id]);

	if (!cliente.rows[0].id) {
		return res.status(404).json({ message: "Usuário não cadastrado" });
	}

	const transac = await pool.query(getLastTransactions, [id]);
	res.status(200).json({
		saldo: {
			total: cliente.rows[0].saldo,
			data_extrato: new Date().toISOString(),
			limite: cliente.rows[0].limite,
		},
		ultimas_transacoes: transac.rows,
	});
}
module.exports = {
	transaction,
	extrato,
};
