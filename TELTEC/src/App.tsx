"use client"

import { useState } from "react"
import { Login } from "./pages/Login"
import { Dashboard } from "./pages/Dashboard"
import { AppProvider } from "./Context/AppContext"
import InventoryManagement from './interfaces/inventory_manager.tsx';
import ProjectManager from './interfaces/ProjectManager.tsx';
import DeploymentOfficerInterface from './interfaces/DeploymentOfficer.tsx';
import {BrowserRouter} from "react-router-dom";

// User interface type (should match the one in Login.tsx)
interface User {
  username: string;
  password: string;
  role: 'admin' | 'inventory' | 'project' | 'deployment';
  name: string;
}

export function App() {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const renderInterface = () => {
    if (!user) return null;

    switch (user.role) {
      case 'admin':
        // Admin sees the admin interface
        return (
          <div className="space-y-6">
            <Dashboard />
            
          </div>
        );
      case 'inventory':
        // Inventory manager sees only inventory interface
        return <InventoryManagement />;
      case 'project':
        // Project manager sees only project interface
        return <ProjectManager />;
      case 'deployment':
        // Deployment officer sees only deployment interface
        return <DeploymentOfficerInterface />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AppProvider>
      <BrowserRouter>
        <div className="w-full min-h-screen bg-gray-100">
          {user ? (
            <div className="container mx-auto px-0 py-0.5">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    Welcome, {user.name}
                  </h1>
                  <p className="text-gray-600">Role: {user.role}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Logout
                </button>
              </div>
              {renderInterface()}
            </div>
          ) : (
            <Login onLogin={handleLogin} />
          )}
          {/* <Routes>
            <Route path="/projects" element={<Projects />} />
            <Route path="/maintenance" element={<Maintenance />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/clients" element={<Clients />} />
          </Routes> */}
        </div>
      </BrowserRouter>
    </AppProvider>
  )
}

export default App;

