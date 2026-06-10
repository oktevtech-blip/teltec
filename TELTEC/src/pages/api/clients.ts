import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../config/databse';
import { logger } from '../../utils/logger';
import type { ResultSetHeader } from 'mysql2';

interface ClientData {
  name: string;
  email: string;
  phone: string;
  address: string;
  company_type: string;
  status: 'Active' | 'Inactive';
  //registration_date?: Date;
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
      return handleCreateClient(req, res);
    case 'PUT':
      return handleUpdateClient(req, res);
    case 'GET':
      return handleGetClients(req, res);
    default:
      res.setHeader('Allow', ['POST', 'PUT', 'GET']);
      return res.status(405).json({ 
        success: false, 
        error: `Method ${req.method} Not Allowed` 
      });
  }
}

async function handleCreateClient(
  req: NextApiRequest, 
  res: NextApiResponse<ApiResponse>
) {
  try {
    const client = req.body as ClientData;
    
    const [result]: any = await db.execute(
      `INSERT INTO clients (
        name, email, phone, address, 
        company_type, status, registration_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        client.name,
        client.email,
        client.phone,
        client.address,
        client.company_type,
        client.status,
        //client.registration_date || new Date()
      ]
    );

    logger.info(`Created new client: ${client.name}`);
    
    return res.status(201).json({
      success: true,
      data: { id: result.insertId, ...client }
    });

  } catch (error) {
    logger.error('Failed to create client', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to create client'
    });
  }
}

async function handleUpdateClient(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  try {
    const { id } = req.query;
    const updates = req.body as Partial<ClientData>;

    

    const [result] = await db.execute<ResultSetHeader>(
      `UPDATE clients 
       SET name = ?, email = ?, phone = ?, address = ?, company_type = ?, status = ?, registration_date = ?
       WHERE id = ?`,
      [
        updates.name,
        updates.email,
        updates.phone,
        updates.address,
        updates.company_type,
        updates.status,
        //updates.registration_date,
        id
      ]
    );

    if ((result as ResultSetHeader).affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Client not found'
      });
    }

    logger.info(`Updated client ID: ${id}`);
    
    return res.status(200).json({
      success: true,
      data: { id, ...updates }
    });

  } catch (error) {
    logger.error('Failed to update client', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update client'
    });
  }
}

async function handleGetClients(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  try {
    const [rows] = await db.execute('SELECT * FROM clients');
    
    return res.status(200).json({
      success: true,
      data: rows
    });

  } catch (error) {
    logger.error('Failed to fetch clients', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch clients'
    });
  }
}