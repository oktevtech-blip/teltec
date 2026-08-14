const db = require("../config/db");
const sendDbError = require("../utils/dbError");

exports.getTransactions = (req, res) => {
  const sql = `
    SELECT
      t.*,
      i.name AS itemName
    FROM transactions t
    LEFT JOIN inventory i ON t.itemId = i.id
    ORDER BY t.created_at DESC
  `;

  db.query(sql, (err, rows) => {
    if (err) {
      return sendDbError(
        res,
        "Error fetching transactions:",
        err
      );
    }

    res.json({
      success: true,
      data: rows,
    });
  });
};

exports.createTransaction = (req, res) => {
  const {
    itemId,
    workerName,
    type,
    quantity,
  } = req.body;

  if (!itemId || !workerName || !type || !quantity) {
    return res.status(400).json({
      success: false,
      error: "Missing fields",
    });
  }

  const qty = Number(quantity);

  if (isNaN(qty) || qty <= 0) {
    return res.status(400).json({
      success: false,
      error: "Invalid quantity",
    });
  }

  const date = new Date()
    .toISOString()
    .split("T")[0];

  db.query(
    "SELECT * FROM inventory WHERE id = ?",
    [itemId],
    (err, rows) => {
      if (err) {
        return sendDbError(
          res,
          "DB error fetching inventory item:",
          err
        );
      }

      if (!rows.length) {
        return res.status(404).json({
          success: false,
          error: "Item not found",
        });
      }

      const item = rows[0];

      if (type === "checkout") {
        if (Number(item.quantity) < qty) {
          return res.status(400).json({
            success: false,
            error: "Not enough stock",
          });
        }

        const insertSql = `
          INSERT INTO transactions
          (itemId, workerName, type, quantity, date, status)
          VALUES (?, ?, ?, ?, ?, ?)
        `;

        db.query(
          insertSql,
          [
            itemId,
            workerName,
            "checkout",
            qty,
            date,
            "checked_out",
          ],
          (err, transaction) => {
            if (err) {
              return sendDbError(
                res,
                "DB error inserting transaction:",
                err
              );
            }

            db.query(
              `
                UPDATE inventory
                SET quantity = quantity - ?,
                    lastUpdated = NOW()
                WHERE id = ?
              `,
              [qty, itemId],
              (updateErr) => {
                if (updateErr) {
                  console.error(
                    "Warning: failed to update inventory:",
                    updateErr
                  );
                }

                res.status(201).json({
                  success: true,
                  transactionId:
                    transaction.insertId,
                });
              }
            );
          }
        );
      } else if (type === "return") {
        const insertSql = `
          INSERT INTO transactions
          (itemId, workerName, type, quantity, date, returnDate, status)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(
          insertSql,
          [
            itemId,
            workerName,
            "return",
            qty,
            date,
            date,
            "returned",
          ],
          (err, transaction) => {
            if (err) {
              return sendDbError(
                res,
                "DB error inserting return transaction:",
                err
              );
            }

            db.query(
              `
                UPDATE inventory
                SET quantity = quantity + ?,
                    lastUpdated = NOW()
                WHERE id = ?
              `,
              [qty, itemId],
              (updateErr) => {
                if (updateErr) {
                  console.error(
                    "Warning: failed to update inventory:",
                    updateErr
                  );
                }

                res.status(201).json({
                  success: true,
                  transactionId:
                    transaction.insertId,
                });
              }
            );
          }
        );
      } else {
        return res.status(400).json({
          success: false,
          error: "Invalid transaction type",
        });
      }
    }
  );
};