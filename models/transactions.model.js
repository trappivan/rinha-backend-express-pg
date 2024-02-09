const mongoose = require("mongoose");
const transacoesSchema = new mongoose.Schema({
	_id: false,
	id: {
		type: Number,
		required: true,
	},
	transactions: [
		{
			valor: {
				type: Number,
				required: true,
			},
			tipo: {
				type: String,
				required: true,
			},
			descricao: {
				type: String,
				required: true,
			},
			data_realizada: {
				type: Date,
				required: true,
			},
		},
	],
});

const Transacoes = mongoose.model("Transacoes", transacoesSchema);

module.exports = Transacoes;
