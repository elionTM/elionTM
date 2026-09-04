import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Rocket, ArrowLeft } from 'lucide-react';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();

  const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await signup(name, email, password);
    if (result.success) {
      navigateTo('/dashboard');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="auth-shell min-h-screen bg-[#071126] flex items-center justify-center p-6">
      <button 
        onClick={() => navigateTo('/')}
        className="absolute top-8 left-8 flex items-center gap-2 text-slate-300 hover:text-cyan-400 transition-colors font-medium"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </button>

      <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl md:grid-cols-2">
        <div className="relative hidden min-h-[600px] md:block"><img src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1000&q=85" alt="People sharing ideas around a table" className="human-image absolute inset-0 h-full w-full" referrerPolicy="no-referrer" /><div className="absolute inset-0 bg-gradient-to-t from-[#071126] via-transparent to-cyan-950/10" /><div className="absolute bottom-10 left-10 right-10"><p className="eyebrow text-cyan-300">Make room for the next idea</p><p className="mt-3 text-3xl font-bold leading-tight text-white">The work gets better when more perspectives are in the room.</p></div></div>
        <div className="bg-white p-8 md:p-12">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mb-4">
            <Rocket className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Start with an idea</h1>
          <p className="text-slate-500">Create your Elion account and let’s make progress.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
              placeholder="John Doe"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
              placeholder="name@company.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 disabled:opacity-50"
          >
            {loading ? 'Setting things up...' : 'Create your account'}
          </button>
        </form>

        <p className="mt-8 text-center text-slate-500 text-sm">
          Already have an account?{' '}
          <button onClick={() => navigateTo('/login')} className="text-blue-600 font-bold hover:underline">
            Login
          </button>
        </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
