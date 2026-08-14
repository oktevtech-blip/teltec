const express = require("express");

const {
  getData,
  insertData,
} = require("../controllers/dataController");

const router = express.Router();

router.get("/:table", getData);
router.post("/:table", insertData);

module.exports = router;