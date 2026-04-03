import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Plus, Trash2, Edit2, Layout, Briefcase, Image as ImageIcon, Users, CheckCircle, Clock, Play, XCircle, UserPlus, Phone, Globe, MapPin, Mail, Shield } from 'lucide-react';
import { io } from 'socket.io-client';
import { API_URL } from '../config';
import logo from '../assets/elion-logo.png';

const Management = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('services');
  const [services, setServices] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [showPortfolioForm, setShowPortfolioForm] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  
  const [currentService, setCurrentService] = useState({ name: '', description: '', category: 'Legal & Business' });
  const [currentPortfolio, setCurrentPortfolio] = useState({ title: '', description: '', category: 'Legal & Business', images: [''], link: '', serviceId: '' });
  const [currentUser, setCurrentUser] = useState({ name: '', email: '', password: '', role: 'user', phoneNumber: '', country: '', state: '' });
  
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Shared Design System
  const glassClass = "bg-white/60 backdrop-blur-2xl border border-white/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.05)]";
  const blueGradient = "bg-gradient-to-r from-[#0A66C2] to-[#1DA1F2]";

  const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigateTo('/dashboard');
      return;
    }
    fetchData();

    // Socket.io for live updates
    const socket = io(API_URL);
    socket.on('projectCreated', (newProject) => {
      setProjects(prev => [newProject, ...prev]);
    });
    socket.on('projectUpdated', (updatedProject) => {
      setProjects(prev => prev.map(p => p._id === updatedProject._id ? updatedProject : p));
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [servicesRes, portfolioRes, projectsRes, usersRes] = await Promise.all([
        fetch(`${API_URL}/api/services`, { credentials: 'include' }),
        fetch(`${API_URL}/api/portfolio`, { credentials: 'include' }),
        fetch(`${API_URL}/api/projects`, { credentials: 'include' }),
        fetch(`${API_URL}/api/auth/users`, { credentials: 'include' })
      ]);
      
      const servicesData = await servicesRes.json();
      const portfolioData = await portfolioRes.json();
      const projectsData = await projectsRes.json();
      const usersData = await usersRes.json();
      
      setServices(Array.isArray(servicesData) ? servicesData : []);
      setPortfolio(Array.isArray(portfolioData) ? portfolioData : []);
      setProjects(Array.isArray(projectsData) ? projectsData : []);
      setUsers(usersData.status === 'success' ? usersData.data.users : []);
    } catch (error) {
      console.error('Error fetching management data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectStatusToggle = async (projectId, newStatus) => {
    try {
      const res = await fetch(`${API_URL}/api/projects/${projectId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
        credentials: 'include'
      });
      if (res.ok) {
        const updatedProject = await res.json();
        setProjects(prev => prev.map(p => p._id === projectId ? { ...p, status: newStatus } : p));
      }
    } catch (error) {
      console.error('Error updating project status:', error);
    }
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentUser),
        credentials: 'include'
      });
      if (res.ok) {
        fetchData();
        setShowUserForm(false);
        setCurrentUser({ name: '', email: '', password: '', role: 'user', phoneNumber: '', country: '', state: '' });
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to create user');
      }
    } catch (error) {
      console.error('Error creating user:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    const method = editingId ? 'PATCH' : 'POST';
    const url = editingId ? `${API_URL}/api/services/${editingId}` : `${API_URL}/api/services`;
    
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentService),
        credentials: 'include'
      });
      if (res.ok) {
        fetchData();
        setShowServiceForm(false);
        setCurrentService({ name: '', description: '', category: 'Legal & Business' });
        setEditingId(null);
      }
    } catch (error) {
      console.error('Error saving service:', error);
    }
  };

  const handlePortfolioSubmit = async (e) => {
    e.preventDefault();
    const method = editingId ? 'PATCH' : 'POST';
    const url = editingId ? `${API_URL}/api/portfolio/${editingId}` : `${API_URL}/api/portfolio`;
    
    // Filter out empty image URLs
    const filteredImages = currentPortfolio.images.filter(img => img.trim() !== '');
    if (filteredImages.length === 0) {
      alert('At least one image URL is required');
      return;
    }

    const payload = {
      ...currentPortfolio,
      images: filteredImages
    };
    
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include'
      });
      if (res.ok) {
        fetchData();
        setShowPortfolioForm(false);
        setCurrentPortfolio({ title: '', description: '', category: 'Legal & Business', images: [''], link: '', serviceId: '' });
        setEditingId(null);
      } else {
        const errorData = await res.json();
        alert(`Error: ${errorData.message || 'Failed to save item'}`);
      }
    } catch (error) {
      console.error('Error saving portfolio item:', error);
      alert('An error occurred while saving');
    }
  };

  const addImageField = () => {
    setCurrentPortfolio({
      ...currentPortfolio,
      images: [...currentPortfolio.images, '']
    });
  };

  const updateImageField = (index, value) => {
    const newImages = [...currentPortfolio.images];
    newImages[index] = value;
    setCurrentPortfolio({
      ...currentPortfolio,
      images: newImages
    });
  };

  const removeImageField = (index) => {
    if (currentPortfolio.images.length <= 1) return;
    const newImages = currentPortfolio.images.filter((_, i) => i !== index);
    setCurrentPortfolio({
      ...currentPortfolio,
      images: newImages
    });
  };

  const deleteItem = async (type, id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    const url = type === 'service' ? `${API_URL}/api/services/${id}` : `${API_URL}/api/portfolio/${id}`;
    try {
      const res = await fetch(url, { method: 'DELETE', credentials: 'include' });
      if (res.ok) fetchData();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  if (user?.role !== 'admin') return null;

  return (
    <div className="min-h-screen bg-[#F5F9FF] p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-5">
            <div 
              onClick={() => navigateTo('/')} 
              className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-white p-2 cursor-pointer hover:scale-105 transition-transform duration-300"
            >
              <img src={logo} alt="Elion Tech" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <button onClick={() => navigateTo('/dashboard')} className="p-1 hover:text-blue-600 transition-colors">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Management</h1>
              </div>
              <p className="text-sm text-slate-500 font-medium ml-7">System Administrator Control Panel</p>
            </div>
          </div>
          
          <div className={`flex gap-1 p-1 rounded-2xl ${glassClass}`}>
            <button 
              onClick={() => setActiveTab('services')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'services' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              Services
            </button>
            <button 
              onClick={() => setActiveTab('portfolio')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'portfolio' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              Portfolio
            </button>
            <button 
              onClick={() => setActiveTab('projects')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'projects' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              Projects
            </button>
            <button 
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'users' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              Users
            </button>
          </div>
        </div>

        {activeTab === 'services' ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">Manage Services</h2>
              <button 
                onClick={() => { setShowServiceForm(true); setEditingId(null); setCurrentService({ name: '', description: '', category: 'Legal & Business' }); }}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
              >
                <Plus className="w-4 h-4" /> Add Service
              </button>
            </div>

            {showServiceForm && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
                <h3 className="text-lg font-bold mb-4">{editingId ? 'Edit Service' : 'New Service'}</h3>
                <form onSubmit={handleServiceSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Service Name</label>
                    <input 
                      type="text" 
                      value={currentService.name}
                      onChange={e => setCurrentService({...currentService, name: e.target.value})}
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600/20 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                    <select 
                      value={currentService.category}
                      onChange={e => setCurrentService({...currentService, category: e.target.value})}
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600/20 outline-none"
                    >
                      <option>Legal & Business</option>
                      <option>Branding & Marketing</option>
                      <option>Tech & Development</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                    <textarea 
                      value={currentService.description}
                      onChange={e => setCurrentService({...currentService, description: e.target.value})}
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600/20 outline-none h-24"
                      required
                    />
                  </div>
                  <div className="md:col-span-2 flex justify-end gap-4">
                    <button type="button" onClick={() => setShowServiceForm(false)} className="px-6 py-2 text-slate-600 font-bold">Cancel</button>
                    <button type="submit" className="bg-blue-600 text-white px-8 py-2 rounded-xl font-bold hover:bg-blue-700 transition-all">Save Service</button>
                  </div>
                </form>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map(service => (
                <div key={service._id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                      {service.category}
                    </span>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => { setEditingId(service._id); setCurrentService(service); setShowServiceForm(true); }}
                        className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => deleteItem('service', service._id)}
                        className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{service.name}</h3>
                  <p className="text-slate-500 text-sm line-clamp-3">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        ) : activeTab === 'portfolio' ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">Manage Portfolio</h2>
              <button 
                onClick={() => { setShowPortfolioForm(true); setEditingId(null); setCurrentPortfolio({ title: '', description: '', category: 'Legal & Business', images: [''], link: '', serviceId: '' }); }}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
              >
                <Plus className="w-4 h-4" /> Add Portfolio Item
              </button>
            </div>

            {showPortfolioForm && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
                <h3 className="text-lg font-bold mb-4">{editingId ? 'Edit Portfolio Item' : 'New Portfolio Item'}</h3>
                <form onSubmit={handlePortfolioSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Project Title</label>
                    <input 
                      type="text" 
                      value={currentPortfolio.title}
                      onChange={e => setCurrentPortfolio({...currentPortfolio, title: e.target.value})}
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600/20 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                    <select 
                      value={currentPortfolio.category}
                      onChange={e => setCurrentPortfolio({...currentPortfolio, category: e.target.value, serviceId: ''})}
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600/20 outline-none"
                    >
                      <option>Legal & Business</option>
                      <option>Branding & Marketing</option>
                      <option>Tech & Development</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Related Service</label>
                    <select 
                      value={currentPortfolio.serviceId?._id || currentPortfolio.serviceId || ''}
                      onChange={e => setCurrentPortfolio({...currentPortfolio, serviceId: e.target.value})}
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600/20 outline-none"
                    >
                      <option value="">Select a Service</option>
                      {services
                        .filter(s => s.category === currentPortfolio.category)
                        .map(service => (
                          <option key={service._id} value={service._id}>{service.name}</option>
                        ))
                      }
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Image URLs</label>
                    <div className="space-y-3">
                      {currentPortfolio.images.map((url, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input 
                            type="url" 
                            value={url}
                            onChange={e => updateImageField(idx, e.target.value)}
                            className="flex-1 px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600/20 outline-none"
                            placeholder="https://picsum.photos/seed/project/800/600"
                            required
                          />
                          <button 
                            type="button" 
                            onClick={() => removeImageField(idx)}
                            className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                            disabled={currentPortfolio.images.length <= 1}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button 
                        type="button" 
                        onClick={addImageField}
                        className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        <Plus className="w-4 h-4" /> Add Another Image
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Project Link (Optional)</label>
                    <input 
                      type="url" 
                      value={currentPortfolio.link}
                      onChange={e => setCurrentPortfolio({...currentPortfolio, link: e.target.value})}
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600/20 outline-none"
                      placeholder="https://example.com"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                    <textarea 
                      value={currentPortfolio.description}
                      onChange={e => setCurrentPortfolio({...currentPortfolio, description: e.target.value})}
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600/20 outline-none h-24"
                      required
                    />
                  </div>
                  <div className="md:col-span-2 flex justify-end gap-4">
                    <button type="button" onClick={() => setShowPortfolioForm(false)} className="px-6 py-2 text-slate-600 font-bold">Cancel</button>
                    <button type="submit" className="bg-blue-600 text-white px-8 py-2 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
                      {editingId ? 'Update Item' : 'Save Item'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {portfolio.map(item => (
                <div key={item._id} className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all overflow-hidden group">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={item.images?.[0] || 'https://picsum.photos/seed/placeholder/800/600'} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button 
                        onClick={() => { setEditingId(item._id); setCurrentPortfolio(item); setShowPortfolioForm(true); }}
                        className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-slate-600 hover:text-blue-600 transition-colors shadow-sm"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => deleteItem('portfolio', item._id)}
                        className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-slate-600 hover:text-red-600 transition-colors shadow-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {item.images?.length > 1 && (
                      <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-[10px] font-bold">
                        +{item.images.length - 1} more images
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600">
                        {item.category}
                      </span>
                      {item.serviceId && (
                        <span className="text-[10px] font-medium text-slate-400">
                          {item.serviceId.name}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-slate-500 text-sm line-clamp-2">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : activeTab === 'projects' ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">Manage Projects</h2>
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-blue-500"></div> Pending</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-orange-500"></div> Active</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-emerald-500"></div> Done</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-slate-500"></div> Closed</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4 font-bold">Client Info</th>
                    <th className="px-6 py-4 font-bold">Service & Details</th>
                    <th className="px-6 py-4 font-bold">Status</th>
                    <th className="px-6 py-4 font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {projects.map(project => (
                    <tr key={project._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{project.clientName}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                          <Mail className="w-3 h-3" /> {project.clientEmail}
                        </div>
                        {project.clientPhone && (
                          <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3" /> {project.clientPhone}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-blue-600">{project.serviceId?.name || 'N/A'}</div>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2 max-w-xs">{project.details}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          project.status === 'pending' ? 'bg-blue-100 text-blue-700' :
                          project.status === 'active' ? 'bg-orange-100 text-orange-700' :
                          project.status === 'done' ? 'bg-emerald-100 text-emerald-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {project.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleProjectStatusToggle(project._id, 'pending')}
                            className={`p-2 rounded-lg transition-all ${project.status === 'pending' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-400 hover:text-blue-600'}`}
                            title="Set to Pending"
                          >
                            <Clock className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleProjectStatusToggle(project._id, 'active')}
                            className={`p-2 rounded-lg transition-all ${project.status === 'active' ? 'bg-orange-600 text-white shadow-sm' : 'bg-slate-100 text-slate-400 hover:text-orange-600'}`}
                            title="Set to Active"
                          >
                            <Play className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleProjectStatusToggle(project._id, 'done')}
                            className={`p-2 rounded-lg transition-all ${project.status === 'done' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-100 text-slate-400 hover:text-emerald-600'}`}
                            title="Set to Done"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleProjectStatusToggle(project._id, 'closed')}
                            className={`p-2 rounded-lg transition-all ${project.status === 'closed' ? 'bg-slate-600 text-white shadow-sm' : 'bg-slate-100 text-slate-400 hover:text-slate-900'}`}
                            title="Set to Closed"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">Manage Users</h2>
              <button 
                onClick={() => setShowUserForm(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
              >
                <UserPlus className="w-4 h-4" /> Create User
              </button>
            </div>

            {showUserForm && (
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 mb-8 max-w-2xl">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <UserPlus className="w-6 h-6 text-blue-600" /> New User Account
                </h3>
                <form onSubmit={handleUserSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Full Name</label>
                      <input 
                        type="text" 
                        value={currentUser.name}
                        onChange={e => setCurrentUser({...currentUser, name: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-600/20 outline-none"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Email Address</label>
                      <input 
                        type="email" 
                        value={currentUser.email}
                        onChange={e => setCurrentUser({...currentUser, email: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-600/20 outline-none"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Password</label>
                      <input 
                        type="password" 
                        value={currentUser.password}
                        onChange={e => setCurrentUser({...currentUser, password: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-600/20 outline-none"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Role</label>
                      <select 
                        value={currentUser.role}
                        onChange={e => setCurrentUser({...currentUser, role: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-600/20 outline-none"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-4 pt-4">
                    <button type="button" onClick={() => setShowUserForm(false)} className="px-6 py-3 text-slate-600 font-bold">Cancel</button>
                    <button 
                      type="submit" 
                      disabled={submitting}
                      className="bg-blue-600 text-white px-10 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 disabled:opacity-50"
                    >
                      {submitting ? 'Creating...' : 'Create User'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map(u => (
                <div key={u._id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${u.role === 'admin' ? 'bg-blue-600' : 'bg-slate-400'}`}>
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{u.name}</h3>
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Mail className="w-3 h-3" /> {u.email}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${u.role === 'admin' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'}`}>
                      {u.role}
                    </span>
                    {u.phoneNumber && (
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {u.phoneNumber}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Management;
