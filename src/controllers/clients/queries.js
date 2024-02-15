const findCliente = "select * from clientes where id = $1";
const findSaldo = "select valor from saldos where id = $1";
const updateSaldo = "UPDATE saldos SET valor=$1 where cliente_id = $2";
const createTransaction =
	"INSERT INTO transacoes(cliente_id,tipo,valor,realizado_em,descricao) VALUES ($1,$2,$3,$4,$5)";
const getLastTransactions =
	"select * from transacoes where cliente_id =$1 ORDER BY id DESC LIMIT 10";

module.exports = {
	findCliente,
	findSaldo,
	updateSaldo,
	createTransaction,
	getLastTransactions,
};
