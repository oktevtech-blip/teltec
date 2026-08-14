const db = require("../config/db");
const sendDbError = require("../utils/dbError");

exports.getInventory = (req, res) => {
  db.query(
    "SELECT * FROM inventory ORDER BY id DESC",
    (err, rows) => {
      if (err) {
        return sendDbError(
          res,
          "Error fetching inventory:",
          err
        );
      }

      res.json({
        success: true,
        data: rows,
      });
    }
  );
};

exports.getInventoryItem = (req, res) => {
  db.query(
    "SELECT * FROM inventory WHERE id = ?",
    [req.params.id],
    (err, rows) => {
      if (err) {
        return sendDbError(
          res,
          "Error fetching inventory item:",
          err
        );
      }

      if (!rows.length) {
        return res.status(404).json({
          success: false,
          error: "Item not found",
        });
      }

      res.json({
        success: true,
        data: rows[0],
      });
    }
  );
};

exports.createInventoryItem = (req, res) => {
  const {
    name,
    category,
    quantity,
    minThreshold,
    location,
    unitPrice,
  } = req.body;

  if (!name || quantity == null) {
    return res.status(400).json({
      success: false,
      error: "Name and quantity are required",
    });
  }

  const sql = `
    INSERT INTO inventory
    (name, category, quantity, minThreshold, location, unitPrice)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const values = [
    name,
    category || null,
    Number(quantity) || 0,
    Number(minThreshold) || 0,
    location || null,
    Number(unitPrice) || 0,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      return sendDbError(
        res,
        "Error creating inventory item:",
        err
      );
    }

    res.status(201).json({
      success: true,
      id: result.insertId,
    });
  });
};

exports.updateInventoryItem = (req, res) => {
  const {
    name,
    category,
    quantity,
    minThreshold,
    location,
    unitPrice,
  } = req.body;

  const sql = `
    UPDATE inventory
    SET
      name = ?,
      category = ?,
      quantity = ?,
      minThreshold = ?,
      location = ?,
      unitPrice = ?
    WHERE id = ?
  `;

  const values = [
    name,
    category || null,
    Number(quantity) || 0,
    Number(minThreshold) || 0,
    location || null,
    Number(unitPrice) || 0,
    req.params.id,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      return sendDbError(
        res,
        "Error updating inventory item:",
        err
      );
    }

    if (!result.affectedRows) {
      return res.status(404).json({
        success: false,
        error: "Item not found",
      });
    }

    res.json({
      success: true,
      message: "Item updated",
    });
  });
};

exports.deleteInventoryItem = (req, res) => {
  db.query(
    "DELETE FROM inventory WHERE id = ?",
    [req.params.id],
    (err, result) => {
      if (err) {
        return sendDbError(
          res,
          "Error deleting inventory item:",
          err
        );
      }

      if (!result.affectedRows) {
        return res.status(404).json({
          success: false,
          error: "Item not found",
        });
      }

      res.json({
        success: true,
        message: "Item deleted",
      });
    }
  );
};