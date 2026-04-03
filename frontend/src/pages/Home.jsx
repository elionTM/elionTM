import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Rocket, Shield, Briefcase, Layout, ArrowRight, ChevronRight, ExternalLink, X, ChevronLeft, Send } from 'lucide-react';
import RequestModal from '../components/RequestModal';

import { API_URL } from '../config';
const Home = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [loadingPortfolio, setLoadingPortfolio] = useState(true);
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterService, setFilterService] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  const categories = [
    {
      id: 'branding-marketing',
      title: 'Branding & Marketing',
      description: 'Define your identity and reach your audience with precision.',
      icon: <Layout className="w-6 h-6" />,
      color: 'bg-blue-50 text-blue-600',
      path: '/branding-marketing'
    },
    {
      id: 'tech-development',
      title: 'Tech & Development',
      description: 'Build scalable, secure, and high-performance solutions.',
      icon: <Rocket className="w-6 h-6" />,
      color: 'bg-purple-50 text-purple-600',
      path: '/tech-development'
    },
    {
      id: 'legal-business',
      title: 'Legal & Business',
      description: 'Establish a solid foundation with expert legal and business guidance.',
      icon: <Shield className="w-6 h-6" />,
      color: 'bg-emerald-50 text-emerald-600',
      path: '/legal-business'
    },
    {
      id: 'dashboard',
      title: 'Project Dashboard',
      description: 'Monitor your progress and manage your projects in one place.',
      icon: <Briefcase className="w-6 h-6" />,
      color: 'bg-orange-50 text-orange-600',
      path: '/dashboard'
    }
  ];

  const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await fetch(`${API_URL}/api/portfolio`, { credentials: 'include' });
        const data = await response.json();
        if (Array.isArray(data)) {
          setPortfolio(data);
        }
      } catch (error) {
        console.error('Error fetching portfolio:', error);
      } finally {
        setLoadingPortfolio(false);
      }
    };
    fetchPortfolio();
  }, []);

  const filteredPortfolio = portfolio.filter(item => {
    const categoryMatch = filterCategory === 'All' || item.category === filterCategory;
    const serviceMatch = filterService === 'All' || item.serviceId?.name === filterService;
    return categoryMatch && serviceMatch;
  });

  const uniqueServices = Array.from(new Set(portfolio
    .filter(item => filterCategory === 'All' || item.category === filterCategory)
    .map(item => item.serviceId?.name)
    .filter(Boolean)
  ));

  const openProject = (project) => {
    setSelectedProject(project);
    setActiveImageIndex(0);
    document.body.style.overflow = 'hidden';
  };

  const closeProject = () => {
    setSelectedProject(null);
    document.body.style.overflow = 'unset';
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigateTo('/')}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">Elion Tech</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => navigateTo('/branding-marketing')} className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Branding</button>
            <button onClick={() => navigateTo('/tech-development')} className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Development</button>
            <button onClick={() => navigateTo('/legal-business')} className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Legal</button>
            <button onClick={() => navigateTo('/dashboard')} className="px-4 py-2 bg-slate-900 text-white rounded-full text-sm font-medium hover:bg-slate-800 transition-all shadow-sm">Dashboard</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold uppercase tracking-wider">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                Now Live: Version 2.0
              </div>
              <h1 className="text-6xl md:text-7xl font-bold text-slate-900 leading-[1.1] tracking-tight">
                Build your <span className="text-blue-600">vision</span> with precision.
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed max-w-xl">
                Elion Tech provides comprehensive solutions for branding, development, and legal business strategy. Everything you need to scale your idea.
              </p>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => navigateTo('/dashboard')}
                  className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center gap-2 group"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-2xl font-semibold hover:bg-slate-50 transition-all"
                >
                  View Portfolio
                </button>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-gradient-to-tr from-blue-100 to-purple-100 rounded-[2rem] blur-2xl opacity-50 -z-10"></div>
              <div className="bg-white p-2 rounded-[2rem] shadow-2xl border border-slate-100">
                <img 
                  src="https://picsum.photos/seed/tech/1200/800" 
                  alt="Tech Preview" 
                  className="rounded-[1.5rem] w-full object-cover aspect-[4/3]"
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>
          </div>

          {/* Categories Grid */}
          <div className="mt-32 space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-slate-900">Our Expertise</h2>
              <p className="text-slate-500 max-w-2xl mx-auto">
                Specialized services tailored to help your business grow and succeed in a competitive landscape.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onClick={() => navigateTo(category.path)}
                  className="group p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer"
                >
                  <div className={`w-12 h-12 rounded-2xl ${category.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{category.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6">
                    {category.description}
                  </p>
                  <div className="flex items-center text-blue-600 text-sm font-bold group-hover:gap-2 transition-all">
                    Learn More <ChevronRight className="w-4 h-4" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Portfolio Section */}
          <div id="portfolio" className="mt-32 space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-slate-900">Featured Work</h2>
              <p className="text-slate-500 max-w-2xl mx-auto">
                A showcase of our best projects across branding, development, and business strategy.
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-slate-200">
                {['All', 'Legal & Business', 'Branding & Marketing', 'Tech & Development'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => { setFilterCategory(cat); setFilterService('All'); }}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${filterCategory === cat ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                  >
                    {cat === 'All' ? 'All Categories' : cat.split(' & ')[0]}
                  </button>
                ))}
              </div>

              {uniqueServices.length > 0 && (
                <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-slate-200 overflow-x-auto max-w-full">
                  <button
                    onClick={() => setFilterService('All')}
                    className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${filterService === 'All' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                  >
                    All Services
                  </button>
                  {uniqueServices.map(service => (
                    <button
                      key={service}
                      onClick={() => setFilterService(service)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${filterService === service ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                      {service}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {loadingPortfolio ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredPortfolio.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
                <p className="text-slate-400">No projects found matching your criteria. Try adjusting your filters!</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPortfolio.map((item, index) => (
                  <motion.div
                    key={item._id}
                    layoutId={item._id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    onClick={() => openProject(item)}
                    className="group bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all overflow-hidden cursor-pointer"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img 
                        src={item.images?.[0] || 'https://picsum.photos/seed/placeholder/800/600'} 
                        alt={item.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />
                      {item.images?.length > 1 && (
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-slate-900 px-3 py-1 rounded-full text-[10px] font-bold shadow-sm">
                          {item.images.length} Photos
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                        <div className="bg-white text-slate-900 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
                          View Details <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                    <div className="p-8">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600">
                          {item.category}
                        </span>
                        {item.serviceId && (
                          <span className="text-[10px] font-medium text-slate-400">
                            {item.serviceId.name}
                          </span>
                        )}
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-3">{item.title}</h3>
                      <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeProject}
              className="absolute inset-0 bg-slate-900/90 backdrop-blur-md"
            />
            <motion.div 
              layoutId={selectedProject._id}
              className="relative w-full max-w-5xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
            >
              <button 
                onClick={closeProject}
                className="absolute top-6 right-6 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full text-slate-900 hover:bg-white transition-all shadow-lg"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Image Gallery */}
              <div className="w-full md:w-3/5 bg-slate-100 relative group">
                <img 
                  src={selectedProject.images[activeImageIndex]} 
                  alt={selectedProject.title}
                  className="w-full h-full object-cover min-h-[300px] md:min-h-[500px]"
                  referrerPolicy="no-referrer"
                />
                
                {selectedProject.images.length > 1 && (
                  <>
                    <div className="absolute inset-y-0 left-4 flex items-center">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setActiveImageIndex(prev => (prev === 0 ? selectedProject.images.length - 1 : prev - 1)); }}
                        className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-slate-900 hover:bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                    </div>
                    <div className="absolute inset-y-0 right-4 flex items-center">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setActiveImageIndex(prev => (prev === selectedProject.images.length - 1 ? 0 : prev + 1)); }}
                        className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-slate-900 hover:bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </div>
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                      {selectedProject.images.map((_, idx) => (
                        <button 
                          key={idx}
                          onClick={(e) => { e.stopPropagation(); setActiveImageIndex(idx); }}
                          className={`w-2 h-2 rounded-full transition-all ${activeImageIndex === idx ? 'bg-white w-6' : 'bg-white/50'}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Content */}
              <div className="w-full md:w-2/5 p-8 md:p-12 overflow-y-auto">
                <div className="space-y-6">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 mb-2 block">
                      {selectedProject.category}
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
                      {selectedProject.title}
                    </h2>
                  </div>

                  {selectedProject.serviceId && (
                    <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                      <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                        <Rocket className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Service Provided</p>
                        <p className="text-sm font-bold text-slate-900">{selectedProject.serviceId.name}</p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Project Overview</h4>
                    <p className="text-slate-600 leading-relaxed">
                      {selectedProject.description}
                    </p>
                  </div>

                  <div className="flex flex-col gap-3">
                    {selectedProject.link && (
                      <a 
                        href={selectedProject.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 group"
                      >
                        Visit Live Project
                        <ExternalLink className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </a>
                    )}
                    {selectedProject.serviceId && (
                      <button 
                        onClick={() => setIsRequestModalOpen(true)}
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 group"
                      >
                        Request Similar Project
                        <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <RequestModal 
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        service={selectedProject?.serviceId}
      />

      {/* Footer */}
      <footer className="mt-20 border-t border-slate-200 bg-white py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-slate-900 rounded flex items-center justify-center">
              <Rocket className="w-3 h-3 text-white" />
            </div>
            <span className="font-bold text-lg text-slate-900">Elion Tech</span>
          </div>
          <p className="text-slate-400 text-sm">
            © 2026 Elion Tech. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-slate-400 hover:text-slate-600 transition-colors">Twitter</a>
            <a href="#" className="text-slate-400 hover:text-slate-600 transition-colors">LinkedIn</a>
            <a href="#" className="text-slate-400 hover:text-slate-600 transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;

