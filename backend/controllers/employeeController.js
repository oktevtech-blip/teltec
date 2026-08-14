const db = require("../config/db");
const sendDbError = require("../utils/dbError");

exports.getEmployees = (req, res) => {
  db.query(
    "SELECT * FROM employees ORDER BY id DESC",
    (err, rows) => {
      if (err) {
        return sendDbError(
          res,
          "Error fetching employees:",
          err
        );
      }

      res.json({
        success: true,
        data: rows,
        count: rows.length,
      });
    }
  );
};

exports.getEmployee = (req, res) => {
  db.query(
    "SELECT * FROM employees WHERE id = ?",
    [req.params.id],
    (err, rows) => {
      if (err) {
        return sendDbError(
          res,
          "Error fetching employee:",
          err
        );
      }

      if (!rows.length) {
        return res.status(404).json({
          success: false,
          error: "Employee not found",
        });
      }

      res.json({
        success: true,
        data: rows[0],
      });
    }
  );
};

exports.createEmployee = (req, res) => {
  const {
    name,
    email,
    phone,
    department,
    skills,
    status,
    position,
    salary,
  } = req.body;

  const errors = [];

  if (!name?.trim()) errors.push("Name is required");
  if (!email?.trim()) errors.push("Email is required");
  if (!phone?.trim()) errors.push("Phone number is required");
  if (!position?.trim()) errors.push("Position is required");
  if (!department?.trim()) errors.push("Department is required");
  if (!skills?.trim()) errors.push("Skills are required");

  const salaryNum = Number(salary);

  if (!salary || isNaN(salaryNum) || salaryNum <= 0) {
    errors.push(
      "Salary must be a valid number greater than 0"
    );
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
    "SELECT id FROM employees WHERE email = ?",
    [cleanEmail],
    (err, rows) => {
      if (err) {
        return sendDbError(
          res,
          "Error checking employee email:",
          err
        );
      }

      if (rows.length) {
        return res.status(409).json({
          success: false,
          error: "An employee with this email already exists",
        });
      }

      const sql = `
        INSERT INTO employees
        (name, email, phone, position, department, status, skills, salary, registration_date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
      `;

      const values = [
        name.trim(),
        cleanEmail,
        phone.trim(),
        position.trim(),
        department.trim(),
        status || "active",
        skills.trim(),
        salaryNum,
      ];

      db.query(sql, values, (err, result) => {
        if (err) {
          return sendDbError(
            res,
            "Error creating employee:",
            err
          );
        }

        res.status(201).json({
          success: true,
          message: "Employee created successfully",
          data: {
            id: result.insertId,
            name: name.trim(),
            email: cleanEmail,
            phone: phone.trim(),
            position: position.trim(),
            department: department.trim(),
            skills: skills.trim(),
            salary: salaryNum,
            status: status || "active",
          },
        });
      });
    }
  );
};

exports.updateEmployee = (req, res) => {
  const employeeId = req.params.id;

  const {
    name,
    email,
    phone,
    position,
    department,
    status,
    skills,
    salary,
  } = req.body;

  const errors = [];

  if (!name?.trim()) errors.push("Name is required");
  if (!email?.trim()) errors.push("Email is required");
  if (!phone?.trim()) errors.push("Phone number is required");
  if (!position?.trim()) errors.push("Position is required");
  if (!department?.trim()) errors.push("Department is required");
  if (!skills?.trim()) errors.push("Skills are required");

  const salaryNum = Number(salary);

  if (!salary || isNaN(salaryNum) || salaryNum <= 0) {
    errors.push(
      "Salary must be a valid number greater than 0"
    );
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
    "SELECT id FROM employees WHERE email = ? AND id != ?",
    [cleanEmail, employeeId],
    (err, rows) => {
      if (err) {
        return sendDbError(
          res,
          "Error checking employee email:",
          err
        );
      }

      if (rows.length) {
        return res.status(409).json({
          success: false,
          error: "Another employee with this email already exists",
        });
      }

      const sql = `
        UPDATE employees
        SET
          name = ?,
          email = ?,
          phone = ?,
          position = ?,
          department = ?,
          salary = ?,
          skills = ?,
          status = ?,
          updated_at = NOW()
        WHERE id = ?
      `;

      const values = [
        name.trim(),
        cleanEmail,
        phone.trim(),
        position.trim(),
        department.trim(),
        salaryNum,
        skills.trim(),
        status || "active",
        employeeId,
      ];

      db.query(sql, values, (err, result) => {
        if (err) {
          return sendDbError(
            res,
            "Error updating employee:",
            err
          );
        }

        if (!result.affectedRows) {
          return res.status(404).json({
            success: false,
            error: "Employee not found",
          });
        }

        res.json({
          success: true,
          message: "Employee updated successfully",
        });
      });
    }
  );
};

exports.deleteEmployee = (req, res) => {
  db.query(
    "DELETE FROM employees WHERE id = ?",
    [req.params.id],
    (err, result) => {
      if (err) {
        return sendDbError(
          res,
          "Error deleting employee:",
          err
        );
      }

      if (!result.affectedRows) {
        return res.status(404).json({
          success: false,
          error: "Employee not found",
        });
      }

      res.json({
        success: true,
        message: "Employee deleted successfully",
      });
    }
  );
};

exports.batchCreateEmployees = (req, res) => {
  const employees = req.body.employees;

  if (!Array.isArray(employees) || employees.length === 0) {
    return res.status(400).json({
      success: false,
      error: "Please provide an array of employees",
    });
  }

  const sql = `
    INSERT INTO employees
    (name, email, phone, position, department, skills, salary, status, registration_date)
    VALUES ?
  `;

  const values = employees.map((employee) => [
    employee.name?.trim(),
    employee.email?.trim().toLowerCase(),
    employee.phone?.trim(),
    employee.position?.trim(),
    employee.department?.trim(),
    employee.skills?.trim(),
    Number(employee.salary) || 0,
    employee.status || "active",
    new Date(),
  ]);

  db.query(sql, [values], (err, result) => {
    if (err) {
      return sendDbError(
        res,
        "Error batch inserting employees:",
        err
      );
    }

    res.status(201).json({
      success: true,
      message: `${result.affectedRows} employees created successfully`,
      insertedCount: result.affectedRows,
    });
  });
};