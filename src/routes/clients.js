const express = require("express");
const {
	// createClient
	transaction,
	extrato,
} = require("../controllers/clients/createClients");
const router = express.Router();

// router.route("/").post(createClient);

router.route("/:id/transacoes").post(transaction);

router.route("/:id/extrato").get(extrato);

module.exports = router;
