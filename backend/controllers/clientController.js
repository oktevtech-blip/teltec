const db = require("../config/db");
const sendDbError = require("../utils/dbError");

exports.getClients = (req, res) => {
  const sql = "SELECT * FROM clients ORDER BY id DESC";

  db.query(sql, (err, rows) => {
    if (err) return sendDbError(res, "Error fetching clients:", err);

    res.json({
      success: true,
      data: rows,
      count: rows.length,
    });
  });
};

exports.getClient = (req, res) => {
  const sql = "SELECT * FROM clients WHERE id = ?";

  db.query(sql, [req.params.id], (err, rows) => {
    if (err) return sendDbError(res, "Error fetching client:", err);

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        error: "Client not found",
      });
    }

    res.json({
      success: true,
      data: rows[0],
    });
  });
};

exports.createClient = (req, res) => {
  const {
    name,
    email,
    phone,
    address,
    company_type,
    status,
  } = req.body;

  const errors = [];

  if (!name || !name.trim()) errors.push("Name is required");
  if (!email || !email.trim()) errors.push("Email is required");
  if (!phone || !phone.trim()) errors.push("Phone is required");
  if (!address || !address.trim()) errors.push("Address is required");
  if (!company_type || !company_type.trim()) {
    errors.push("Company type is required");
  }

  if (errors.length) {
    return res.status(400).json({
      success: false,
      error: "Validation failed",
      details: errors,
    });
  }

  const cleanEmail = email.trim().toLowerCase();

  db.query(
    "SELECT id FROM clients WHERE email = ?",
    [cleanEmail],
    (err, rows) => {
      if (err) {
        return sendDbError(
          res,
          "Error checking client email:",
          err
        );
      }

      if (rows.length) {
        return res.status(409).json({
          success: false,
          error: "A client with this email already exists",
        });
      }

      const sql = `
        INSERT INTO clients
        (name, email, phone, address, company_type, status, registration_date)
        VALUES (?, ?, ?, ?, ?, ?, NOW())
      `;

      const values = [
        name.trim(),
        cleanEmail,
        phone.trim(),
        address.trim(),
        company_type.trim(),
        status || "active",
      ];

      db.query(sql, values, (err, result) => {
        if (err) {
          return sendDbError(
            res,
            "Error creating client:",
            err
          );
        }

        res.status(201).json({
          success: true,
          message: "Client created successfully",
          data: {
            id: result.insertId,
            name: name.trim(),
            email: cleanEmail,
            phone: phone.trim(),
            address: address.trim(),
            company_type: company_type.trim(),
            status: status || "active",
          },
        });
      });
    }
  );
};

exports.updateClient = (req, res) => {
  const clientId = req.params.id;

  const {
    name,
    email,
    phone,
    address,
    company_type,
    status,
  } = req.body;

  const errors = [];

  if (!name || !name.trim()) errors.push("Name is required");
  if (!email || !email.trim()) errors.push("Email is required");
  if (!phone || !phone.trim()) {
    errors.push("Phone number is required");
  }
  if (!address || !address.trim()) {
    errors.push("Address is required");
  }
  if (!company_type || !company_type.trim()) {
    errors.push("Company type is required");
  }

  if (errors.length) {
    return res.status(400).json({
      success: false,
      error: "Validation failed",
      details: errors,
    });
  }

  const cleanEmail = email.trim().toLowerCase();

  db.query(
    "SELECT id FROM clients WHERE email = ? AND id != ?",
    [cleanEmail, clientId],
    (err, rows) => {
      if (err) {
        return sendDbError(
          res,
          "Error checking client email:",
          err
        );
      }

      if (rows.length) {
        return res.status(409).json({
          success: false,
          error: "Another client with this email already exists",
        });
      }

      const sql = `
        UPDATE clients
        SET
          name = ?,
          email = ?,
          phone = ?,
          address = ?,
          company_type = ?,
          status = ?,
          updated_at = NOW()
        WHERE id = ?
      `;

      const values = [
        name.trim(),
        cleanEmail,
        phone.trim(),
        address.trim(),
        company_type.trim(),
        status || "active",
        clientId,
      ];

      db.query(sql, values, (err, result) => {
        if (err) {
          return sendDbError(
            res,
            "Error updating client:",
            err
          );
        }

        if (!result.affectedRows) {
          return res.status(404).json({
            success: false,
            error: "Client not found",
          });
        }

        res.json({
          success: true,
          message: "Client updated successfully",
        });
      });
    }
  );
};

exports.deleteClient = (req, res) => {
  db.query(
    "DELETE FROM clients WHERE id = ?",
    [req.params.id],
    (err, result) => {
      if (err) {
        return sendDbError(
          res,
          "Error deleting client:",
          err
        );
      }

      if (!result.affectedRows) {
        return res.status(404).json({
          success: false,
          error: "Client not found",
        });
      }

      res.json({
        success: true,
        message: "Client deleted successfully",
      });
    }
  );
};

exports.batchCreateClients = (req, res) => {
  const clients = req.body.clients;

  if (!Array.isArray(clients) || clients.length === 0) {
    return res.status(400).json({
      success: false,
      error: "Please provide an array of clients",
    });
  }

  const sql = `
    INSERT INTO clients
    (name, email, phone, address, company_type, status, registration_date)
    VALUES ?
  `;

  const values = clients.map((client) => [
    client.name?.trim(),
    client.email?.trim().toLowerCase(),
    client.phone?.trim(),
    client.address?.trim(),
    client.company_type?.trim(),
    client.status || "active",
    new Date(),
  ]);

  db.query(sql, [values], (err, result) => {
    if (err) {
      return sendDbError(
        res,
        "Error batch inserting clients:",
        err
      );
    }

    res.status(201).json({
      success: true,
      message: `${result.affectedRows} clients created successfully`,
      insertedCount: result.affectedRows,
    });
  });
};