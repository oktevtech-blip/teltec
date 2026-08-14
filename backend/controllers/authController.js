const db = require("../config/db");
const sendDbError = require("../utils/dbError");

exports.login = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Username and password are required",
    });
  }

  const sql = `
    SELECT id, username, name, role
    FROM users
    WHERE username = ? AND password = ?
  `;

  db.query(
    sql,
    [username, password],
    (err, rows) => {
      if (err) {
        return sendDbError(
          res,
          "Login error:",
          err
        );
      }

      if (!rows.length) {
        return res.status(401).json({
          success: false,
          message: "Invalid username or password",
        });
      }

      res.json({
        success: true,
        message: "Login successful",
        user: rows[0],
      });
    }
  );
};