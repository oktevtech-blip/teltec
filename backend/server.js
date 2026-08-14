// // server.js - cleaned, fixed, integrated (drop-in)
// const express = require('express');
// const mysql = require('mysql');
// const cors = require('cors');

// const app = express();
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // ------------- DB CONNECTION -------------
// const db = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'teltec_database'
// });

// db.connect((err) => {
//   if (err) {
//     console.error('Database connection failed:', err);
//     process.exit(1); // fail fast
//   }
//   console.log('Connected to MySQL database');
// });

// // ------------- HELPERS -------------
// function sendDbError(res, context, err) {
//   console.error(context, err);
//   return res.status(500).json({ success: false, error: 'Database error', details: err?.message || err });
// }

// // ------------- BASIC ROUTES -------------
// app.get('/', (req, res) => res.json({ message: 'Backend server is running' }));

// // ------------- CLIENTS -------------
// app.get('/clients', (req, res) => {
//   const sql = 'SELECT * FROM clients ORDER BY id DESC';
//   db.query(sql, (err, rows) => {
//     if (err) return sendDbError(res, 'Error fetching clients:', err);
//     res.json({ success: true, data: rows, count: rows.length });
//   });
// });

// app.get('/clients/:id', (req, res) => {
//   const clientId = req.params.id;
//   const sql = 'SELECT * FROM clients WHERE id = ?';
//   db.query(sql, [clientId], (err, rows) => {
//     if (err) return sendDbError(res, 'Error fetching client:', err);
//     if (!rows.length) return res.status(404).json({ success: false, error: 'Client not found' });
//     res.json({ success: true, data: rows[0] });
//   });
// });

// app.post('/clients', (req, res) => {
//   const { name, email, phone, address, company_type, status } = req.body;
//   const errors = [];
//   if (!name || !name.trim()) errors.push('Name is required');
//   if (!email || !email.trim()) errors.push('Email is required');
//   if (!phone || !phone.trim()) errors.push('Phone is required');
//   if (!address || !address.trim()) errors.push('Address is required');
//   if (!company_type || !company_type.trim()) errors.push('Company type is required');
//   if (errors.length) return res.status(400).json({ success: false, error: 'Validation failed', details: errors });

//   const checkSql = 'SELECT id FROM clients WHERE email = ?';
//   db.query(checkSql, [email.trim().toLowerCase()], (err, rows) => {
//     if (err) return sendDbError(res, 'Error checking client email:', err);
//     if (rows.length) return res.status(409).json({ success: false, error: 'A client with this email already exists' });

//     const insertSql = 'INSERT INTO clients (name, email, phone, address, company_type, status, registration_date) VALUES (?, ?, ?, ?, ?, ?, NOW())';
//     const values = [name.trim(), email.trim().toLowerCase(), phone.trim(), address.trim(), company_type.trim(), status || 'active'];
//     db.query(insertSql, values, (err2, result) => {
//       if (err2) return sendDbError(res, 'Error creating client:', err2);
//       res.status(201).json({
//         success: true,
//         message: 'Client created successfully',
//         data: { id: result.insertId, name: name.trim(), email: email.trim().toLowerCase(), phone: phone.trim(), address: address.trim(), company_type: company_type.trim(), status: status || 'active' }
//       });
//     });
//   });
// });

// app.put('/clients/:id', (req, res) => {
//   const clientId = req.params.id;
//   const { name, email, phone, address, company_type, status } = req.body;
//   const errors = [];
//   if (!name || !name.trim()) errors.push('Name is required');
//   if (!email || !email.trim()) errors.push('Email is required');
//   if (!phone || !phone.trim()) errors.push('Phone number is required');
//   if (!address || !address.trim()) errors.push('Address is required');
//   if (!company_type || !company_type.trim()) errors.push('Company type is required');
//   if (errors.length) return res.status(400).json({ success: false, error: 'Validation failed', details: errors });

//   const checkSql = 'SELECT id FROM clients WHERE email = ? AND id != ?';
//   db.query(checkSql, [email.trim().toLowerCase(), clientId], (err, rows) => {
//     if (err) return sendDbError(res, 'Error checking client email:', err);
//     if (rows.length) return res.status(409).json({ success: false, error: 'Another client with this email already exists' });

//     const updateSql = 'UPDATE clients SET name = ?, email = ?, phone = ?, address = ?, company_type = ?, status = ?, updated_at = NOW() WHERE id = ?';
//     const values = [name.trim(), email.trim().toLowerCase(), phone.trim(), address.trim(), company_type.trim(), status || 'active', clientId];
//     db.query(updateSql, values, (err2, result) => {
//       if (err2) return sendDbError(res, 'Error updating client:', err2);
//       if (!result.affectedRows) return res.status(404).json({ success: false, error: 'Client not found' });
//       res.json({ success: true, message: 'Client updated successfully', data: { id: clientId, name: name.trim(), email: email.trim().toLowerCase(), phone: phone.trim(), address: address.trim(), company_type: company_type.trim(), status: status || 'active' } });
//     });
//   });
// });

// app.delete('/clients/:id', (req, res) => {
//   const clientId = req.params.id;
//   const sql = 'DELETE FROM clients WHERE id = ?';
//   db.query(sql, [clientId], (err, result) => {
//     if (err) return sendDbError(res, 'Error deleting client:', err);
//     if (result.affectedRows === 0) return res.status(404).json({ success: false, error: 'Client not found' });
//     res.json({ success: true, message: 'Client deleted successfully' });
//   });
// });

// // ------------- EMPLOYEES -------------
// app.get('/employees', (req, res) => {
//   const sql = 'SELECT * FROM employees ORDER BY id DESC';
//   db.query(sql, (err, rows) => {
//     if (err) return sendDbError(res, 'Error fetching employees:', err);
//     res.json({ success: true, data: rows, count: rows.length });
//   });
// });

// app.get('/employees/:id', (req, res) => {
//   const employeeId = req.params.id;
//   const sql = 'SELECT * FROM employees WHERE id = ?';
//   db.query(sql, [employeeId], (err, rows) => {
//     if (err) return sendDbError(res, 'Error fetching employee:', err);
//     if (!rows.length) return res.status(404).json({ success: false, error: 'Employee not found' });
//     res.json({ success: true, data: rows[0] });
//   });
// });

// app.post('/employees', (req, res) => {
//   const { name, email, phone, department, skills, status, position, salary } = req.body;
//   const errors = [];
//   if (!name || !name.trim()) errors.push('Name is required');
//   if (!email || !email.trim()) errors.push('Email is required');
//   if (!phone || !phone.trim()) errors.push('Phone number is required');
//   if (!position || !position.trim()) errors.push('Position is required');
//   if (!department || !department.trim()) errors.push('Department type is required');
//   if (!skills || !skills.trim()) errors.push('Skills is required');
//   const salaryNum = Number(salary);
//   if (!salary || isNaN(salaryNum) || salaryNum <= 0) errors.push('Salary must be a valid number greater than 0');
//   if (errors.length) return res.status(400).json({ success: false, error: 'Validation failed', details: errors });

//   const checkSql = 'SELECT id FROM employees WHERE email = ?';
//   db.query(checkSql, [email.trim().toLowerCase()], (err, rows) => {
//     if (err) return sendDbError(res, 'Error checking employee email:', err);
//     if (rows.length) return res.status(409).json({ success: false, error: 'An employee with this email already exists' });

//     const insertSql = 'INSERT INTO employees (name, email, phone, position, department, status, skills, salary, registration_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())';
//     const values = [name.trim(), email.trim().toLowerCase(), phone.trim(), position.trim(), department.trim(), status || 'active', skills.trim(), salaryNum];
//     db.query(insertSql, values, (err2, result) => {
//       if (err2) return sendDbError(res, 'Error creating employee:', err2);
//       res.status(201).json({ success: true, message: 'Employee created successfully', data: { id: result.insertId, name: name.trim(), email: email.trim().toLowerCase(), phone: phone.trim(), position: position.trim(), department: department.trim(), skills: skills.trim(), salary: salaryNum, status: status || 'active' } });
//     });
//   });
// });

// app.put('/employees/:id', (req, res) => {
//   const employeeId = req.params.id;
//   const { name, email, phone, position, department, status, skills, salary } = req.body;
//   const errors = [];
//   if (!name || !name.trim()) errors.push('Name is required');
//   if (!email || !email.trim()) errors.push('Email is required');
//   if (!phone || !phone.trim()) errors.push('Phone number is required');
//   if (!position || !position.trim()) errors.push('Position is required');
//   if (!department || !department.trim()) errors.push('Department is required');
//   if (!skills || !skills.trim()) errors.push('Skills are required');
//   const salaryNum = Number(salary);
//   if (!salary || isNaN(salaryNum) || salaryNum <= 0) errors.push('Salary must be a valid number greater than 0');
//   if (errors.length) return res.status(400).json({ success: false, error: 'Validation failed', details: errors });

//   const checkSql = 'SELECT id FROM employees WHERE email = ? AND id != ?';
//   db.query(checkSql, [email.trim().toLowerCase(), employeeId], (err, rows) => {
//     if (err) return sendDbError(res, 'Error checking employee email:', err);
//     if (rows.length) return res.status(409).json({ success: false, error: 'Another employee with this email already exists' });

//     const updateSql = 'UPDATE employees SET name = ?, email = ?, phone = ?, position = ?, department = ?, salary = ?, skills = ?, status = ?, updated_at = NOW() WHERE id = ?';
//     const values = [name.trim(), email.trim().toLowerCase(), phone.trim(), position.trim(), department.trim(), salaryNum, skills.trim(), status || 'active', employeeId];
//     db.query(updateSql, values, (err2, result) => {
//       if (err2) return sendDbError(res, 'Error updating employee:', err2);
//       if (!result.affectedRows) return res.status(404).json({ success: false, error: 'Employee not found' });
//       res.json({ success: true, message: 'Employee updated successfully', data: { id: employeeId, name: name.trim(), email: email.trim().toLowerCase(), phone: phone.trim(), position: position.trim(), department: department.trim(), skills: skills.trim(), salary: salaryNum, status: status || 'active' } });
//     });
//   });
// });

// app.delete('/employees/:id', (req, res) => {
//   const employeeId = req.params.id;
//   const sql = 'DELETE FROM employees WHERE id = ?';
//   db.query(sql, [employeeId], (err, result) => {
//     if (err) return sendDbError(res, 'Error deleting employee:', err);
//     if (result.affectedRows === 0) return res.status(404).json({ success: false, error: 'Employee not found' });
//     res.json({ success: true, message: 'Employee deleted successfully' });
//   });
// });

// // ------------- BATCH INSERTS -------------
// app.post('/clients/batch', (req, res) => {
//   const clients = req.body.clients;
//   if (!Array.isArray(clients) || clients.length === 0) return res.status(400).json({ success: false, error: 'Please provide an array of clients' });

//   const sql = 'INSERT INTO clients (name, email, phone, address, company_type, status, registration_date) VALUES ?';
//   const values = clients.map(c => [c.name?.trim(), c.email?.trim().toLowerCase(), c.phone?.trim(), c.address?.trim(), c.company_type?.trim(), c.status || 'active', new Date()]);
//   db.query(sql, [values], (err, result) => {
//     if (err) return sendDbError(res, 'Error batch inserting clients:', err);
//     res.status(201).json({ success: true, message: `${result.affectedRows} clients created successfully`, insertedCount: result.affectedRows });
//   });
// });

// app.post('/employees/batch', (req, res) => {
//   const employees = req.body.employees;
//   if (!Array.isArray(employees) || employees.length === 0) return res.status(400).json({ success: false, error: 'Please provide an array of employees' });

//   const sql = 'INSERT INTO employees (name, email, phone, position, department, skills, salary, status, registration_date) VALUES ?';
//   const values = employees.map(e => [e.name?.trim(), e.email?.trim().toLowerCase(), e.phone?.trim(), e.position?.trim(), e.department?.trim(), e.skills?.trim(), e.salary, e.status || 'active', new Date()]);
//   db.query(sql, [values], (err, result) => {
//     if (err) return sendDbError(res, 'Error batch inserting employees:', err);
//     res.status(201).json({ success: true, message: `${result.affectedRows} employees created successfully`, insertedCount: result.affectedRows });
//   });
// });

// // ------------- GENERIC DATA ENDPOINTS -------------
// app.get('/data/:table', (req, res) => {
//   const table = req.params.table;
//   const allowed = ['clients', 'users', 'products', 'orders', 'inventory', 'employees', 'transactions'];
//   if (!allowed.includes(table)) return res.status(400).json({ success: false, error: 'Invalid table name' });
//   const sql = `SELECT * FROM \`${table}\``;
//   db.query(sql, (err, rows) => {
//     if (err) return sendDbError(res, `Error fetching ${table}:`, err);
//     res.json({ success: true, data: rows, count: rows.length });
//   });
// });

// app.post('/data/:table', (req, res) => {
//   const table = req.params.table;
//   const data = req.body;
//   const allowed = ['clients', 'users', 'products', 'orders', 'inventory', 'employees', 'transactions'];
//   if (!allowed.includes(table)) return res.status(400).json({ success: false, error: 'Invalid table name' });
//   const columns = Object.keys(data);
//   if (!columns.length) return res.status(400).json({ success: false, error: 'No data provided' });
//   const placeholders = columns.map(() => '?').join(', ');
//   const sql = `INSERT INTO \`${table}\` (${columns.join(', ')}) VALUES (${placeholders})`;
//   db.query(sql, Object.values(data), (err, result) => {
//     if (err) return sendDbError(res, `Error inserting into ${table}:`, err);
//     res.status(201).json({ success: true, message: `Record inserted into ${table} successfully`, insertId: result.insertId });
//   });
// });

// // ------------- AUTH -------------
// app.post('/login', (req, res) => {
//   const { username, password } = req.body;
//   if (!username || !password) return res.status(400).json({ success: false, message: 'Username and password are required' });

//   const sql = 'SELECT id, username, name, role FROM users WHERE username = ? AND password = ?';
//   db.query(sql, [username, password], (err, rows) => {
//     if (err) return sendDbError(res, 'Login error:', err);
//     if (!rows.length) return res.status(401).json({ success: false, message: 'Invalid username or password' });
//     res.json({ success: true, message: 'Login successful', user: rows[0] });
//   });
// });

// // ------------- INVENTORY (CRUD) -------------
// app.get('/api/inventory', (req, res) => {
//   const sql = 'SELECT * FROM inventory ORDER BY id DESC';
//   db.query(sql, (err, rows) => {
//     if (err) return sendDbError(res, 'Error fetching inventory:', err);
//     res.json({ success: true, data: rows });
//   });
// });

// app.get('/api/inventory/:id', (req, res) => {
//   const sql = 'SELECT * FROM inventory WHERE id = ?';
//   db.query(sql, [req.params.id], (err, rows) => {
//     if (err) return sendDbError(res, 'Error fetching inventory item:', err);
//     if (!rows.length) return res.status(404).json({ success: false, error: 'Item not found' });
//     res.json({ success: true, data: rows[0] });
//   });
// });

// // Note: expected body keys: name, category, quantity, minThreshold, location, unitPrice
// app.post('/api/inventory', (req, res) => {
//   const { name, category, quantity, minThreshold, location, unitPrice } = req.body;
//   if (!name || quantity == null) return res.status(400).json({ success: false, error: 'Name and quantity are required' });

//   const sql = 'INSERT INTO inventory (name, category, quantity, minThreshold, location, unitPrice) VALUES (?, ?, ?, ?, ?, NOW())';
//   const values = [name, category || null, Number(quantity) || 0, Number(minThreshold) || 0, location || null, Number(unitPrice) || 0];
//   db.query(sql, values, (err, result) => {
//     if (err) return sendDbError(res, 'Error creating inventory item:', err);
//     res.status(201).json({ success: true, id: result.insertId });
//   });
// });

// app.put('/api/inventory/:id', (req, res) => {
//   const { name, category, quantity, minThreshold, location, unitPrice } = req.body;
//   const sql = 'UPDATE inventory SET name = ?, category = ?, quantity = ?, minThreshold = ?, location = ?, unitPrice = NOW() WHERE id = ?';
//   const values = [name, category || null, Number(quantity) || 0, Number(minThreshold) || 0, location || null, Number(unitPrice) || 0, req.params.id];
//   db.query(sql, values, (err, result) => {
//     if (err) return sendDbError(res, 'Error updating inventory item:', err);
//     if (!result.affectedRows) return res.status(404).json({ success: false, error: 'Item not found' });
//     res.json({ success: true, message: 'Item updated' });
//   });
// });

// app.delete('/api/inventory/:id', (req, res) => {
//   const sql = 'DELETE FROM inventory WHERE id = ?';
//   db.query(sql, [req.params.id], (err, result) => {
//     if (err) return sendDbError(res, 'Error deleting inventory item:', err);
//     if (!result.affectedRows) return res.status(404).json({ success: false, error: 'Item not found' });
//     res.json({ success: true, message: 'Item deleted' });
//   });
// });

// // ------------- TRANSACTIONS -------------
// // GET all transactions
// app.get('/api/transactions', (req, res) => {
//   const sql = `
//     SELECT t.*, i.name AS itemName
//     FROM transactions t
//     LEFT JOIN inventory i ON t.itemId = i.id
//     ORDER BY t.created_at DESC
//   `;
//   db.query(sql, (err, rows) => {
//     if (err) return sendDbError(res, 'Error fetching transactions:', err);
//     res.json({ success: true, data: rows });
//   });
// });

// // POST create transaction (checkout or return)
// // expects { itemId, workerName, type: 'checkout'|'return', quantity }
// app.post('/api/transactions', (req, res) => {
//   const { itemId, workerName, type, quantity } = req.body;
//   if (!itemId || !workerName || !type || !quantity) return res.status(400).json({ success: false, error: 'Missing fields' });

//   const qty = Number(quantity);
//   if (isNaN(qty) || qty <= 0) return res.status(400).json({ success: false, error: 'Invalid quantity' });

//   const date = new Date().toISOString().split('T')[0];

//   // fetch item
//   db.query('SELECT * FROM inventory WHERE id = ?', [itemId], (err, rows) => {
//     if (err) return sendDbError(res, 'DB error fetching inventory item:', err);
//     if (!rows.length) return res.status(404).json({ success: false, error: 'Item not found' });
//     const item = rows[0];

//     if (type === 'checkout') {
//       if (Number(item.quantity) < qty) return res.status(400).json({ success: false, error: 'Not enough stock' });

//       const insertSql = 'INSERT INTO transactions (itemId, workerName, type, quantity, date, status) VALUES (?, ?, ?, ?, ?, ?)';
//       db.query(insertSql, [itemId, workerName, 'checkout', qty, date, 'checked_out'], (err2, tx) => {
//         if (err2) return sendDbError(res, 'DB error inserting transaction:', err2);
//         db.query('UPDATE inventory SET quantity = quantity - ?, lastUpdated = NOW() WHERE id = ?', [qty, itemId], (err3) => {
//           if (err3) console.error('Warning: reduced stock but failed to update lastUpdated:', err3);
//           res.status(201).json({ success: true, transactionId: tx.insertId });
//         });
//       });
//     } else if (type === 'return') {
//       const insertSql = 'INSERT INTO transactions (itemId, workerName, type, quantity, date, returnDate, status) VALUES (?, ?, ?, ?, ?, ?, ?)';
//       db.query(insertSql, [itemId, workerName, 'return', qty, date, date, 'returned'], (err2, tx) => {
//         if (err2) return sendDbError(res, 'DB error inserting return transaction:', err2);
//         db.query('UPDATE inventory SET quantity = quantity + ?, lastUpdated = NOW() WHERE id = ?', [qty, itemId], (err3) => {
//           if (err3) console.error('Warning: increased stock but failed to update lastUpdated:', err3);
//           res.status(201).json({ success: true, transactionId: tx.insertId });
//         });
//       });
//     } else {
//       return res.status(400).json({ success: false, error: 'Invalid transaction type' });
//     }
//   });
// });

// // ------------- ERROR HANDLING & 404 -------------
// app.use((err, req, res, next) => {
//   console.error('Unhandled error:', err);
//   res.status(500).json({ success: false, error: 'Internal server error' });
// });

// app.use((req, res) => {
//   res.status(404).json({ success: false, error: 'Endpoint not found' });
// });

// // ------------- GRACEFUL SHUTDOWN -------------
// process.on('SIGINT', () => {
//   console.log('Shutting down server...');
//   db.end();
//   process.exit(0);
// });

// // ------------- START -------------
// const PORT = process.env.PORT || 8081;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });


require("dotenv").config();

const express = require("express");
const cors = require("cors");

const clientRoutes = require("./routes/clientRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const authRoutes = require("./routes/authRoutes");
const dataRoutes = require("./routes/dataRoutes");

const db = require("./config/db");

const {
  notFound,
  errorHandler,
} = require("./middleware/errorHandler");

const app = express();

// --------------------------------------------------
// MIDDLEWARE
// --------------------------------------------------

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// --------------------------------------------------
// BASIC ROUTE
// --------------------------------------------------

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "TELTEC Backend server is running",
  });
});

// --------------------------------------------------
// ROUTES
// --------------------------------------------------

app.use("/clients", clientRoutes);

app.use("/employees", employeeRoutes);

app.use("/api/inventory", inventoryRoutes);

app.use("/api/transactions", transactionRoutes);

app.use("/", authRoutes);

app.use("/data", dataRoutes);

// --------------------------------------------------
// ERROR HANDLING
// --------------------------------------------------

app.use(notFound);

app.use(errorHandler);

// --------------------------------------------------
// START SERVER
// --------------------------------------------------

const PORT = process.env.PORT || 8081;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// --------------------------------------------------
// GRACEFUL SHUTDOWN
// --------------------------------------------------

const shutdown = (signal) => {
  console.log(`${signal} received. Shutting down server...`);

  server.close(() => {
    console.log("HTTP server closed.");

    db.end((err) => {
      if (err) {
        console.error("Error closing database pool:", err.message);
        process.exit(1);
      }

      console.log("Database connection pool closed.");
      process.exit(0);
    });
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));

process.on("SIGTERM", () => shutdown("SIGTERM"));