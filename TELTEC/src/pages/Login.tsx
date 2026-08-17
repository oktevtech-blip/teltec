import React, { useState } from 'react';

// User interface type
interface User {
  username: string;
  password: string;
  role: 'admin' | 'inventory' | 'project' | 'deployment';
  name: string;
}

// Props interfaces
interface LoginFormProps {
  onLogin: (user: User) => void;
}

interface LoginProps {
  onLogin: (user: User) => void;
}

// Default users with different roles
const defaultUsers: User[] = [
  { username: 'admin', password: 'admin123', role: 'admin', name: 'System Administrator' },
  { username: 'inventory', password: 'inv123', role: 'inventory', name: 'Inventory Manager' },
  { username: 'project', password: 'proj123', role: 'project', name: 'Project Manager' },
  { username: 'deploy', password: 'deploy123', role: 'deployment', name: 'Deployment Officer' }
];

// Updated LoginForm component
const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [showCredentials, setShowCredentials] = useState<boolean>(false);

  const handleSubmit = async () => {
  setError("");

  try {
    const response = await fetch("https://teltec.onrender.com/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (!data.success) {
      setError(data.message || "Login failed");
      return;
    }

    onLogin(data.user);  // pass user object upward

  } catch (error) {
    console.error("Login request failed:", error);
    setError("Unable to reach server");
  }
};


  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <div className="space-y-6">
        <div>
          <div className="block text-sm font-medium text-gray-700 mb-2">
            Username
          </div>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter username"
          />
        </div>
        
        <div>
          <div className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter password"
          />
        </div>
        
        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}
        
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Sign In
        </button>
      </div>
      
      <div className="mt-6">
        <button
          onClick={() => setShowCredentials(!showCredentials)}
          className="text-blue-600 hover:text-blue-800 text-sm underline"
        >
          {showCredentials ? 'Hide' : 'Show'} Default Credentials
        </button>
        
        {showCredentials && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <h4 className="font-semibold text-gray-800 mb-2">Default Login Credentials:</h4>
            <div className="space-y-2 text-sm">
              {defaultUsers.map((user, index) => (
                <div key={index} className="flex justify-between">
                  <span className="font-medium">{user.name}:</span>
                  <span className="text-gray-600">{user.username} / {user.password}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Updated Login component
export function Login({ onLogin }: LoginProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-800">
            Teltec Investments Ltd
          </h1>
          <p className="text-gray-600 mt-2">Management System</p>
        </div>
        <LoginForm onLogin={onLogin} />
      </div>
    </div>
  );
}
