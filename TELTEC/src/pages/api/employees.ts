import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from 'C:/Users/DELL/Desktop/Teltec Complete/TELTEC/src/config/databse.ts';
import { logger } from '../../utils/logger';
import type { ResultSetHeader } from 'mysql2';

interface EmployeeData {
  name: string;
  email: string;
  phone: string;
  department: string;
  skills: string;
  status: 'Active' | 'Inactive';
  position:string;
  salary:string;
}

interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  switch (req.method) {
    case 'POST':
      return handleCreateEmployee(req, res);
    case 'PUT':
      return handleUpdateEmployee(req, res);
    case 'GET':
      return handleGetEmployees(req, res);
    default:
      res.setHeader('Allow', ['POST', 'PUT', 'GET']);
      return res.status(405).json({ 
        success: false, 
        error: `Method ${req.method} Not Allowed` 
      });
  }
}

async function handleCreateEmployee(
  req: NextApiRequest, 
  res: NextApiResponse<ApiResponse>
) {
  try {
    const employee = req.body as EmployeeData;
    
    const [result]: any = await db.execute(
      `INSERT INTO employees (
        name, email, phone, position, 
        department, status, skills, salary
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        employee.name,
        employee.email,
        employee.phone,
        employee.position,
        employee.department,
        employee.status,
        employee.salary,
        employee.skills,
        //client.registration_date || new Date()
      ]
    );

    logger.info(`Created new employee: ${employee.name}`);
    
    return res.status(201).json({
      success: true,
      data: { id: result.insertId, ...employee }
    });

  } catch (error) {
    logger.error('Failed to create employee', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to create employee'
    });
  }
}

async function handleUpdateEmployee(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  try {
    const { id } = req.query;
    const updates = req.body as Partial<EmployeeData>;

    

    const [result] = await db.execute<ResultSetHeader>(
      `UPDATE employees 
       SET name = ?, email = ?, phone = ?, position = ?, department = ?, status = ?, skills = ?, salary = ?
       WHERE id = ?`,
      [
        updates.name,
        updates.email,
        updates.phone,
        updates.position,
        updates.department,
        updates.status,
        updates.skills,
        updates.salary,
        id
      ]
    );

    if ((result as ResultSetHeader).affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Employee not found'
      });
    }

    logger.info(`Updated employee ID: ${id}`);
    
    return res.status(200).json({
      success: true,
      data: { id, ...updates }
    });

  } catch (error) {
    logger.error('Failed to update employee', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update employee'
    });
  }
}

async function handleGetEmployees(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  try {
    const [rows] = await db.execute('SELECT * FROM employees');
    
    return res.status(200).json({
      success: true,
      data: rows
    });

  } catch (error) {
    logger.error('Failed to fetch employees', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch employees'
    });
  }
}