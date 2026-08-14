const express = require("express");

const {
  getClients,
  getClient,
  createClient,
  updateClient,
  deleteClient,
  batchCreateClients,
} = require("../controllers/clientController");

const router = express.Router();

router.get("/", getClients);
router.get("/:id", getClient);
router.post("/", createClient);
router.put("/:id", updateClient);
router.delete("/:id", deleteClient);
router.post("/batch", batchCreateClients);

module.exports = router;