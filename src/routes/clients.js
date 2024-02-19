"use strict";

const express = require("express");
const { pool } = require("../../configs/dbConfig");
const {
	findCliente,
	getLastTransactions,
} = require("../controllers/clients/queries");
const router = express.Router();

router.route("/:id/transacoes").post(async (req, res) => {
	const { id } = req.params;
	const { valor, tipo, descricao } = req.body;
	if (
		!valor ||
		!tipo ||
		!descricao ||
		descricao.length > 10 ||
		id.length > 1 ||
		id < 1 ||
		id > 5
	) {
		return res
			.status(400)
			.json({ message: "Campos obrigatórios não preenchidos" });
	}

	pool.query(
		'select result_code as code_int, result_message as message, saldo, limite from "inserir_transacao"($1,$2,$3,$4)',
		[id, tipo, valor, descricao],
		(err, result) => {
			if (err) {
				return res.status(500).json({ message: err.message });
			}
			if (result.rows[0].code_int === 2) {
				return res.status(422).json({ message: "Limite insuficiente" });
			} else {
				res
					.status(200)
					.json({ limite: result.rows[0].limite, saldo: result.rows[0].saldo });
			}
		}
	);
});

router.route("/:id/extrato").get(async (req, res) => {
	const { id } = req.params;
	if (id < 1 || id > 5) {
		return res.status(422).json({ message: "ID inválido" });
	}
	pool.query(getLastTransactions, [id], (err, resultTransac) => {
		if (err) {
			return res.status(500).json({ message: err.message });
		}
		if (!err) {
			return res.status(200).json({
				saldo: {
					total: result.rows[0].saldo,
					data_extrato: new Date().toISOString(),
					limite: result.rows[0].limite,
				},
				ultimas_transacoes: resultTransac.rows,
			});
		}
	});
});

module.exports = router;
