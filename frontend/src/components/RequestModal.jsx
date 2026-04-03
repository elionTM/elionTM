import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Rocket, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';

const RequestModal = ({ isOpen, onClose, service }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    details: '',
    clientPhone: user?.phoneNumber || ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/api/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: service._id,
          clientName: user.name,
          clientEmail: user.email,
          clientPhone: formData.clientPhone,
          details: formData.details
        }),
        credentials: 'include'
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
          setSuccess(false);
          setFormData({ details: '' });
        }, 3000);
      }
    } catch (error) {
      console.error('Error submitting request:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden"
        >
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="p-8 md:p-10">
            {!user ? (
              <div className="text-center space-y-6 py-4">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto">
                  <Rocket className="w-8 h-8 text-blue-600" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-slate-900">Login Required</h2>
                  <p className="text-slate-500">Please login or create an account to request this service.</p>
                </div>
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => navigateTo('/login')}
                    className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                  >
                    <LogIn className="w-5 h-5" /> Login to Continue
                  </button>
                  <button 
                    onClick={() => navigateTo('/signup')}
                    className="w-full py-4 bg-white text-slate-900 border border-slate-200 rounded-2xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                  >
                    <UserPlus className="w-5 h-5" /> Create New Account
                  </button>
                </div>
              </div>
            ) : success ? (
              <div className="text-center space-y-6 py-8">
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto">
                  <Send className="w-8 h-8 text-emerald-600" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-slate-900">Request Sent!</h2>
                  <p className="text-slate-500">We've received your request for <strong>{service.name}</strong>. Our team will get back to you shortly.</p>
                </div>
                <p className="text-xs text-slate-400">Closing in 3 seconds...</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Request Service</h2>
                  <p className="text-slate-500 text-sm">You're requesting: <span className="font-bold text-slate-900">{service.name}</span></p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Phone Number</label>
                    <input 
                      type="tel"
                      required
                      value={formData.clientPhone}
                      onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                      placeholder="Your phone number"
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Project Details</label>
                    <textarea 
                      required
                      value={formData.details}
                      onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                      placeholder="Tell us about your project requirements..."
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all min-h-[150px] resize-none"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Sending...' : (
                      <>
                        <Send className="w-5 h-5" /> Send Request
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default RequestModal;
