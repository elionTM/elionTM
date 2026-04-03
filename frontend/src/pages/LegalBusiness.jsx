import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Scale, FileText, Landmark, ArrowLeft, ChevronRight } from 'lucide-react';
import RequestModal from '../components/RequestModal';

import { API_URL } from '../config';
const LegalBusiness = () => {
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
          const filtered = data.filter(s => s.category === 'Legal & Business');
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
    if (name.toLowerCase().includes('compliance')) return <Scale className="w-6 h-6 text-emerald-600" />;
    if (name.toLowerCase().includes('contract')) return <FileText className="w-6 h-6 text-emerald-600" />;
    return <Landmark className="w-6 h-6 text-emerald-600" />;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button 
            onClick={() => navigateTo('/')}
            className="flex items-center gap-2 text-slate-600 hover:text-emerald-600 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </button>
          <div className="font-bold text-xl tracking-tight text-slate-900">Legal & Business</div>
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
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-emerald-600" />
              </div>
              <h1 className="text-5xl font-bold text-slate-900 leading-tight">
                Secure your <span className="text-emerald-600">foundation</span> with expert guidance.
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed">
                We provide the legal and business framework necessary for your company to operate safely and grow sustainably.
              </p>
            </motion.div>
            <div className="relative">
              <img 
                src="https://picsum.photos/seed/legal/800/600" 
                alt="Legal" 
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
                    <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-6">
                      {getIcon(service.name)}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{service.name}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-6">
                      {service.description}
                    </p>
                  </div>
                  <button 
                    onClick={() => handleRequest(service)}
                    className="w-full py-3 bg-emerald-50 text-emerald-600 rounded-2xl font-bold text-sm hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center gap-2 group"
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

export default LegalBusiness;

