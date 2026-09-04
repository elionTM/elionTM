import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="workspace-shell min-h-screen flex items-center justify-center p-4">
          <div className="glass-panel p-8 rounded-[2rem] max-w-md w-full text-center">
            <h1 className="text-2xl font-bold text-[#ff9b78] mb-4">Something went wrong</h1>
            <p className="text-slate-300 mb-6">
              An unexpected error occurred. Please try refreshing the page or contact support if the problem persists.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="glass-button bg-[#ff9b78] text-[#061413] px-6 py-3 rounded-xl font-bold hover:bg-white transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
