import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Layout, Palette, Megaphone, Target, ArrowLeft, ChevronRight } from 'lucide-react';
import RequestModal from '../components/RequestModal';

import { API_URL } from '../config';
const BrandingMarketing = () => {
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
          const filtered = data.filter(s => s.category === 'Branding & Marketing');
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

  const getIcon = (name) => {
    if (name.toLowerCase().includes('logo') || name.toLowerCase().includes('identity')) return <Palette className="w-6 h-6 text-blue-600" />;
    if (name.toLowerCase().includes('marketing') || name.toLowerCase().includes('seo')) return <Megaphone className="w-6 h-6 text-blue-600" />;
    return <Target className="w-6 h-6 text-blue-600" />;
  };

  return (
    <div className="public-depth min-h-screen overflow-x-hidden bg-[#071126] font-sans text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#071126]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button 
            onClick={() => navigateTo('/')}
            className="flex items-center gap-2 text-slate-300 hover:text-cyan-400 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </button>
          <div className="font-bold text-xl tracking-tight text-white">Branding & Marketing</div>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="w-12 h-12 bg-cyan-500/15 rounded-2xl flex items-center justify-center">
                <Layout className="w-6 h-6 text-blue-600" />
              </div>
              <h1 className="text-5xl font-bold text-white leading-tight">
                Give your brand a voice people <span className="text-cyan-400">remember.</span>
              </h1>
              <p className="text-lg text-slate-300 leading-relaxed">
                We find the honest idea at the heart of your business, then turn it into a brand people can recognise, trust and choose.
              </p>
            </motion.div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1200&q=85" 
                alt="A designer arranging printed brand materials on a desk" 
                className="human-image rounded-[2rem] shadow-2xl w-full object-cover aspect-video"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-3 text-center py-12 text-slate-400">Finding the right ways to tell your story...</div>
            ) : services.length === 0 ? (
              <div className="col-span-3 text-center py-12 text-slate-400">We’re shaping this part of the studio. Check back soon.</div>
            ) : (
              services.map((service, index) => (
                <motion.div
                  key={service._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-panel glass-panel-hover p-8 rounded-3xl flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 bg-cyan-500/15 rounded-xl flex items-center justify-center mb-6">
                      {getIcon(service.name)}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{service.name}</h3>
                    <p className="text-slate-300 text-sm leading-relaxed mb-6">
                      {service.description}
                    </p>
                  </div>
                  <button 
                    onClick={() => handleRequest(service)}
                    className="w-full py-3 bg-white/5 border border-white/10 text-white rounded-2xl font-bold text-sm hover:bg-cyan-400 hover:text-slate-950 transition-all flex items-center justify-center gap-2 group"
                  >
                    Start a conversation <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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

export default BrandingMarketing;

