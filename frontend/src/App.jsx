import React, { useState } from 'react';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import BrandingMarketing from './pages/BrandingMarketing';
import TechDevelopment from './pages/TechDevelopment';
import LegalBusiness from './pages/LegalBusiness';
import Academy from './pages/Academy';
import AcademyCourse from './pages/AcademyCourse';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Management from './pages/Management';
import { AuthProvider, useAuth } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';

const AppContent = () => {
  const { user, loading } = useAuth();
  const [path, setPath] = useState(window.location.pathname);

  React.useEffect(() => {
    const handleLocationChange = () => {
      setPath(window.location.pathname);
    };
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const renderPage = () => {
    if (loading) return null;

    // Protected routes
    if (!user && (path === '/dashboard' || path === '/management')) {
      navigateTo('/login');
      return <Login />;
    }

    if (path === '/management' && user?.role !== 'admin') {
      navigateTo('/dashboard');
      return <Dashboard />;
    }

    if (path.startsWith('/academy/course/')) {
      return <AcademyCourse slug={path.replace('/academy/course/', '')} />;
    }

    switch (path) {
      case '/login':
        return user ? <Dashboard /> : <Login />;
      case '/signup':
        return user ? <Dashboard /> : <Signup />;
      case '/dashboard':
        return <Dashboard />;
      case '/management':
        return <Management />;
      case '/branding-marketing':
        return <BrandingMarketing />;
      case '/tech-development':
        return <TechDevelopment />;
      case '/legal-business':
        return <LegalBusiness />;
      case '/academy':
        return <Academy />;
      default:
        return <Home />;
    }
  };

  return <div className="app-page min-h-screen">{renderPage()}</div>;
};

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
}
