const express = require("express");
const {
	transaction,
	extrato,
} = require("../controllers/clients/createClients");
const router = express.Router();

router.route("/:id/transacoes").post(transaction);

router.route("/:id/extrato").get(extrato);

module.exports = router;
