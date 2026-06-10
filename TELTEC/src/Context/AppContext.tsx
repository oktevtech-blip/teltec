import React, { createContext, useContext, useReducer, useEffect, ReactNode, useState } from 'react';
import axios from 'axios';

// Types
export interface Project {
  id: number;
  name: string;
  client: string;
  status: 'In Progress' | 'Pending' | 'Completed' | 'Delayed';
  deadline: string;
  progress: number;
  description?: string;
  budget?: number;
}

export interface InventoryItem {
  id: number;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  price: number;
  supplier: string;
  lastUpdated: string;
}

export interface MaintenanceTask {
  id: number;
  equipment: string;
  type: 'Preventive' | 'Corrective' | 'Emergency';
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Overdue';
  scheduledDate: string;
  assignedTo: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
}

// Updated Client interface to match backend and form
export interface Client {
  id?: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  company_type: string;
  status: 'Active' | 'Inactive';
  //registration_date: Date;
  isActive: boolean;
}

export interface Employee {
  id: number;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  hireDate: string;
  salary: number;
  skills: string;
  status: 'Active' | 'Inactive';
}

export interface Invoice {
  id: number;
  invoiceNumber: string;
  clientId: number;
  clientName: string;
  projectId?: number;
  projectName?: string;
  amount: number;
  tax: number;
  totalAmount: number;
  status: 'Draft' | 'Sent' | 'Paid' | 'Overdue' | 'Cancelled';
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  items: InvoiceItem[];
}

export interface InvoiceItem {
  id: number;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Document {
  id: number;
  name: string;
  type: 'Contract' | 'Invoice' | 'Report' | 'Certificate' | 'Other';
  category: string;
  projectId?: number;
  clientId?: number;
  uploadedBy: string;
  uploadDate: string;
  fileSize: string;
  fileUrl: string;
  tags: string[];
}

interface AppState {
  projects: Project[];
  inventory: InventoryItem[];
  maintenance: MaintenanceTask[];
  clients: Client[];
  employees: Employee[];
  invoices: Invoice[];
  documents: Document[];
  user: {
    name: string;
    role: string;
  } | null;
  loading: boolean;
  error: string | null;
}

type AppAction =
  | { type: 'SET_USER'; payload: { name: string; role: string } }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'UPDATE_PROJECT'; payload: Project }
  | { type: 'DELETE_PROJECT'; payload: number }
  | { type: 'ADD_INVENTORY_ITEM'; payload: InventoryItem }
  | { type: 'UPDATE_INVENTORY_ITEM'; payload: InventoryItem }
  | { type: 'DELETE_INVENTORY_ITEM'; payload: number }
  | { type: 'ADD_MAINTENANCE_TASK'; payload: MaintenanceTask }
  | { type: 'UPDATE_MAINTENANCE_TASK'; payload: MaintenanceTask }
  | { type: 'DELETE_MAINTENANCE_TASK'; payload: number }
  | { type: 'SET_CLIENTS'; payload: Client[] }
  | { type: 'ADD_CLIENT'; payload: Client }
  | { type: 'UPDATE_CLIENT'; payload: Client }
  | { type: 'DELETE_CLIENT'; payload: number }
  | { type: 'SET_EMPLOYEES'; payload: Employee[] }
  | { type: 'ADD_EMPLOYEE'; payload: Employee }
  | { type: 'UPDATE_EMPLOYEE'; payload: Employee }
  | { type: 'DELETE_EMPLOYEE'; payload: number }
  | { type: 'ADD_INVOICE'; payload: Invoice }
  | { type: 'UPDATE_INVOICE'; payload: Invoice }
  | { type: 'DELETE_INVOICE'; payload: number }
  | { type: 'ADD_DOCUMENT'; payload: Document }
  | { type: 'UPDATE_DOCUMENT'; payload: Document }
  | { type: 'DELETE_DOCUMENT'; payload: number }
  | { type: 'LOAD_DATA'; payload: AppState };

// Initial state with updated client structure
const initialState: AppState = {
  projects: [
    {
      id: 1,
      name: 'Hospital CCTV Installation',
      client: 'Mulago Hospital',
      status: 'In Progress',
      deadline: '2025-06-15',
      progress: 65,
      description: 'Complete CCTV system installation with 50 cameras',
      budget: 25000
    },
    {
      id: 2,
      name: 'Office Network Setup',
      client: 'MTN Uganda',
      status: 'Pending',
      deadline: '2025-07-01',
      progress: 20,
      description: 'Network infrastructure setup for new office building',
      budget: 18000
    },
    {
      id: 3,
      name: 'Security System Maintenance',
      client: 'Bank of Uganda',
      status: 'Completed',
      deadline: '2025-05-20',
      progress: 100,
      description: 'Annual maintenance of security systems',
      budget: 5000
    },
    {
      id: 4,
      name: 'Solar Panel Installation',
      client: 'Kampala City Council',
      status: 'Delayed',
      deadline: '2025-05-30',
      progress: 45,
      description: 'Solar panel installation for government buildings',
      budget: 45000
    }
  ],
  inventory: [
    {
      id: 1,
      name: 'CCTV Camera',
      category: 'Security',
      quantity: 25,
      unit: 'pieces',
      price: 350,
      supplier: 'TechSupply Ltd',
      lastUpdated: '2025-06-01'
    },
    {
      id: 2,
      name: 'Network Cable',
      category: 'Networking',
      quantity: 500,
      unit: 'meters',
      price: 2.5,
      supplier: 'NetCorp',
      lastUpdated: '2025-06-02'
    },
    {
      id: 3,
      name: 'Solar Panel',
      category: 'Energy',
      quantity: 15,
      unit: 'pieces',
      price: 450,
      supplier: 'SolarTech Uganda',
      lastUpdated: '2025-06-03'
    }
  ],
  maintenance: [
    {
      id: 1,
      equipment: 'Generator Set #1',
      type: 'Preventive',
      status: 'Scheduled',
      scheduledDate: '2025-06-10',
      assignedTo: 'John Mukasa',
      description: 'Monthly generator maintenance and oil change',
      priority: 'Medium'
    },
    {
      id: 2,
      equipment: 'HVAC System - Building A',
      type: 'Corrective',
      status: 'In Progress',
      scheduledDate: '2025-06-08',
      assignedTo: 'Sarah Namuli',
      description: 'Fix cooling system malfunction',
      priority: 'High'
    },
    {
      id: 3,
      equipment: 'Security Gate Motor',
      type: 'Emergency',
      status: 'Overdue',
      scheduledDate: '2025-06-05',
      assignedTo: 'David Okello',
      description: 'Replace burnt motor controller',
      priority: 'Critical'
    }
  ],
  clients: [], // Will be loaded from backend
  employees: [],
  invoices: [
    {
      id: 1,
      invoiceNumber: 'INV-2025-001',
      clientId: 1,
      clientName: 'Mulago Hospital',
      projectId: 1,
      projectName: 'Hospital CCTV Installation',
      amount: 20000,
      tax: 3600,
      totalAmount: 23600,
      status: 'Sent',
      issueDate: '2025-05-15',
      dueDate: '2025-06-15',
      items: [
        {
          id: 1,
          description: 'CCTV Camera Installation',
          quantity: 25,
          unitPrice: 800,
          totalPrice: 20000
        }
      ]
    }
  ],
  documents: [
    {
      id: 1,
      name: 'Mulago Hospital Contract.pdf',
      type: 'Contract',
      category: 'Legal',
      projectId: 1,
      clientId: 1,
      uploadedBy: 'Sarah Namuli',
      uploadDate: '2025-01-15',
      fileSize: '2.4 MB',
      fileUrl: '/documents/mulago-contract.pdf',
      tags: ['contract', 'cctv', 'hospital']
    }
  ],
  user: null,
  loading: false,
  error: null
};
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_EMPLOYEES':
      return { ...state, employees: action.payload };
    case 'LOGOUT':
      return { ...state, user: null };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'ADD_PROJECT':
      return { ...state, projects: [...state.projects, action.payload] };
    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map(p => p.id === action.payload.id ? action.payload : p)
      };
    case 'DELETE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter(p => p.id !== action.payload)
      };
    case 'ADD_INVENTORY_ITEM':
      return { ...state, inventory: [...state.inventory, action.payload] };
    case 'UPDATE_INVENTORY_ITEM':
      return {
        ...state,
        inventory: state.inventory.map(i => i.id === action.payload.id ? action.payload : i)
      };
    case 'DELETE_INVENTORY_ITEM':
      return {
        ...state,
        inventory: state.inventory.filter(i => i.id !== action.payload)
      };
    case 'ADD_MAINTENANCE_TASK':
      return { ...state, maintenance: [...state.maintenance, action.payload] };
    case 'UPDATE_MAINTENANCE_TASK':
      return {
        ...state,
        maintenance: state.maintenance.map(m => m.id === action.payload.id ? action.payload : m)
      };
    case 'DELETE_MAINTENANCE_TASK':
      return {
        ...state,
        maintenance: state.maintenance.filter(m => m.id !== action.payload)
      };
    case 'SET_CLIENTS':
      return { ...state, clients: action.payload };
    case 'ADD_CLIENT':
      return { ...state, clients: [...state.clients, action.payload] };
    case 'UPDATE_CLIENT':
      return {
        ...state,
        clients: state.clients.map(c => c.id === action.payload.id ? action.payload : c)
      };
    case 'DELETE_CLIENT':
      return {
        ...state,
        clients: state.clients.filter(c => c.id !== action.payload)
      };
    case 'ADD_EMPLOYEE':
      return { ...state, employees: [...state.employees, action.payload] };
    case 'UPDATE_EMPLOYEE':
      return {
        ...state,
        employees: state.employees.map(e => e.id === action.payload.id ? action.payload : e)
      };
    case 'DELETE_EMPLOYEE':
      return {
        ...state,
        employees: state.employees.filter(e => e.id !== action.payload)
      };
    case 'ADD_INVOICE':
      return { ...state, invoices: [...state.invoices, action.payload] };
    case 'UPDATE_INVOICE':
      return {
        ...state,
        invoices: state.invoices.map(i => i.id === action.payload.id ? action.payload : i)
      };
    case 'DELETE_INVOICE':
      return {
        ...state,
        invoices: state.invoices.filter(i => i.id !== action.payload)
      };
    case 'ADD_DOCUMENT':
      return { ...state, documents: [...state.documents, action.payload] };
    case 'UPDATE_DOCUMENT':
      return {
        ...state,
        documents: state.documents.map(d => d.id === action.payload.id ? action.payload : d)
      };
    case 'DELETE_DOCUMENT':
      return {
        ...state,
        documents: state.documents.filter(d => d.id !== action.payload)
      };
    case 'LOAD_DATA':
      return action.payload;
    default:
      return state;
  }
}

// API Configuration
const API_BASE_URL = 'http://localhost:8081';

// API Service Functions
export const clientAPI = {
  // Fetch all clients
  getClients: async (): Promise<Client[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/clients`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch clients');
      }
      
      return data.data || [];
    } catch (error) {
      console.error('Error fetching clients:', error);
      throw error;
    }
  },

  // Create new client
  createClient: async (clientData: Omit<Client, 'id' | 'created_at' | 'updated_at'>): Promise<Client> => {
    try {
      const response = await fetch(`${API_BASE_URL}/clients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clientData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create client');
      }
      
      return data.data;
    } catch (error) {
      console.error('Error creating client:', error);
      throw error;
    }
  },

  // Update client
  updateClient: async (id: number, clientData: Omit<Client, 'id' | 'created_at' | 'updated_at'>): Promise<Client> => {
    try {
      const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clientData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update client');
      }
      
      return data.data;
    } catch (error) {
      console.error('Error updating client:', error);
      throw error;
    }
  },

  // Delete client
  deleteClient: async (id: number): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete client');
      }
    } catch (error) {
      console.error('Error deleting client:', error);
      throw error;
    }
  },

  // Get single client
  getClient: async (id: number): Promise<Client> => {
    try {
      const response = await fetch(`${API_BASE_URL}/clients/${id}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch client');
      }
      
      return data.data;
    } catch (error) {
      console.error('Error fetching client:', error);
      throw error;
    }
  }
};

//employee API
export const employeeAPI = {
  // Fetch all employees
  getEmployees: async (): Promise<Employee[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/employees`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch employees');
      }
      
      return data.data || [];
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }
  },

  // Create new employees
  createEmployee: async (employeeData: Omit<Employee, 'id' | 'created_at' | 'updated_at'>): Promise<Employee> => {
    try {
      const response = await fetch(`${API_BASE_URL}/employees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create employee');
      }
      
      return data.data;
    } catch (error) {
      console.error('Error creating employee:', error);
      throw error;
    }
  },

  // Update employee
  updateEmployee: async (id: number, employeeData: Omit<Employee, 'id' | 'created_at' | 'updated_at'>): Promise<Employee> => {
    try {
      const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update employee');
      }
      
      return data.data;
    } catch (error) {
      console.error('Error updating employee:', error);
      throw error;
    }
  },

  // Delete employee
  deleteEmployee: async (id: number): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete employees');
      }
    } catch (error) {
      console.error('Error deleting employees:', error);
      throw error;
    }
  },

  // Get single employee
  getEmployee: async (id: number): Promise<Employee> => {
    try {
      const response = await fetch(`${API_BASE_URL}/employees/${id}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch employee');
      }
      
      return data.data;
    } catch (error) {
      console.error('Error fetching employee:', error);
      throw error;
    }
  }
};


const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  clientActions: {
    loadClients: () => Promise<void>;
    createClient: (clientData: Omit<Client, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
    updateClient: (id: number, clientData: Omit<Client, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
    deleteClient: (id: number) => Promise<void>;
  };

  EmployeeActions: {
    loadEmployees: () => Promise<void>;
    createEmployee: (employeeData: Omit<Employee, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
    updateEmployee: (id: number, employeeData: Omit<Employee, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
    deleteEmployee: (id: number) => Promise<void>;
  };
} | undefined>(undefined);


export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Client actions
  const clientActions = {
    loadClients: async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });
        
        const clients = await clientAPI.getClients();
        dispatch({ type: 'SET_CLIENTS', payload: clients });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load clients';
        dispatch({ type: 'SET_ERROR', payload: errorMessage });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },

    createClient: async (clientData: Omit<Client, 'id' | 'created_at' | 'updated_at'>) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });
        
        const newClient = await clientAPI.createClient(clientData);
        dispatch({ type: 'ADD_CLIENT', payload: newClient });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to create client';
        dispatch({ type: 'SET_ERROR', payload: errorMessage });
        throw error; // Re-throw so form can handle it
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },

    updateClient: async (id: number, clientData: Omit<Client, 'id' | 'created_at' | 'updated_at'>) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });
        
        const updatedClient = await clientAPI.updateClient(id, clientData);
        dispatch({ type: 'UPDATE_CLIENT', payload: updatedClient });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to update client';
        dispatch({ type: 'SET_ERROR', payload: errorMessage });
        throw error; // Re-throw so form can handle it
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },

    deleteClient: async (id: number) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });
        
        await clientAPI.deleteClient(id);
        dispatch({ type: 'DELETE_CLIENT', payload: id });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to delete client';
        dispatch({ type: 'SET_ERROR', payload: errorMessage });
        throw error;
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    }
  };

  //Employee actions
  const employeeActions = {
    loadEmployees: async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });
        
        const employees = await employeeAPI.getEmployees();
        dispatch({ type: 'SET_EMPLOYEES', payload: employees });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load employees';
        dispatch({ type: 'SET_ERROR', payload: errorMessage });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },

    createEmployee: async (employeeData: Omit<Employee, 'id' | 'created_at' | 'updated_at'>) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });
        
        const newEmployee = await employeeAPI.createEmployee(employeeData);
        dispatch({ type: 'ADD_EMPLOYEE', payload: newEmployee });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to create employee';
        dispatch({ type: 'SET_ERROR', payload: errorMessage });
        throw error; // Re-throw so form can handle it
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },

    updateEmployee: async (id: number, employeeData: Omit<Employee, 'id' | 'created_at' | 'updated_at'>) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });
        
        const updatedEmployee = await employeeAPI.updateEmployee(id, employeeData);
        dispatch({ type: 'UPDATE_EMPLOYEE', payload: updatedEmployee });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to update client';
        dispatch({ type: 'SET_ERROR', payload: errorMessage });
        throw error; // Re-throw so form can handle it
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },

    deleteEmployee: async (id: number) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });
        
        await employeeAPI.deleteEmployee(id);
        dispatch({ type: 'DELETE_EMPLOYEE', payload: id });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to delete client';
        dispatch({ type: 'SET_ERROR', payload: errorMessage });
        throw error;
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    }
  };
  

  // Load clients on mount
  useEffect(() => {
    clientActions.loadClients();
  }, []);

  // Load data from localStorage on mount (for other data)
  useEffect(() => {
    const savedData = localStorage.getItem('dashboardData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        // Don't overwrite clients loaded from API
        const { clients, ...otherData } = parsedData;
        dispatch({ type: 'LOAD_DATA', payload: { ...state, ...otherData } });
      } catch (error) {
        console.error('Failed to load saved data:', error);
      }
    }
  }, []);

    // Load employees on mount
  useEffect(() => {
    employeeActions.loadEmployees();
  }, []);

  // Load data from localStorage on mount (for other data)
  // useEffect(() => {
  //   const savedData = localStorage.getItem('dashboardData');
  //   if (savedData) {
  //     try {
  //       const parsedData = JSON.parse(savedData);
  //       // Don't overwrite clients loaded from API
  //       const { clients, ...otherData } = parsedData;
  //       dispatch({ type: 'LOAD_DATA', payload: { ...state, ...otherData } });
  //     } catch (error) {
  //       console.error('Failed to load saved data:', error);
  //     }
  //   }
  // }, []);


  // Save data to localStorage when state changes (excluding clients)
  useEffect(() => {
    const { clients, loading, error, ...dataToSave } = state;
    localStorage.setItem('dashboardData', JSON.stringify(dataToSave));
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch, clientActions, EmployeeActions: employeeActions }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}

/* Removed duplicate local Employee interface to resolve declaration conflict */

const Employees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('/api/employees');
        setEmployees(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching employees:', error);
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Employees</h1>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="px-6 py-3 border-b">Name</th>
            <th className="px-6 py-3 border-b">Email</th>
            <th className="px-6 py-3 border-b">Position</th>
            <th className="px-6 py-3 border-b">Department</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td className="px-6 py-4 border-b">
                {employee.name} {employee.name}
              </td>
              <td className="px-6 py-4 border-b">{employee.email}</td>
              <td className="px-6 py-4 border-b">{employee.position}</td>
              <td className="px-6 py-4 border-b">{employee.department}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Employees;