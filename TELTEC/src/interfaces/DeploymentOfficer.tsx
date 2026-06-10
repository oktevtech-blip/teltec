import React, { useState, useEffect } from 'react';
import { Plus, Users, Truck, FileText, MapPin, Fuel, Send,MessageCircle} from 'lucide-react';
import MessageBus from '../bus/messagebus.tsx';

const DeploymentOfficerInterface = () => {
  const [activeTab, setActiveTab] = useState('projects');
  type Project = {
    id: number;
    createdDate: string;
    progress: number;
    name: string;
    location: string;
    description: string;
    scope: string;
    priority: string;
    requiredSkills: string[];
    startDate: string;
    endDate: string;
    estimatedDuration: string;
    assignedTechnicians: number[];
    transportationNeeds: string;
    status: string;
  };
  interface Message {
    id: number;
    sender: string;
    recipientRole: string;
    message: string;
    timestamp: string;
    files: { name: string; url?: string }[];
  }

  const [messages, setMessages] = useState<Message[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showMessages, setShowMessages] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]); 
  const [technicians, setTechnicians] = useState([
    { id: 1, name: 'John Smith', skills: ['Electrical', 'Plumbing'], status: 'Available', location: 'Base' },
    { id: 2, name: 'Sarah Johnson', skills: ['HVAC', 'Electrical'], status: 'Assigned', location: 'Site A' },
    { id: 3, name: 'Mike Wilson', skills: ['Plumbing', 'General'], status: 'Available', location: 'Base' },
    { id: 4, name: 'Lisa Brown', skills: ['HVAC', 'Electrical', 'Controls'], status: 'Available', location: 'Base' }
  ]);
  type FuelRequest = {
    id: number;
    technician: string;
    project: string;
    amount: string;
    date: string;
    status: string;
  };
  const [fuelRequests, setFuelRequests] = useState<FuelRequest[]>([]);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const [projectForm, setProjectForm] = useState<{
    name: string;
    location: string;
    description: string;
    scope: string;
    priority: string;
    requiredSkills: string[];
    startDate: string;
    endDate: string;
    estimatedDuration: string;
    assignedTechnicians: number[];
    transportationNeeds: string;
    status: string;
  }>({
    name: '',
    location: '',
    description: '',
    scope: '',
    priority: 'Medium',
    requiredSkills: [],
    startDate: '',
    endDate: '',
    estimatedDuration: '',
    assignedTechnicians: [],
    transportationNeeds: '',
    status: 'Planning'
  });

  const skillOptions = ['Electrical', 'Plumbing', 'HVAC', 'Controls', 'General', 'Mechanical'];
  const transportationOptions = ['Company Van', 'Pickup Truck', 'Sedan', 'Heavy Equipment Truck'];

  const addProject = () => {
    if (projectForm.name && projectForm.location) {
      const newProject = {
        ...projectForm,
        id: Date.now(),
        createdDate: new Date().toISOString().split('T')[0],
        progress: 0
      };
      setProjects([...projects, newProject]);
      setProjectForm({
        name: '',
        location: '',
        description: '',
        scope: '',
        priority: 'Medium',
        requiredSkills: [],
        startDate: '',
        endDate: '',
        estimatedDuration: '',
        assignedTechnicians: [],
        transportationNeeds: '',
        status: 'Planning'
      });
      setShowProjectForm(false);
    }
  };

  // Add useEffect for message handling
useEffect(() => {
  const handleMessage = (message: Message) => {
    if (message.recipientRole === 'deployment') {
      setMessages(prev => [message, ...prev]);
      setUnreadCount(prev => prev + 1);
      
      // Show notification
      const notification = new Notification(`New message from ${message.sender}`, {
        body: message.message,
        icon: '/notification-icon.png'
      });
    }
  };

   // Subscribe to message bus
  MessageBus.subscribe('deployment', handleMessage);

  // Also listen for events
  const eventListener = (e: CustomEvent<Message>) => {
    if (e.detail.recipientRole === 'deployment') {
      handleMessage(e.detail);
    }
  };
  window.addEventListener('newMessage', eventListener as EventListener);

  // Request notification permission
  if (Notification.permission !== 'granted') {
    Notification.requestPermission();
  }

  return () => {
    MessageBus.unsubscribe('deployment');
    window.removeEventListener('newMessage', eventListener as EventListener);
  };
}, []);



  const updateProjectProgress = (projectId: number, progress: number) => {
    setProjects(projects.map(p => 
      p.id === projectId ? { ...p, progress, status: progress === 100 ? 'Completed' : 'In Progress' } : p
    ));
  };

  const approveFuelRequest = (requestId: number) => {
    setFuelRequests(fuelRequests.map((req: any) => 
      req.id === requestId ? { ...req, status: 'Approved' } : req
    ));
  };

  const assignTechnician = (projectId: number, technicianId: number) => {
    const updatedProjects = projects.map(project => {
      if (project.id === projectId) {
        const updatedTechnicians = [...project.assignedTechnicians];
        if (!updatedTechnicians.includes(technicianId)) {
          updatedTechnicians.push(technicianId);
        }
        return { ...project, assignedTechnicians: updatedTechnicians };
      }
      return project;
    });
    setProjects(updatedProjects);

    setTechnicians(technicians.map(tech => 
      tech.id === technicianId ? { ...tech, status: 'Assigned' } : tech
    ));
  };

  const generateReport = () => {
    const totalProjects = projects.length;
    const completedProjects = projects.filter(p => p.status === 'Completed').length;
    const inProgressProjects = projects.filter(p => p.status === 'In Progress').length;
    const plannedProjects = projects.filter(p => p.status === 'Planning').length;
    const totalTechnicians = technicians.length;
    const availableTechnicians = technicians.filter(t => t.status === 'Available').length;
    const assignedTechnicians = technicians.filter(t => t.status === 'Assigned').length;
    const pendingFuelRequests = fuelRequests.filter(f => f.status === 'Pending').length;

    return {
      date: new Date().toLocaleDateString(),
      summary: {
        totalProjects,
        completedProjects,
        inProgressProjects,
        plannedProjects,
        totalTechnicians,
        availableTechnicians,
        assignedTechnicians,
        pendingFuelRequests
      },
      projects: projects,
      technicians: technicians,
      fuelRequests: fuelRequests
    };
  };

  const shareReport = () => {
    const report = generateReport();
    // Simulate sharing report
    alert('Report has been generated and shared with all employees via email and internal portal.');
    setShowReportModal(false);
  };

  const ProjectCard = ({ project }: { project: Project }) => (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{project.name}</h3>
          <p className="text-gray-600 flex items-center"><MapPin className="w-4 h-4 mr-1" />{project.location}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          project.status === 'Completed' ? 'bg-green-100 text-green-800' :
          project.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {project.status}
        </span>
      </div>
      
      <p className="text-gray-700 mb-3">{project.description}</p>
      <p className="text-sm text-gray-600 mb-3"><strong>Scope:</strong> {project.scope}</p>
      
      <div className="flex flex-wrap gap-2 mb-3">
        {project.requiredSkills.map(skill => (
          <span key={skill} className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-sm">{skill}</span>
        ))}
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div><strong>Start:</strong> {project.startDate || 'TBD'}</div>
        <div><strong>End:</strong> {project.endDate || 'TBD'}</div>
        <div><strong>Duration:</strong> {project.estimatedDuration || 'TBD'}</div>
        <div><strong>Transport:</strong> {project.transportationNeeds || 'TBD'}</div>
      </div>
      
      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span>Progress</span>
          <span>{project.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-blue-600 h-2 rounded-full" style={{width: `${project.progress}%`}}></div>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div>
          <strong className="text-sm">Assigned:</strong>
          <span className="ml-2 text-sm">
            {project.assignedTechnicians.map(techId => 
              technicians.find(t => t.id === techId)?.name
            ).join(', ') || 'None'}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={project.progress}
          onChange={(e) => updateProjectProgress(project.id, parseInt(e.target.value))}
          className="w-24"
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        

      <div className="relative">
       
      </div>
      </header>

{/* Navigation Tabs */}
<nav className="bg-white border-b">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center">
      <div className="flex space-x-8">
        {[
          { id: 'projects', name: 'Projects', icon: FileText },
          { id: 'technicians', name: 'Technicians', icon: Users },
          { id: 'fuel', name: 'Fuel Requests', icon: Fuel },
          { id: 'transport', name: 'Transportation', icon: Truck }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center px-1 py-4 border-b-2 font-medium text-sm ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <tab.icon className="w-4 h-4 mr-2" />
            {tab.name}
          </button>
        ))}
      </div>
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setShowReportModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
        >
          <FileText className="w-4 h-4 mr-2" />
          Generate Report
        </button>
        
        {/* Messages Button and Dropdown */}
        <div className="relative">
          <button 
            onClick={() => {
              setShowMessages(!showMessages);
              setUnreadCount(0);
            }}
            className="p-2 text-gray-600 hover:text-blue-600 relative"
          >
            <MessageCircle className="h-6 w-6" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
          
          {/* Message Dropdown with Close Button */}
          {showMessages && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50 border border-gray-200">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-medium">Messages</h3>
                <button 
                  onClick={() => setShowMessages(false)}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {messages.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">No messages</div>
                ) : (
                  messages.map(msg => (
                    <div key={msg.id} className="p-4 border-b border-gray-100 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{msg.sender}</p>
                          <p className="text-sm text-gray-600">{msg.message}</p>
                          {msg.files.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {msg.files.map((file, i) => (
                                <span key={i} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                                  {file.name}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <span className="text-xs text-gray-400">{msg.timestamp}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
</nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'projects' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Project Management</h2>
              <button
                onClick={() => setShowProjectForm(!showProjectForm)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </button>
            </div>

            {showProjectForm && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">Create New Project</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Project Name"
                    value={projectForm.name}
                    onChange={(e) => setProjectForm({...projectForm, name: e.target.value})}
                    className="border rounded-lg px-3 py-2"
                  />
                  <input
                    type="text"
                    placeholder="Location"
                    value={projectForm.location}
                    onChange={(e) => setProjectForm({...projectForm, location: e.target.value})}
                    className="border rounded-lg px-3 py-2"
                  />
                  <textarea
                    placeholder="Project Description"
                    value={projectForm.description}
                    onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
                    className="border rounded-lg px-3 py-2 md:col-span-2"
                    rows={3}
                  />
                  <textarea
                    placeholder="Project Scope"
                    value={projectForm.scope}
                    onChange={(e) => setProjectForm({...projectForm, scope: e.target.value})}
                    className="border rounded-lg px-3 py-2 md:col-span-2"
                    rows={2}
                  />
                  <select
                    value={projectForm.priority}
                    onChange={(e) => setProjectForm({...projectForm, priority: e.target.value})}
                    className="border rounded-lg px-3 py-2"
                  >
                    <option value="Low">Low Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="High">High Priority</option>
                    <option value="Critical">Critical</option>
                  </select>
                  <select
                    value={projectForm.transportationNeeds}
                    onChange={(e) => setProjectForm({...projectForm, transportationNeeds: e.target.value})}
                    className="border rounded-lg px-3 py-2"
                  >
                    <option value="">Select Transportation</option>
                    {transportationOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  <input
                    type="date"
                    placeholder="Start Date"
                    value={projectForm.startDate}
                    onChange={(e) => setProjectForm({...projectForm, startDate: e.target.value})}
                    className="border rounded-lg px-3 py-2"
                  />
                  <input
                    type="date"
                    placeholder="End Date"
                    value={projectForm.endDate}
                    onChange={(e) => setProjectForm({...projectForm, endDate: e.target.value})}
                    className="border rounded-lg px-3 py-2"
                  />
                  <input
                    type="text"
                    placeholder="Estimated Duration (e.g., 2 weeks)"
                    value={projectForm.estimatedDuration}
                    onChange={(e) => setProjectForm({...projectForm, estimatedDuration: e.target.value})}
                    className="border rounded-lg px-3 py-2 md:col-span-2"
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-2">Required Skills</label>
                  <div className="flex flex-wrap gap-2">
                    {skillOptions.map(skill => (
                      <label key={skill} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={projectForm.requiredSkills.includes(skill)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setProjectForm({...projectForm, requiredSkills: [...projectForm.requiredSkills, skill]});
                            } else {
                              setProjectForm({...projectForm, requiredSkills: projectForm.requiredSkills.filter(s => s !== skill)});
                            }
                          }}
                          className="mr-2"
                        />
                        {skill}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    onClick={() => setShowProjectForm(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addProject}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Create Project
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {projects.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No projects yet. Create your first project to get started.</p>
                </div>
              ) : (
                projects.map(project => <ProjectCard key={project.id} project={project} />)
              )}
            </div>
          </div>
        )}

        {activeTab === 'technicians' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Technician Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {technicians.map(tech => (
                <div key={tech.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{tech.name}</h3>
                      <p className="text-gray-600">{tech.location}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      tech.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {tech.status}
                    </span>
                  </div>
                  <div className="mb-4">
                    <strong className="text-sm text-gray-600">Skills:</strong>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {tech.skills.map(skill => (
                        <span key={skill} className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">{skill}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Assign to Project:</label>
                    <select
                      onChange={(e) => e.target.value && assignTechnician(parseInt(e.target.value), tech.id)}
                      className="w-full border rounded-lg px-3 py-2 text-sm"
                      defaultValue=""
                    >
                      <option value="">Select Project</option>
                      {projects.filter(p => p.status !== 'Completed').map(project => (
                        <option key={project.id} value={project.id}>{project.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'fuel' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Fuel Request Management</h2>
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6">
                <button
                  onClick={() => {
                    const newRequest = {
                      id: Date.now(),
                      technician: 'John Smith',
                      project: 'Site Installation Alpha',
                      amount: '50L',
                      date: new Date().toLocaleDateString(),
                      status: 'Pending'
                    };
                    setFuelRequests([...fuelRequests, newRequest]);
                  }}
                  className="mb-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Add Sample Request
                </button>
                {fuelRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <Fuel className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No fuel requests at the moment.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">Technician</th>
                          <th className="text-left py-3 px-4">Project</th>
                          <th className="text-left py-3 px-4">Amount</th>
                          <th className="text-left py-3 px-4">Date</th>
                          <th className="text-left py-3 px-4">Status</th>
                          <th className="text-left py-3 px-4">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {fuelRequests.map(request => (
                          <tr key={request.id} className="border-b">
                            <td className="py-3 px-4">{request.technician}</td>
                            <td className="py-3 px-4">{request.project}</td>
                            <td className="py-3 px-4">{request.amount}</td>
                            <td className="py-3 px-4">{request.date}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                request.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {request.status}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              {request.status === 'Pending' && (
                                <button
                                  onClick={() => approveFuelRequest(request.id)}
                                  className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                                >
                                  Approve
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'transport' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Transportation Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {transportationOptions.map((vehicle, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center mb-4">
                    <Truck className="w-8 h-8 text-blue-600 mr-3" />
                    <h3 className="text-lg font-semibold text-gray-800">{vehicle}</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="text-green-600 font-medium">Available</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Assigned Projects:</span>
                      <span>{projects.filter(p => p.transportationNeeds === vehicle).length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Service:</span>
                      <span>15 days ago</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-medium text-sm mb-2">Current Assignments:</h4>
                    {projects.filter(p => p.transportationNeeds === vehicle).length === 0 ? (
                      <p className="text-gray-500 text-sm">No current assignments</p>
                    ) : (
                      <div className="space-y-1">
                        {projects.filter(p => p.transportationNeeds === vehicle).map(project => (
                          <div key={project.id} className="text-sm text-gray-700">
                            {project.name} - {project.location}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-90vh overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">Deployment Report - {new Date().toLocaleDateString()}</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">{projects.length}</div>
                <div className="text-sm text-gray-600">Total Projects</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">{projects.filter(p => p.status === 'Completed').length}</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-yellow-600">{projects.filter(p => p.status === 'In Progress').length}</div>
                <div className="text-sm text-gray-600">In Progress</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600">{technicians.filter(t => t.status === 'Available').length}</div>
                <div className="text-sm text-gray-600">Available Techs</div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Project Summary</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  {projects.length === 0 ? (
                    <p className="text-gray-500">No projects to report.</p>
                  ) : (
                    <div className="space-y-2">
                      {projects.map(project => (
                        <div key={project.id} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                          <div>
                            <span className="font-medium">{project.name}</span>
                            <span className="text-gray-500 ml-2">({project.location})</span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className="text-sm">{project.progress}% complete</span>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              project.status === 'Completed' ? 'bg-green-100 text-green-800' :
                              project.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {project.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Technician Deployment</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {technicians.map(tech => (
                      <div key={tech.id} className="flex justify-between items-center py-2">
                        <div>
                          <span className="font-medium">{tech.name}</span>
                          <div className="text-xs text-gray-500">Skills: {tech.skills.join(', ')}</div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          tech.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {tech.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-8">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Close
              </button>
              <button
                onClick={shareReport}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
              >
                <Send className="w-4 h-4 mr-2" />
                Share Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeploymentOfficerInterface;