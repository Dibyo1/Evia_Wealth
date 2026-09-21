import React, { StrictMode, Component, ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught application error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '32px', backgroundColor: '#09090b', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
          <div style={{ maxWidth: '600px', margin: '40px auto', background: '#18181b', padding: '24px', borderRadius: '16px', border: '1px solid #27272a' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '12px', color: '#f87171' }}>Something went wrong</h2>
            <pre style={{ fontSize: '13px', background: '#09090b', padding: '12px', borderRadius: '8px', overflowX: 'auto', color: '#e4e4e7', marginBottom: '16px' }}>
              {this.state.error?.message || String(this.state.error)}
            </pre>
            <button
              onClick={() => window.location.reload()}
              style={{ padding: '10px 20px', backgroundColor: '#34d399', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '9999px', cursor: 'pointer' }}
            >
              Reload Preview
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const rootEl = document.getElementById('root');
if (rootEl) {
  createRoot(rootEl).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>
  );
}

