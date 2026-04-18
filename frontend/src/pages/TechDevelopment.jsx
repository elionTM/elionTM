import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Rocket, Code, Database, Cpu, ArrowLeft, ChevronRight } from 'lucide-react';
import RequestModal from '../components/RequestModal';

import { API_URL } from '../config';
const TechDevelopment = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`${API_URL}/api/services`, { credentials: 'include' });
        const data = await response.json();
        if (Array.isArray(data)) {
          const filtered = data.filter(s => s.category === 'Tech & Development');
          setServices(filtered);
        } else {
          console.error('Expected array of services, got:', data);
          setServices([]);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const handleRequest = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const glassClass = "bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]";

  const getIcon = (name) => {
    if (name.toLowerCase().includes('development') || name.toLowerCase().includes('stack')) return <Code className="w-6 h-6 text-cyan-400" />;
    if (name.toLowerCase().includes('cloud') || name.toLowerCase().includes('infrastructure')) return <Database className="w-6 h-6 text-cyan-400" />;
    return <Cpu className="w-6 h-6 text-cyan-400" />;
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-cyan-500/30 selection:text-cyan-100 overflow-x-hidden">
      {/* Background Orbs */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-900/20 blur-[160px] rounded-full" />
      </div>

      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button 
            onClick={() => navigateTo('/')}
            className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors text-[10px] font-black tracking-widest uppercase"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </button>
          <div className="font-black text-xl tracking-tighter text-white uppercase">Tech & Development</div>
        </div>
      </nav>

      <main className="pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center mb-32">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-cyan-400 text-[10px] font-black uppercase tracking-[0.3em]">
                High-Performance Engineering
              </div>
              <h1 className="text-6xl md:text-7xl font-black text-white leading-[0.9] tracking-tighter uppercase">
                Build the <span className="text-transparent bg-clip-text bg-gradient-to-b from-cyan-400 to-blue-600">future</span>
              </h1>
              <p className="text-lg text-slate-400 leading-relaxed max-w-xl font-medium">
                We engineer disruptive technology architectures that enable enterprise-grade scalability and unmatched security.
              </p>
            </motion.div>
            <div className="relative group">
              <div className="absolute -inset-4 bg-blue-500/20 rounded-[3rem] blur-3xl opacity-50" />
              <div className="relative rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl">
                <img 
                  src="https://picsum.photos/seed/tech-solutions/1200/800" 
                  alt="Tech Solutions" 
                  className="w-full object-cover aspect-video transition-transform duration-1000 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-60" />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-3 text-center py-12 text-slate-500">Loading services...</div>
            ) : services.length === 0 ? (
              <div className="col-span-3 text-center py-12 text-slate-500">No services found in this category.</div>
            ) : (
              services.map((service, index) => (
                <motion.div
                  key={service._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-10 ${glassClass} rounded-[2rem] hover:bg-white/10 hover:-translate-y-2 transition-all duration-500 flex flex-col justify-between`}
                >
                  <div>
                    <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center mb-8">
                      {getIcon(service.name)}
                    </div>
                    <h3 className="text-xl font-black mb-4 tracking-tight uppercase">{service.name}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-8 font-medium">
                      {service.description}
                    </p>
                  </div>
                  <button 
                    onClick={() => handleRequest(service)}
                    className="w-full py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-[10px] tracking-widest uppercase hover:bg-white hover:text-slate-950 transition-all flex items-center justify-center gap-3 group"
                  >
                    INITIALIZE BUILD <Rocket className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </button>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </main>

      <RequestModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        service={selectedService}
      />
    </div>
  );
};

export default TechDevelopment;
