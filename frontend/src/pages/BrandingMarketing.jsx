import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Layout, Palette, Megaphone, Target, ArrowLeft, ChevronRight } from 'lucide-react';
import RequestModal from '../components/RequestModal';
import logo from '../elion-logo.png';

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
    <div className="min-h-screen bg-[#F8FAFC] font-sans">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button 
            onClick={() => navigateTo('/')}
            className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </button>
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigateTo('/')}>
            <div className="w-8 h-8 flex items-center justify-center">
              <img src={logo} alt="Elion Tech" className="w-full h-full object-contain" />
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-900">Branding & Marketing</span>
          </div>
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
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                <Layout className="w-6 h-6 text-blue-600" />
              </div>
              <h1 className="text-5xl font-bold text-slate-900 leading-tight">
                Elevate your brand with <span className="text-blue-600">creative</span> strategies.
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed">
                We help businesses define their unique identity and connect with their customers through impactful design and strategic marketing.
              </p>
            </motion.div>
            <div className="relative">
              <img 
                src="https://picsum.photos/seed/branding/800/600" 
                alt="Branding" 
                className="rounded-3xl shadow-2xl w-full object-cover aspect-video"
                referrerPolicy="no-referrer"
              />
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
                  className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                      {getIcon(service.name)}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{service.name}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-6">
                      {service.description}
                    </p>
                  </div>
                  <button 
                    onClick={() => handleRequest(service)}
                    className="w-full py-3 bg-blue-50 text-blue-600 rounded-2xl font-bold text-sm hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2 group"
                  >
                    Request Service <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
