"use strict";

const { pool: pool } = require("../../../configs/dbConfig");
const {
	createTransaction,
	findSaldo,
	updateSaldo,
	findCliente,
	getLastTransactions,
} = require("./queries");

async function transaction(req, res) {
	const { id } = req.params;
	const cliente = await pool.query(findCliente, [id]);

	if (!cliente.rows[0].id) {
		return res.status(404).json({ message: "Usuário não cadastrado" });
	}
	const { valor, tipo, descricao } = req.body;

	if (!valor || !tipo || !descricao) {
		return res
			.status(400)
			.json({ message: "Campos obrigatórios não preenchidos" });
	}
	const saldo = await pool.query(findSaldo, [id]);

	if (tipo === "d") {
		saldo.rows[0].valor -= Number(valor);
		if (-cliente.rows[0].limite > saldo) {
			return res.status(422).json({ message: "Limite insuficiente" });
		}
	}
	if (tipo === "c") {
		saldo.rows[0].valor += Number(valor);
	}

	try {
		pool.query(updateSaldo, [saldo.rows[0].valor, id]);
		pool.query(createTransaction, [
			id,
			tipo,
			valor,
			new Date().toISOString(),
			descricao,
		]);
	} catch (error) {
		console.log(error);
	}

	res
		.status(200)
		.json({ limite: cliente.rows[0].limite, saldo: saldo.rows[0].valor });
}

async function extrato(req, res) {
	const { id } = req.params;

	const cliente = await pool.query(findCliente, [id]);

	if (!cliente.rows[0].id) {
		return res.status(404).json({ message: "Usuário não cadastrado" });
	}

	const saldo = await pool.query(findSaldo, [id]);

	const transac = await pool.query(getLastTransactions, [id]);
	res.status(200).json({
		saldo: {
			total: saldo.rows[0].valor,
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
