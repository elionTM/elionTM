import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';
import { LogOut, Layout, Rocket, Briefcase, User, Save, Phone, Globe, MapPin } from 'lucide-react';
import { io } from 'socket.io-client';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const { user, loading: authLoading, logout, updateUser } = useAuth();
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
        if (response.ok) {
          const data = await response.json();
          setProjects(Array.isArray(data) ? data : []);
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
    const socket = io(API_URL, {
      transports: ['polling', 'websocket'],
      withCredentials: true
    });
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

  // STOP REDIRECTS ON REFRESH: Wait for auth check to finish
  useEffect(() => {
    if (!authLoading && !user) {
      navigateTo('/login');
    }
  }, [user, authLoading]);

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

  if (authLoading) return null; // Or a loading spinner

  const glassClass = "bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]";

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-cyan-500/30 selection:text-cyan-100">
      {/* Sidebar/Nav */}
      <nav className="bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 px-8 py-4 flex items-center justify-between sticky top-0 z-50 shadow-lg">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigateTo('/')}>
          <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center">
            <Rocket className="w-5 h-5 text-white" />
          </div>
          <span className="font-black text-xl tracking-tighter text-white uppercase">Elion Tech</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/5">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-lg text-[10px] font-black tracking-widest uppercase transition-all ${activeTab === 'overview' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-white'}`}
            >
              Overview
            </button>
            <button 
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 rounded-lg text-[10px] font-black tracking-widest uppercase transition-all ${activeTab === 'profile' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-white'}`}
            >
              Profile
            </button>
          </div>
          {user?.role === 'admin' && (
            <button 
              onClick={() => navigateTo('/management')}
              className="flex items-center gap-2 text-[10px] font-black tracking-widest uppercase text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <Briefcase className="w-4 h-4" /> Management
            </button>
          )}
          <button 
            onClick={logout}
            className="flex items-center gap-2 text-[10px] font-black tracking-widest uppercase text-red-400 hover:text-red-300 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </nav>

      <div className="p-8 max-w-7xl mx-auto">
        {activeTab === 'overview' ? (
          <>
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-4xl font-black tracking-tighter uppercase">DASHBOARD</h1>
              <div className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">Welcome back, <span className="text-white">{user?.name}</span></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className={`${glassClass} p-8 rounded-[2rem]`}>
                <h2 className="text-[10px] font-black tracking-widest text-slate-500 mb-2 uppercase">Total Projects</h2>
                <p className="text-4xl font-black text-cyan-400">{loading ? '...' : projects.length}</p>
              </div>
              <div className={`${glassClass} p-8 rounded-[2rem]`}>
                <h2 className="text-[10px] font-black tracking-widest text-slate-500 mb-2 uppercase">Active Projects</h2>
                <p className="text-4xl font-black text-orange-400">
                  {loading ? '...' : projects.filter(p => p.status === 'in-progress' || p.status === 'active').length}
                </p>
              </div>
              <div className={`${glassClass} p-8 rounded-[2rem]`}>
                <h2 className="text-[10px] font-black tracking-widest text-slate-500 mb-2 uppercase">Completed</h2>
                <p className="text-4xl font-black text-emerald-400">
                  {loading ? '...' : projects.filter(p => p.status === 'completed' || p.status === 'done').length}
                </p>
              </div>
            </div>

            <div className={`${glassClass} rounded-[2rem] overflow-hidden`}>
              <div className="p-8 border-b border-white/5">
                <h2 className="text-xl font-black tracking-tighter uppercase">Recent Projects</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-white/5 text-slate-500 text-[10px] font-black tracking-widest uppercase">
                    <tr>
                      <th className="px-8 py-4 font-black">Client</th>
                      <th className="px-8 py-4 font-black">Service</th>
                      <th className="px-8 py-4 font-black">Status</th>
                      <th className="px-8 py-4 font-black">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
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
                        <tr key={project._id} className="hover:bg-white/5 transition-colors">
                          <td className="px-8 py-6">
                            <div className="font-bold text-white uppercase text-xs tracking-tight">{project.clientName}</div>
                            <div className="text-[10px] text-slate-500 font-medium">{project.clientEmail}</div>
                          </td>
                          <td className="px-8 py-6 text-[10px] font-black tracking-widest uppercase text-slate-400">
                            {project.serviceId?.name || 'N/A'}
                          </td>
                          <td className="px-8 py-6">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                              project.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
                              project.status === 'in-progress' ? 'bg-orange-500/10 text-orange-400' :
                              'bg-cyan-500/10 text-cyan-400'
                            }`}>
                              {project.status}
                            </span>
                          </td>
                          <td className="px-8 py-6 text-slate-500 text-[10px] font-bold">
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
