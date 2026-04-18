import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'motion/react';
import { Rocket, Shield, Briefcase, Layout, ArrowRight, ChevronRight, ExternalLink, X, ChevronLeft, Send, CheckCircle2, Zap, Globe, Cpu } from 'lucide-react';
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
  const [isScrolled, setIsScrolled] = useState(false);

  // Glassmorphism System Utility
  const glassClass = "bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]";
  const blueGradient = "bg-gradient-to-r from-[#00D4FF] to-[#0A66C2]";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


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
  };

  const closeProject = () => {
    setSelectedProject(null);
  };

  const processSteps = [
    { title: "DISCOVER", desc: "Deep-dive into vision & market landscape.", icon: <Globe className="w-5 h-5" /> },
    { title: "DESIGN", desc: "Premium UI/UX & brand architecture.", icon: <Layout className="w-5 h-5" /> },
    { title: "DEVELOP", desc: "High-performance scalable tech stacks.", icon: <Cpu className="w-5 h-5" /> },
    { title: "DELIVER", desc: "Seamless deployment & market entry.", icon: <CheckCircle2 className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-cyan-500/30 selection:text-cyan-100 overflow-x-hidden">
      {/* Background Orbs */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-900/20 blur-[160px] rounded-full" />
        <div className="absolute bottom-[0%] right-[-10%] w-[50%] h-[50%] bg-cyan-900/10 blur-[140px] rounded-full" />
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
        ? "py-4 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 shadow-lg" 
        : "py-6 bg-transparent"
      }`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigateTo('/')}>
            <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tighter text-white uppercase">Elion Tech</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => navigateTo('/branding-marketing')} className="text-[10px] tracking-[0.2em] font-bold text-slate-400 hover:text-cyan-400 transition-colors">BRANDING</button>
            <button onClick={() => navigateTo('/tech-development')} className="text-[10px] tracking-[0.2em] font-bold text-slate-400 hover:text-cyan-400 transition-colors">DEVELOPMENT</button>
            <button onClick={() => navigateTo('/legal-business')} className="text-[10px] tracking-[0.2em] font-bold text-slate-400 hover:text-cyan-400 transition-colors">LEGAL</button>
            <button onClick={() => navigateTo('/dashboard')} className="px-6 py-2 bg-white text-slate-950 rounded-full text-[10px] tracking-widest font-black hover:bg-cyan-400 transition-all shadow-xl">DASHBOARD</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-40 pb-20 px-6 relative">
        {/* BACKGROUND TYPOGRAPHY */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center select-none pointer-events-none -z-10 opacity-[0.03]">
          <h1 className="text-[25vw] font-black leading-none tracking-tighter">INNOVATE</h1>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center space-y-12">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6 max-w-4xl"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-cyan-400 text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                Next-Gen Agency
              </div>
              <h1 className="text-7xl md:text-9xl font-black text-white leading-[0.9] tracking-tighter uppercase">
                Build the <span className="text-transparent bg-clip-text bg-gradient-to-b from-cyan-400 to-blue-600">Future</span>
              </h1>
              <p className="text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto font-medium">
                Elion Tech combines high-performance engineering with disruptive creative strategy to scale global ventures.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.2 }}
              className="relative w-full max-w-5xl"
            >
              {/* Visual Anchor Image */}
              <div className="relative z-10 rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(0,212,255,0.15)] group">
                <img 
                  src="https://picsum.photos/seed/eliontech/1600/900" 
                  alt="High-Tech Solution" 
                  className="w-full object-cover aspect-[21/9] transition-transform duration-1000 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-60" />
              </div>

              {/* Floating Stats Cards */}
              <motion.div 
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="absolute -left-6 top-1/4 z-20 p-6 rounded-3xl bg-white text-slate-950 shadow-2xl hidden lg:block"
              >
                <div className="text-4xl font-black tracking-tighter">472+</div>
                <div className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">Projects Delivered</div>
              </motion.div>

              <motion.div 
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1 }}
                className={`absolute -right-6 bottom-1/4 z-20 p-6 rounded-3xl ${glassClass} hidden lg:block`}
              >
                <div className="text-4xl font-black tracking-tighter text-cyan-400">99%</div>
                <div className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Client Retention</div>
              </motion.div>

              {/* CTA Overlay */}
              <div className="flex flex-wrap justify-center gap-6 mt-12 relative z-20">
                <button 
                  onClick={() => navigateTo('/dashboard')}
                  className={`px-10 py-5 ${blueGradient} text-white rounded-2xl font-black text-xs tracking-widest uppercase hover:scale-105 transition-all shadow-2xl shadow-cyan-500/20 flex items-center gap-3 group`}
                >
                  Get Started
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-10 py-5 bg-white/5 backdrop-blur-md text-white border border-white/10 rounded-2xl font-black text-xs tracking-widest uppercase hover:bg-white hover:text-slate-950 transition-all shadow-sm"
                >
                  View Services
                </button>
              </div>
            </motion.div>
          </div>

          {/* TRUST STRIP (Marquee) */}
          <div className="mt-20 py-10 overflow-hidden relative border-y border-white/5">
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#020617] to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#020617] to-transparent z-10" />
            <motion.div 
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="flex items-center gap-16 whitespace-nowrap"
            >
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex gap-16 items-center">
                  {["Global Founders", "Series A Startups", "Web3 Innovators", "Enterprise Leaders"].map(text => (
                    <span key={text} className="text-slate-500 font-black text-xs uppercase tracking-[0.4em] flex items-center gap-4 opacity-50">
                      <Zap className="w-4 h-4 text-cyan-400" /> {text}
                    </span>
                  ))}
                </div>
              ))}
            </motion.div>
          </div>

          {/* SERVICES SECTION */}
          <div className="mt-40 space-y-16">
            <div className="text-center space-y-4">
              <h2 className="text-5xl md:text-6xl font-black tracking-tighter uppercase">CORE EXPERTISE</h2>
              <p className="text-slate-500 max-w-2xl mx-auto text-lg font-medium">
                Engineered for scalability. Designed for impact.
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
                  className={`group p-10 ${glassClass} rounded-[2rem] hover:bg-white/10 hover:-translate-y-2 transition-all duration-500 cursor-pointer relative overflow-hidden`}
                >
                  <div className={`w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-cyan-500 group-hover:text-white transition-all`}>
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-black mb-4 tracking-tight uppercase">{category.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-8 font-medium">
                    {category.description}
                  </p>
                  <div className="flex items-center text-cyan-400 text-[10px] font-black tracking-widest uppercase group-hover:gap-3 transition-all">
                    EXPLORE <ChevronRight className="w-4 h-4" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* PROCESS SECTION */}
          <div className="mt-48 space-y-24 py-32 bg-white/5 rounded-[4rem] px-8 border border-white/5">
            <div className="text-center space-y-4">
              <h2 className="text-5xl font-black tracking-tighter uppercase">THE PROTOCOL</h2>
              <p className="text-slate-500 font-medium">Precision engineering from concept to scale.</p>
            </div>
            <div className="grid md:grid-cols-4 gap-8 relative">
              {/* Progress Line */}
              <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-[1px] bg-white/10 -z-10" />
              {processSteps.map((step, idx) => (
                <motion.div 
                  whileHover={{ y: -5 }}
                  key={idx} 
                  className="text-center space-y-4"
                >
                  <div className={`w-16 h-16 rounded-2xl ${blueGradient} text-white flex items-center justify-center mx-auto shadow-2xl shadow-cyan-500/30 relative`}>
                    {step.icon}
                  </div>
                  <h4 className="font-black text-xs tracking-widest text-white uppercase">{step.title}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Portfolio Section */}
          <div id="portfolio" className="mt-48 space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="space-y-4">
                <h2 className="text-5xl font-black tracking-tighter uppercase">SELECTED WORKS</h2>
                <p className="text-slate-500 max-w-xl text-lg font-medium">
                  A portfolio of disruptive ventures across tech and creative sectors.
                </p>
              </div>
              
              {/* Filters */}
              <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
                {['All', 'Legal & Business', 'Branding & Marketing', 'Tech & Development'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => { setFilterCategory(cat); setFilterService('All'); }}
                    className={`px-6 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all ${filterCategory === cat ? 'bg-white text-slate-950 shadow-xl' : 'text-slate-500 hover:text-white'}`}
                  >
                    {cat === 'All' ? 'ALL' : cat.split(' & ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {uniqueServices.length > 0 && (
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                <button
                  onClick={() => setFilterService('All')}
                  className={`px-6 py-2 rounded-full text-[10px] font-black tracking-widest border transition-all whitespace-nowrap ${filterService === 'All' ? 'bg-cyan-500 border-cyan-500 text-white' : 'border-white/10 text-slate-500 hover:border-white'}`}
                >
                  ALL SERVICES
                </button>
                {uniqueServices.map(service => (
                  <button
                    key={service}
                    onClick={() => setFilterService(service)}
                    className={`px-6 py-2 rounded-full text-[10px] font-black tracking-widest border transition-all whitespace-nowrap ${filterService === service ? 'bg-cyan-500 border-cyan-500 text-white' : 'border-white/10 text-slate-500 hover:border-white'}`}
                  >
                    {service.toUpperCase()}
                  </button>
                ))}
              </div>
            )}

            {loadingPortfolio ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
              </div>
            ) : filteredPortfolio.length === 0 ? (
              <div className={`text-center py-32 ${glassClass} rounded-[3rem]`}>
                <p className="text-slate-500 font-bold tracking-widest uppercase text-xs">No deployments found matching criteria.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                {filteredPortfolio.map((item, index) => (
                  <motion.div
                    key={item._id}
                    layoutId={item._id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    onClick={() => openProject(item)}
                    className="group rounded-[2.5rem] bg-white/5 border border-white/5 hover:border-cyan-500/50 transition-all overflow-hidden cursor-pointer"
                  >
                    <div className="relative h-80 overflow-hidden">
                      <img 
                        src={item.images?.[0] || 'https://picsum.photos/seed/placeholder/800/600'} 
                        alt={item.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/20 to-transparent opacity-60 transition-opacity group-hover:opacity-40" />
                      <div className="absolute inset-0 flex items-end p-10 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all">
                        <div className="bg-white text-slate-950 px-6 py-3 rounded-2xl text-[10px] font-black tracking-widest uppercase flex items-center gap-3">
                          VIEW PROJECT <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                    <div className="p-10">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400">
                          {item.category}
                        </span>
                      </div>
                      <h3 className="text-3xl font-black text-white mb-4 tracking-tight uppercase">{item.title}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 font-medium">
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
              className="absolute inset-0 bg-slate-950/95 backdrop-blur-xl"
            />
            <motion.div 
              layoutId={selectedProject._id}
              className="relative w-full max-w-6xl bg-[#020617] rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
            >
              <button 
                onClick={closeProject}
                className="absolute top-6 right-6 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full text-slate-900 hover:bg-white transition-all shadow-lg"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Image Gallery */}
              <div className="w-full md:w-3/5 bg-slate-900 relative group">
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
                        className="p-3 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-white hover:bg-cyan-500 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                    </div>
                    <div className="absolute inset-y-0 right-4 flex items-center">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setActiveImageIndex(prev => (prev === selectedProject.images.length - 1 ? 0 : prev + 1)); }}
                        className="p-3 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-white hover:bg-cyan-500 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </div>
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                      {selectedProject.images.map((_, idx) => (
                        <button 
                          key={idx}
                          onClick={(e) => { e.stopPropagation(); setActiveImageIndex(idx); }}
                          className={`w-2 h-2 rounded-full transition-all ${activeImageIndex === idx ? 'bg-cyan-400 w-8' : 'bg-white/30'}`}
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
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400 mb-4 block">
                      {selectedProject.category}
                    </span>
                    <h2 className="text-4xl md:text-5xl font-black text-white leading-tight uppercase tracking-tighter">
                      {selectedProject.title}
                    </h2>
                  </div>

                  {selectedProject.serviceId && (
                    <div className="flex items-center gap-4 p-6 bg-white/5 rounded-3xl border border-white/10">
                      <div className="w-12 h-12 bg-cyan-500/20 rounded-2xl flex items-center justify-center text-cyan-400">
                        <Rocket className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">DEPLOYED TECH</p>
                        <p className="text-md font-bold text-white uppercase">{selectedProject.serviceId.name}</p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">ANALYSIS & SCOPE</h4>
                    <p className="text-slate-400 leading-relaxed font-medium">
                      {selectedProject.description}
                    </p>
                  </div>

                  <div className="flex flex-col gap-4 pt-8">
                    {selectedProject.link && (
                      <a 
                        href={selectedProject.link}
                        className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-slate-950 rounded-2xl font-black text-[10px] tracking-widest uppercase hover:bg-cyan-400 transition-all shadow-2xl group"
                      >
                        LAUNCH PROJECT
                        <ExternalLink className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </a>
                    )}
                    {selectedProject.serviceId && (
                      <button 
                        onClick={() => setIsRequestModalOpen(true)}
                        className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-cyan-500 text-white rounded-2xl font-black text-[10px] tracking-widest uppercase hover:bg-cyan-600 transition-all shadow-2xl shadow-cyan-500/20 group"
                      >
                        SCALE SIMILAR
                        <Rocket className="w-5 h-5 group-hover:scale-110 transition-transform" />
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
      <footer className="mt-40 border-t border-white/5 bg-[#020617] py-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-cyan-500 rounded flex items-center justify-center">
              <Rocket className="w-3 h-3 text-white" />
            </div>
            <span className="font-black text-lg text-white uppercase tracking-tighter">Elion Tech</span>
          </div>
          <p className="text-slate-500 text-[10px] font-bold tracking-[0.2em] uppercase">
            © 2026 Elion Tech. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-slate-500 hover:text-cyan-400 transition-colors text-[10px] font-black tracking-widest">TWITTER</a>
            <a href="#" className="text-slate-500 hover:text-cyan-400 transition-colors text-[10px] font-black tracking-widest">LINKEDIN</a>
            <a href="#" className="text-slate-500 hover:text-cyan-400 transition-colors text-[10px] font-black tracking-widest">GITHUB</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
