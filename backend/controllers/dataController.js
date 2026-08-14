const db = require("../config/db");
const sendDbError = require("../utils/dbError");

const allowedTables = [
  "clients",
  "users",
  "products",
  "orders",
  "inventory",
  "employees",
  "transactions",
];

exports.getData = (req, res) => {
  const { table } = req.params;

  if (!allowedTables.includes(table)) {
    return res.status(400).json({
      success: false,
      error: "Invalid table name",
    });
  }

  const sql = `SELECT * FROM \`${table}\``;

  db.query(sql, (err, rows) => {
    if (err) {
      return sendDbError(
        res,
        `Error fetching ${table}:`,
        err
      );
    }

    res.json({
      success: true,
      data: rows,
      count: rows.length,
    });
  });
};

exports.insertData = (req, res) => {
  const { table } = req.params;
  const data = req.body;

  if (!allowedTables.includes(table)) {
    return res.status(400).json({
      success: false,
      error: "Invalid table name",
    });
  }

  const columns = Object.keys(data);

  if (!columns.length) {
    return res.status(400).json({
      success: false,
      error: "No data provided",
    });
  }

  const placeholders = columns
    .map(() => "?")
    .join(", ");

  const sql = `
    INSERT INTO \`${table}\`
    (${columns.map((column) => `\`${column}\``).join(", ")})
    VALUES (${placeholders})
  `;

  db.query(
    sql,
    Object.values(data),
    (err, result) => {
      if (err) {
        return sendDbError(
          res,
          `Error inserting into ${table}:`,
          err
        );
      }

      res.status(201).json({
        success: true,
        message: `Record inserted into ${table} successfully`,
        insertId: result.insertId,
      });
    }
  );
};