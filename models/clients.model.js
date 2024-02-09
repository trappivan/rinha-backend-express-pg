const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
	_id: false,
	id: {
		type: Number,
		required: true,
	},
	limite: {
		type: Number,
		required: true,
	},
	saldo_inicial: {
		type: Number,
		required: true,
	},
});

const Cliente = mongoose.model("Cliente", clientSchema);

module.exports = Cliente;
