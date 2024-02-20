"use strict";
const findCliente = "select * from clientes where id = $1";
const findSaldo = "select valor from saldos where id = $1";
const updateSaldo = "UPDATE saldos SET valor=$1 where cliente_id = $2";
const createTransaction =
	"INSERT INTO transacoes(cliente_id,tipo,valor,realizado_em,descricao) VALUES ($1,$2,$3,$4,$5)";
const getLastTransactions = "select generate_json_output($1)";

module.exports = {
	findCliente,
	findSaldo,
	updateSaldo,
	createTransaction,
	getLastTransactions,
};
