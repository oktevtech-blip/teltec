import React, { useState } from 'react';
import { Plus, Users, MessageCircle, FileText, CheckCircle, Send, Eye, X, Paperclip } from 'lucide-react';
import MessageBus from '../bus/messagebus.tsx';

const ProjectManagerDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [clients, setClients] = useState([
    { id: 1, name: 'Tech Solutions Ltd', email: 'contact@techsolutions.com', phone: '+256-700-123456', status: 'Active' },
    { id: 2, name: 'Green Energy Co', email: 'info@greenenergy.com', phone: '+256-701-234567', status: 'Active' }
  ]);
  
  const [projects, setProjects] = useState([
    { 
      id: 1, 
      name: 'Solar Installation - Hospital', 
      client: 'Tech Solutions Ltd', 
      status: 'BOQ Approved',
      boqStatus: 'approved',
      progress: 45,
      createdDate: '2025-06-20',
      description: ''
    },
    { 
      id: 2, 
      name: 'Network Infrastructure Setup', 
      client: 'Green Energy Co', 
      status: 'BOQ Pending MD Approval',
      boqStatus: 'pending_md',
      progress: 15,
      createdDate: '2025-06-22',
      description: ''
    }
  ]);

  type Communication = {
    id: number;
    recipient: string;
    message: string;
    files: { name: string; size: number; type: string }[];
    timestamp: string;
    sender: string;
    status: string;
  };
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [newClient, setNewClient] = useState({ name: '', email: '', phone: '', company: '' });
  const [newProject, setNewProject] = useState({ name: '', clientId: '', description: '' });
  type Project = {
    id: number;
    name: string;
    client: string;
    status: string;
    boqStatus: string;
    progress: number;
    createdDate: string;
    description: string;
  };
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  type BOQItem = {
    id: number;
    item: string;
    quantity: string;
    unit: string;
    rate: string;
    total: string;
  };
  const [boqItems, setBOQItems] = useState<BOQItem[]>([]);
  const [newBOQItem, setNewBOQItem] = useState({ item: '', quantity: '', unit: '', rate: '' });
  const [chatWindow, setChatWindow] = useState({ isOpen: false, recipient: '', recipientRole: '' });
  const [chatMessage, setChatMessage] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

  const addClient = () => {
    if (newClient.name && newClient.email) {
      setClients([...clients, { 
        id: Date.now(), 
        ...newClient, 
        status: 'Active' 
      }]);
      setNewClient({ name: '', email: '', phone: '', company: '' });
    }
  };

  const createProject = () => {
    if (newProject.name && newProject.clientId) {
      const client = clients.find(c => c.id === parseInt(newProject.clientId));
      setProjects([...projects, {
        id: Date.now(),
        name: newProject.name,
        client: client ? client.name : 'Unknown Client',
        status: 'Planning',
        boqStatus: 'draft',
        progress: 0,
        createdDate: new Date().toISOString().split('T')[0],
        description: newProject.description
      }]);
      setNewProject({ name: '', clientId: '', description: '' });
    }
  };

  const addBOQItem = () => {
    if (newBOQItem.item && newBOQItem.quantity && newBOQItem.rate) {
      const total = parseFloat(newBOQItem.quantity) * parseFloat(newBOQItem.rate);
      setBOQItems([...boqItems, {
        id: Date.now(),
        ...newBOQItem,
        total: total.toFixed(2)
      }]);
      setNewBOQItem({ item: '', quantity: '', unit: '', rate: '' });
    }
  };

  // const sendMessage = (
  //   recipient: string,
  //   message: string,
  //   files: File[] = []
  // ) => {
  //   const newMessage = {
  //     id: Date.now(),
  //     recipient,
  //     message,
  //     files: files.map(file => ({ name: file.name, size: file.size, type: file.type })),
  //     timestamp: new Date().toLocaleString(),
  //     sender: 'Project Manager',
  //     status: 'sent'
  //   };
  //   setCommunications([...communications, newMessage]);
    
  //   // Close chat window and reset form
  //   setChatWindow({ isOpen: false, recipient: '', recipientRole: '' });
  //   setChatMessage('');
  //   setAttachedFiles([]);
  // };
  const sendMessage = (
    recipient: string,
    message: string,
    files: File[] = []
  ) => {
    const newMessage = {
      id: Date.now(),
      recipient,
      recipientRole: chatWindow.recipientRole,
       // Add recipientRole here
      message,
      files: files.map(file => ({ name: file.name, size: file.size, type: file.type })),
      timestamp: new Date().toLocaleString(),
      sender: 'Project Manager',
      status: 'sent'
    };
    setCommunications([...communications, newMessage]);

     // Send via message bus
    MessageBus.send(newMessage);
  
    
    // Dispatch custom event for NotificationSystem
    const messageEvent = new CustomEvent('projectManagerMessage', {
      detail: {
        sender: 'Project Manager',
        recipient,
        message,
        timestamp: Date.now(),
        files: files.map(file => ({ name: file.name, size: file.size, type: file.type }))
      }
    });
    window.dispatchEvent(messageEvent);
    
    // Close chat window and reset form
    setChatWindow({ isOpen: false, recipient: '', recipientRole: '' });
    setChatMessage('');
    setAttachedFiles([]);
  };

  const openChatWindow = (recipient: string, role: string) => {
    setChatWindow({ isOpen: true, recipient, recipientRole: role });
  };

  const closeChatWindow = () => {
    setChatWindow({ isOpen: false, recipient: '', recipientRole: '' });
    setChatMessage('');
    setAttachedFiles([]);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachedFiles([...attachedFiles, ...files]);
  };

  const removeFile = (index: number) => {
    setAttachedFiles(attachedFiles.filter((_, i) => i !== index));
  };

  const sendChatMessage = () => {
    if (chatMessage.trim() || attachedFiles.length > 0) {
      sendMessage(chatWindow.recipient, chatMessage || 'Document(s) attached', attachedFiles);
    }
  };

  const updateBOQStatus = (projectId: number, newStatus: string) => {
    setProjects(projects.map(p => p.id === projectId ? {...p, boqStatus: newStatus} : p));
  };

  const getTotalBOQ = () => {
    return boqItems.reduce((sum, item) => sum + parseFloat(item.total || '0'), 0).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 shadow-lg">
        <h1 className="text-2xl font-bold">Project Manager Dashboard</h1>
        <p className="text-blue-100">Manage clients, projects, and team communications</p>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex space-x-8 px-6">
          {['dashboard', 'clients', 'projects', 'communications', 'boq'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-2 border-b-2 font-medium text-sm capitalize ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'boq' ? 'BOQ Management' : tab}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {/* Dashboard Overview */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Clients</p>
                    <p className="text-2xl font-bold text-gray-900">{clients.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <FileText className="h-8 w-8 text-green-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Projects</p>
                    <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <CheckCircle className="h-8 w-8 text-purple-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">BOQs Approved</p>
                    <p className="text-2xl font-bold text-gray-900">{projects.filter(p => p.boqStatus === 'approved').length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <MessageCircle className="h-8 w-8 text-orange-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Messages Sent</p>
                    <p className="text-2xl font-bold text-gray-900">{communications.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Projects */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Recent Projects</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{project.name}</h4>
                        <p className="text-sm text-gray-600">{project.client}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{project.status}</p>
                          <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                            <div className="bg-blue-600 h-2 rounded-full" style={{width: `${project.progress}%`}}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Clients Tab */}
        {activeTab === 'clients' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Register New Client</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Client Name"
                    value={newClient.name}
                    onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                    className="border border-gray-300 rounded-md px-3 py-2"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={newClient.email}
                    onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                    className="border border-gray-300 rounded-md px-3 py-2"
                  />
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={newClient.phone}
                    onChange={(e) => setNewClient({...newClient, phone: e.target.value})}
                    className="border border-gray-300 rounded-md px-3 py-2"
                  />
                  <input
                    type="text"
                    placeholder="Company"
                    value={newClient.company}
                    onChange={(e) => setNewClient({...newClient, company: e.target.value})}
                    className="border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <button
                  onClick={addClient}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Client
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Client List</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {clients.map((client) => (
                      <tr key={client.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{client.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.phone}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            {client.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Create New Project</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Project Name"
                    value={newProject.name}
                    onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                    className="border border-gray-300 rounded-md px-3 py-2"
                  />
                  <select
                    value={newProject.clientId}
                    onChange={(e) => setNewProject({...newProject, clientId: e.target.value})}
                    className="border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="">Select Client</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>{client.name}</option>
                    ))}
                  </select>
                </div>
                <textarea
                  placeholder="Project Description"
                  value={newProject.description}
                  onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                  className="mt-4 w-full border border-gray-300 rounded-md px-3 py-2"
                  rows={3}
                />
                <button
                  onClick={createProject}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Project
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Project List & Progress Monitor</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-medium text-gray-900">{project.name}</h4>
                          <p className="text-sm text-gray-600">Client: {project.client}</p>
                          <p className="text-sm text-gray-500">Created: {project.createdDate}</p>
                        </div>
                        <div className="text-right">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            project.boqStatus === 'approved' ? 'bg-green-100 text-green-800' :
                            project.boqStatus === 'pending_md' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            BOQ: {project.boqStatus.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{width: `${project.progress}%`}}></div>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedProject(project)}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                        >
                          <Eye className="h-4 w-4 inline mr-1" />
                          View Details
                        </button>
                        {project.boqStatus === 'draft' && (
                          <button
                            onClick={() => updateBOQStatus(project.id, 'pending_md')}
                            className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700"
                          >
                            Submit BOQ to MD
                          </button>
                        )}
                        {project.boqStatus === 'pending_md' && (
                          <button
                            onClick={() => updateBOQStatus(project.id, 'approved')}
                            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                          >
                            MD Approved
                          </button>
                        )}
                        {project.boqStatus === 'approved' && (
                          <button
                            onClick={() => updateBOQStatus(project.id, 'sent_to_inventory')}
                            className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700"
                          >
                            Send to Inventory
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Communications Tab */}
        {activeTab === 'communications' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Team Communication</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 gap-3">
                      <button
                        onClick={() => openChatWindow('Deployment Officer', 'deployment')}
                        className="bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 flex items-center justify-between transition-colors"
                      >
                        <div className="flex items-center">
                          <MessageCircle className="h-5 w-5 mr-2" />
                          <span>Message Deployment Officer</span>
                        </div>
                        <div className="text-blue-200 text-sm">
                          Project deployment & scheduling
                        </div>
                      </button>
                      
                      <button
                        onClick={() => openChatWindow('Technician', 'technical')}
                        className="bg-green-600 text-white px-4 py-3 rounded-md hover:bg-green-700 flex items-center justify-between transition-colors"
                      >
                        <div className="flex items-center">
                          <MessageCircle className="h-5 w-5 mr-2" />
                          <span>Message Technician</span>
                        </div>
                        <div className="text-green-200 text-sm">
                          Technical specifications & support
                        </div>
                      </button>
                      
                      <button
                        onClick={() => openChatWindow('Managing Director', 'management')}
                        className="bg-purple-600 text-white px-4 py-3 rounded-md hover:bg-purple-700 flex items-center justify-between transition-colors"
                      >
                        <div className="flex items-center">
                          <MessageCircle className="h-5 w-5 mr-2" />
                          <span>Message Managing Director</span>
                        </div>
                        <div className="text-purple-200 text-sm">
                          Approvals & strategic decisions
                        </div>
                      </button>
                      
                      <button
                        onClick={() => openChatWindow('Inventory Manager', 'inventory')}
                        className="bg-orange-600 text-white px-4 py-3 rounded-md hover:bg-orange-700 flex items-center justify-between transition-colors"
                      >
                        <div className="flex items-center">
                          <MessageCircle className="h-5 w-5 mr-2" />
                          <span>Message Inventory Manager</span>
                        </div>
                        <div className="text-orange-200 text-sm">
                          Material procurement & stock
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Recent Communications</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {communications.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No messages sent yet</p>
                    ) : (
                      communications.map((comm) => (
                        <div key={comm.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <div className="flex items-center mb-1">
                                <span className="font-medium text-gray-900">To: {comm.recipient}</span>
                                <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                  {comm.status}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{comm.message}</p>
                              {comm.files && comm.files.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                  {comm.files.map((file, index) => (
                                    <div key={index} className="flex items-center bg-blue-50 px-2 py-1 rounded text-xs text-blue-700">
                                      <Paperclip className="h-3 w-3 mr-1" />
                                      {file.name}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                            <span className="text-xs text-gray-400 ml-4">{comm.timestamp}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        BOQ Management Tab
        {activeTab === 'boq' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Create Bill of Quantities (BOQ)</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Item Description"
                    value={newBOQItem.item}
                    onChange={(e) => setNewBOQItem({...newBOQItem, item: e.target.value})}
                    className="border border-gray-300 rounded-md px-3 py-2"
                  />
                  <input
                    type="number"
                    placeholder="Quantity"
                    value={newBOQItem.quantity}
                    onChange={(e) => setNewBOQItem({...newBOQItem, quantity: e.target.value})}
                    className="border border-gray-300 rounded-md px-3 py-2"
                  />
                  <input
                    type="text"
                    placeholder="Unit (e.g., pcs, m, kg)"
                    value={newBOQItem.unit}
                    onChange={(e) => setNewBOQItem({...newBOQItem, unit: e.target.value})}
                    className="border border-gray-300 rounded-md px-3 py-2"
                  />
                  <input
                    type="number"
                    placeholder="Rate (UGX)"
                    value={newBOQItem.rate}
                    onChange={(e) => setNewBOQItem({...newBOQItem, rate: e.target.value})}
                    className="border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <button
                  onClick={addBOQItem}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">BOQ Items</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rate (UGX)</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total (UGX)</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {boqItems.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 text-sm text-gray-900">{item.item}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{item.quantity}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{item.unit}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{parseFloat(item.rate).toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{parseFloat(item.total).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-sm font-medium text-gray-900 text-right">Total:</td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">UGX {parseFloat(getTotalBOQ()).toLocaleString()}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              
              {boqItems.length > 0 && (
                <div className="px-6 py-4 border-t border-gray-200 flex space-x-4">
                  <button
                    onClick={() => sendMessage('Managing Director', `BOQ completed with total value of UGX ${parseFloat(getTotalBOQ()).toLocaleString()}. Please review and approve.`)}
                    className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 flex items-center"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send to MD for Approval
                  </button>
                  <button
                    onClick={() => sendMessage('Inventory Manager', `Approved BOQ with total value of UGX ${parseFloat(getTotalBOQ()).toLocaleString()} forwarded for material preparation.`)}
                    className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 flex items-center"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Forward to Inventory Manager
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Chat Window Modal */}
      {chatWindow.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Message {chatWindow.recipient}</h3>
                <p className="text-sm text-gray-600">
                  {chatWindow.recipientRole === 'deployment' && 'Project deployment & scheduling'}
                  {chatWindow.recipientRole === 'technical' && 'Technical specifications & support'}
                  {chatWindow.recipientRole === 'management' && 'Approvals & strategic decisions'}
                  {chatWindow.recipientRole === 'inventory' && 'Material procurement & stock'}
                </p>
              </div>
              <button
                onClick={closeChatWindow}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              {/* Message Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder={`Type your message to ${chatWindow.recipient}...`}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Attach Documents</label>
                <div className="border-2 border-dashed border-gray-300 rounded-md p-4">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.jpeg,.png"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center justify-center"
                  >
                    <Paperclip className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">Click to attach files</span>
                    <span className="text-xs text-gray-400 mt-1">PDF, DOC, XLS, Images</span>
                  </label>
                </div>
              </div>

              {/* Attached Files Display */}
              {attachedFiles.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Attached Files</label>
                  <div className="space-y-2">
                    {attachedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md">
                        <div className="flex items-center">
                          <Paperclip className="h-4 w-4 text-gray-400 mr-2" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{file.name}</p>
                            <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Message Templates */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quick Templates</label>
                <div className="grid grid-cols-1 gap-2">
                  {chatWindow.recipientRole === 'deployment' && (
                    <>
                      <button
                        onClick={() => setChatMessage('Project deployment requirements are ready for review. Please coordinate the schedule.')}
                        className="text-left text-xs bg-blue-50 text-blue-700 px-3 py-2 rounded hover:bg-blue-100"
                      >
                        Project deployment ready
                      </button>
                      <button
                        onClick={() => setChatMessage('Site assessment needed for upcoming project. Please arrange visit.')}
                        className="text-left text-xs bg-blue-50 text-blue-700 px-3 py-2 rounded hover:bg-blue-100"
                      >
                        Site assessment request
                      </button>
                    </>
                  )}
                  
                  {chatWindow.recipientRole === 'technical' && (
                    <>
                      <button
                        onClick={() => setChatMessage('Technical specifications attached for upcoming project. Please review and provide feedback.')}
                        className="text-left text-xs bg-green-50 text-green-700 px-3 py-2 rounded hover:bg-green-100"
                      >
                        Technical specs review
                      </button>
                      <button
                        onClick={() => setChatMessage('Need technical support for project implementation. Please advise on best approach.')}
                        className="text-left text-xs bg-green-50 text-green-700 px-3 py-2 rounded hover:bg-green-100"
                      >
                        Technical support needed
                      </button>
                    </>
                  )}
                  
                  {chatWindow.recipientRole === 'management' && (
                    <>
                      <button
                        onClick={() => setChatMessage(`BOQ completed with total value of UGX ${getTotalBOQ() ? parseFloat(getTotalBOQ()).toLocaleString() : '0'}. Please review and approve.`)}
                        className="text-left text-xs bg-purple-50 text-purple-700 px-3 py-2 rounded hover:bg-purple-100"
                      >
                        BOQ approval request
                      </button>
                      <button
                        onClick={() => setChatMessage('Project proposal ready for review. Seeking approval to proceed with next phase.')}
                        className="text-left text-xs bg-purple-50 text-purple-700 px-3 py-2 rounded hover:bg-purple-100"
                      >
                        Project approval request
                      </button>
                    </>
                  )}
                  
                  {chatWindow.recipientRole === 'inventory' && (
                    <>
                      <button
                        onClick={() => setChatMessage(`Approved BOQ forwarded for material preparation. Total value: UGX ${getTotalBOQ() ? parseFloat(getTotalBOQ()).toLocaleString() : '0'}.`)}
                        className="text-left text-xs bg-orange-50 text-orange-700 px-3 py-2 rounded hover:bg-orange-100"
                      >
                        BOQ materials request
                      </button>
                      <button
                        onClick={() => setChatMessage('Please provide current stock status for upcoming project materials.')}
                        className="text-left text-xs bg-orange-50 text-orange-700 px-3 py-2 rounded hover:bg-orange-100"
                      >
                        Stock status inquiry
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 p-4 border-t border-gray-200">
              <button
                onClick={closeChatWindow}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={sendChatMessage}
                disabled={!chatMessage.trim() && attachedFiles.length === 0}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectManagerDashboard;

// import React, { useEffect, useState } from "react";
// import {
//   Plus,
//   Users,
//   MessageCircle,
//   FileText,
//   CheckCircle,
//   Send,
//   Eye,
//   X,
//   Paperclip,
// } from "lucide-react";
// import MessageBus from "../bus/messagebus.tsx";

// /**
//  * API base - adjust if needed
//  */
// const API_BASE = (process.env.REACT_APP_API_URL ?? "").replace(/\/$/, "");

// //
// // ---------------------------
// // Types & Interfaces (fixed)
// // ---------------------------
// //

// export interface Message {
//   id: number;
//   recipient: string;
//   recipientRole: string;
//   message: string;
//   files: { name: string; size: number; type: string }[];
//   timestamp: string;
//   sender: string;
//   status: string;
// }

// export interface Communication extends Message {}

// export interface Client {
//   id: number;
//   name: string;
//   contact_person?: string | null;
//   email?: string | null;
//   phone?: string | null;
//   address?: string | null;
//   status?: string | null;
//   company?: string | null;
// }

// export interface Project {
//   id: number;
//   name: string;
//   client_id?: number | null;
//   client?: string;
//   status?: string;
//   boqStatus?: string;
//   progress: number;
//   createdDate?: string;
//   description?: string;
//   deadline?: string | null;
//   budget?: number | null;
// }

// type BOQItem = {
//   id: number;
//   item: string;
//   quantity: string;
//   unit: string;
//   rate: string;
//   total: string;
// };

// const ProjectManagerDashboard: React.FC = () => {
//   // tabs
//   const [activeTab, setActiveTab] = useState<
//     "dashboard" | "clients" | "projects" | "communications" | "boq"
//   >("dashboard");

//   // CLIENTS
//   const [clients, setClients] = useState<Client[]>([
//     {
//       id: 1,
//       name: "Tech Solutions Ltd",
//       email: "contact@techsolutions.com",
//       phone: "+256-700-123456",
//       status: "Active",
//     },
//     {
//       id: 2,
//       name: "Green Energy Co",
//       email: "info@greenenergy.com",
//       phone: "+256-701-234567",
//       status: "Active",
//     },
//   ]);

//   // PROJECTS
//   const [projects, setProjects] = useState<Project[]>([
//     {
//       id: 1,
//       name: "Solar Installation - Hospital",
//       client: "Tech Solutions Ltd",
//       status: "BOQ Approved",
//       boqStatus: "approved",
//       progress: 45,
//       createdDate: "2025-06-20",
//       description: "",
//     },
//     {
//       id: 2,
//       name: "Network Infrastructure Setup",
//       client: "Green Energy Co",
//       status: "BOQ Pending MD Approval",
//       boqStatus: "pending_md",
//       progress: 15,
//       createdDate: "2025-06-22",
//       description: "",
//     },
//   ]);

//   // COMMUNICATIONS
//   const [communications, setCommunications] = useState<Communication[]>([]);

//   // FORMS
//   const [newClient, setNewClient] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     company: "",
//   });

//   const [newProject, setNewProject] = useState({
//     name: "",
//     clientId: "",
//     description: "",
//   });

//   // BOQ
//   const [boqItems, setBOQItems] = useState<BOQItem[]>([]);
//   const [newBOQItem, setNewBOQItem] = useState({
//     item: "",
//     quantity: "",
//     unit: "",
//     rate: "",
//   });

//   // CHAT WINDOW
//   const [chatWindow, setChatWindow] = useState({
//     isOpen: false,
//     recipient: "",
//     recipientRole: "",
//   });
//   const [chatMessage, setChatMessage] = useState("");
//   const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

//   //
//   // FETCH INITIAL DATA
//   //
//   useEffect(() => {
//     async function fetchClients() {
//       try {
//         const res = await fetch(`${API_BASE}/clients`);
//         if (!res.ok) throw new Error("Failed fetching clients");
//         const data = await res.json();
//         const arr = Array.isArray(data) ? data : data?.data ?? [];
//         if (Array.isArray(arr) && arr.length) setClients(arr);
//       } catch (err) {
//         console.warn("Could not fetch clients:", err);
//       }
//     }

//     async function fetchProjects() {
//       try {
//         const res = await fetch(`${API_BASE}/projects`);
//         if (!res.ok) throw new Error("Failed fetching projects");

//         const data = await res.json();
//         const arr = Array.isArray(data) ? data : data?.data ?? [];

//         if (Array.isArray(arr) && arr.length) {
//           const mapped = arr.map((p: any) => ({
//             id: p.id,
//             name: p.name,
//             client_id: p.client_id ?? p.clientId ?? null,
//             client:
//               p.client_name ??
//               p.client ??
//               (p.client_id
//                 ? clients.find((c) => c.id === p.client_id)?.name
//                 : "") ??
//               "",
//             status: p.status ?? "Planning",
//             boqStatus: p.boq_status ?? p.boqStatus ?? "draft",
//             progress: Number(p.progress ?? 0),
//             createdDate: p.created_at ?? p.createdDate ?? "",
//             description: p.description ?? "",
//             deadline: p.deadline ?? null,
//             budget: p.budget ?? null,
//           })) as Project[];

//           setProjects(mapped);
//         }
//       } catch (err) {
//         console.warn("Could not fetch projects:", err);
//       }
//     }

//     fetchClients().then(fetchProjects);
//   }, []);

//   //
//   // ADD CLIENT
//   //
//   const addClient = async () => {
//     if (!newClient.name.trim() || !newClient.email.trim()) {
//       alert("Provide client name and email.");
//       return;
//     }

//     const payload = {
//       name: newClient.name.trim(),
//       contact_person: newClient.company.trim() || null,
//       email: newClient.email.trim().toLowerCase(),
//       phone: newClient.phone.trim(),
//       address: "",
//       company_type: newClient.company.trim() || "General",
//       status: "active",
//     };

//     try {
//       const res = await fetch(`${API_BASE}/clients`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) throw new Error("Failed creating client");

//       const result = await res.json();
//       const created = result?.data ?? {
//         id: result?.insertId ?? Date.now(),
//         ...payload,
//       };

//       setClients((prev) => [
//         {
//           id: created.id ?? Date.now(),
//           name: created.name,
//           email: created.email,
//           phone: created.phone,
//           address: created.address,
//           company: newClient.company,
//           status: created.status ?? "Active",
//         },
//         ...prev,
//       ]);

//       setNewClient({ name: "", email: "", phone: "", company: "" });
//     } catch (err) {
//       console.error("addClient error:", err);
//     }
//   };

//   //
//   // CREATE PROJECT
//   //
//   const createProject = async () => {
//     if (!newProject.name.trim() || !newProject.clientId) {
//       alert("Provide project name and client.");
//       return;
//     }

//     const payload = {
//       name: newProject.name.trim(),
//       client_id: Number(newProject.clientId),
//       description: newProject.description,
//       status: "Planning",
//       boq_status: "draft",
//       progress: 0,
//       created_at: new Date().toISOString().split("T")[0],
//     };

//     try {
//       const res = await fetch(`${API_BASE}/projects`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) throw new Error("Failed creating project");

//       const result = await res.json();
//       const id = result?.id ?? result?.insertId ?? result?.data?.id ?? Date.now();

//       const clientName =
//         clients.find((c) => c.id === Number(newProject.clientId))?.name ?? "";

//       const proj: Project = {
//         id,
//         name: payload.name,
//         client_id: payload.client_id,
//         client: clientName,
//         status: payload.status,
//         boqStatus: payload.boq_status,
//         progress: payload.progress,
//         createdDate: payload.created_at,
//         description: payload.description,
//       };

//       setProjects((prev) => [proj, ...prev]);
//       setNewProject({ name: "", clientId: "", description: "" });
//     } catch (err) {
//       console.error("createProject error:", err);
//     }
//   };

//   //
//   // UPDATE BOQ STATUS
//   //
//   const updateBOQStatus = async (projectId: number, newStatus: string) => {
//     setProjects((prev) =>
//       prev.map((p) => (p.id === projectId ? { ...p, boqStatus: newStatus } : p))
//     );

//     try {
//       await fetch(`${API_BASE}/projects/${projectId}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ boq_status: newStatus }),
//       });
//     } catch (err) {
//       console.warn("Could not persist BOQ:", err);
//     }
//   };

//   //
//   // BOQ OPERATIONS
//   //
//   const addBOQItem = () => {
//     if (!newBOQItem.item || !newBOQItem.quantity || !newBOQItem.rate) return;

//     const total =
//       parseFloat(newBOQItem.quantity) * parseFloat(newBOQItem.rate);

//     const item: BOQItem = {
//       id: Date.now(),
//       item: newBOQItem.item,
//       quantity: newBOQItem.quantity,
//       unit: newBOQItem.unit,
//       rate: newBOQItem.rate,
//       total: total.toFixed(2),
//     };

//     setBOQItems((prev) => [...prev, item]);
//     setNewBOQItem({ item: "", quantity: "", unit: "", rate: "" });
//   };

//   const getTotalBOQ = () =>
//     boqItems
//       .reduce((sum, it) => sum + parseFloat(it.total || "0"), 0)
//       .toFixed(2);

//   //
//   // CHAT WINDOW
//   //
//   const openChatWindow = (recipient: string, role: string) => {
//     setChatWindow({ isOpen: true, recipient, recipientRole: role });
//   };

//   const closeChatWindow = () => {
//     setChatWindow({ isOpen: false, recipient: "", recipientRole: "" });
//     setChatMessage("");
//     setAttachedFiles([]);
//   };

//   const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = Array.from(e.target.files || []);
//     setAttachedFiles((prev) => [...prev, ...files]);
//   };

//   const removeFile = (index: number) =>
//     setAttachedFiles((prev) => prev.filter((_, i) => i !== index));

//   const sendMessage = (
//     recipient: string,
//     message: string,
//     files: File[] = []
//   ) => {
//     const newMessage: Communication = {
//       id: Date.now(),
//       recipient,
//       recipientRole: chatWindow.recipientRole || "management",
//       message,
//       files: files.map((f) => ({
//         name: f.name,
//         size: f.size,
//         type: f.type,
//       })),
//       timestamp: new Date().toLocaleString(),
//       sender: "Project Manager",
//       status: "sent",
//     };

//     setCommunications((prev) => [newMessage, ...prev]);

//     try {
//       (MessageBus as any).send(newMessage);
//     } catch (err) {
//       console.warn("MessageBus failed:", err);
//     }

//     window.dispatchEvent(
//       new CustomEvent("projectManagerMessage", {
//         detail: {
//           sender: "Project Manager",
//           recipient,
//           message,
//           timestamp: Date.now(),
//           files: newMessage.files,
//         },
//       })
//     );

//     closeChatWindow();
//   };

//   const sendChatMessage = () => {
//     if (chatMessage.trim() || attachedFiles.length > 0) {
//       sendMessage(
//         chatWindow.recipient,
//         chatMessage || "Document(s) attached",
//         attachedFiles
//       );
//     }
//   };

//   const viewProjectDetails = (project: Project) => {
//     alert(
//       `Project: ${project.name}\nClient: ${project.client}\nStatus: ${project.status}\nProgress: ${project.progress}%\nDescription: ${
//         project.description || "(none)"
//       }`
//     );
//   };

//   //
//   // ---------------------------
//   // RETURN (FULL UI COMING NEXT)
//   // ---------------------------
//   //
//   return (
