import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';
import { LogOut, Layout, Briefcase, User, Save, Phone, Globe, MapPin } from 'lucide-react';
import { io } from 'socket.io-client';
import logo from '../assets/elion-logo.png';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const { user, logout, updateUser } = useAuth();
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phoneNumber: user?.phoneNumber || '',
    country: user?.country || '',
    state: user?.state || ''
  });
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [updateMessage, setUpdateMessage] = useState({ type: '', text: '' });

  const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        phoneNumber: user.phoneNumber || '',
        country: user.country || '',
        state: user.state || ''
      });
    }
  }, [user]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${API_URL}/api/projects`, { credentials: 'include' });
        const data = await response.json();
        if (Array.isArray(data)) {
          setProjects(data);
        } else {
          setProjects([]);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();

    // Socket.io for live updates
    const socket = io(API_URL);
    socket.on('projectCreated', (newProject) => {
      // Only add if it belongs to the user or user is admin
      if (user?.role === 'admin' || newProject.userId === user?._id) {
        setProjects(prev => [newProject, ...prev]);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdatingProfile(true);
    setUpdateMessage({ type: '', text: '' });

    try {
      const response = await fetch(`${API_URL}/api/auth/updateProfile`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
        credentials: 'include'
      });

      const data = await response.json();

      if (data.status === 'success') {
        updateUser(data.data.user);
        setUpdateMessage({ type: 'success', text: 'Profile updated successfully!' });
      } else {
        setUpdateMessage({ type: 'error', text: data.message || 'Failed to update profile' });
      }
    } catch (error) {
      setUpdateMessage({ type: 'error', text: 'An error occurred while updating profile' });
    } finally {
      setUpdatingProfile(false);
      setTimeout(() => setUpdateMessage({ type: '', text: '' }), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar/Nav */}
      <nav className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => navigateTo('/')}>
          <div className="w-8 h-8 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <img src={logo} alt="Elion Tech" className="w-full h-full object-contain" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900">Elion Tech</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center bg-gray-100 p-1 rounded-xl">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'overview' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Overview
            </button>
            <button 
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'profile' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Profile
            </button>
          </div>
          {user?.role === 'admin' && (
            <button 
              onClick={() => navigateTo('/management')}
              className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              <Briefcase className="w-4 h-4" /> Management
            </button>
          )}
          <button 
            onClick={logout}
            className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </nav>

      <div className="p-8 max-w-7xl mx-auto">
        {activeTab === 'overview' ? (
          <>
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
              <div className="text-sm text-gray-500">Welcome back, <span className="font-semibold text-gray-900">{user?.name}</span></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Total Projects</h2>
                <p className="text-3xl font-bold text-blue-600">{projects.length}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Active Projects</h2>
                <p className="text-3xl font-bold text-orange-600">
                  {projects.filter(p => p.status === 'in-progress').length}
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Completed</h2>
                <p className="text-3xl font-bold text-emerald-600">
                  {projects.filter(p => p.status === 'completed').length}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">Recent Projects</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-gray-500 text-sm uppercase">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Client</th>
                      <th className="px-6 py-4 font-semibold">Service</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {loading ? (
                      <tr>
                        <td colSpan="4" className="px-6 py-8 text-center text-gray-500">Loading projects...</td>
                      </tr>
                    ) : projects.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="px-6 py-8 text-center text-gray-500">No projects found.</td>
                      </tr>
                    ) : (
                      projects.map((project) => (
                        <tr key={project._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-900">{project.clientName}</div>
                            <div className="text-sm text-gray-500">{project.clientEmail}</div>
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            {project.serviceId?.name || 'N/A'}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              project.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                              project.status === 'in-progress' ? 'bg-orange-100 text-orange-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {project.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-500 text-sm">
                            {new Date(project.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile Settings</h1>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="flex items-center gap-6 mb-8 p-6 bg-gray-50 rounded-2xl">
                  <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
                    <p className="text-gray-500">{user?.email}</p>
                    <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full uppercase tracking-wider">
                      {user?.role}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input 
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                        placeholder="Your Name"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input 
                        type="tel"
                        value={profileData.phoneNumber}
                        onChange={(e) => setProfileData({ ...profileData, phoneNumber: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                        placeholder="+1 234 567 890"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Country</label>
                    <div className="relative">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input 
                        type="text"
                        value={profileData.country}
                        onChange={(e) => setProfileData({ ...profileData, country: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                        placeholder="United States"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">State / Region</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input 
                        type="text"
                        value={profileData.state}
                        onChange={(e) => setProfileData({ ...profileData, state: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                        placeholder="California"
                      />
                    </div>
                  </div>
                </div>

                {updateMessage.text && (
                  <div className={`p-4 rounded-xl text-sm font-medium ${updateMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                    {updateMessage.text}
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={updatingProfile}
                  className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {updatingProfile ? 'Updating...' : (
                    <>
                      <Save className="w-5 h-5" /> Save Changes
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
