import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { initializeFirebase } from './services/firebase';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

// Show initial loading state
root.render(
  <div style={{
    height: '100vh',
    background: '#020617',
    color: '#0ea5e9',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'monospace'
  }}>
    <div style={{ fontSize: '24px', fontWeight: 'bold' }}>INITIALIZING SECURITY PROTOCOLS...</div>
    <div style={{ marginTop: '20px', fontSize: '12px', opacity: 0.7 }}>ESTABLISHING BACKEND UPLINK</div>
  </div>
);

const init = async () => {
  try {
    await initializeFirebase();
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error: any) {
    console.error("Failed to initialize app:", error);
    root.render(
      <div style={{ color: 'white', padding: '40px', textAlign: 'center', background: '#1a1a1a', height: '100vh' }}>
        <h1 style={{ color: 'red' }}>Startup Error</h1>
        <p>Could not connect to backend services.</p>
        <pre style={{ textAlign: 'left', background: '#333', padding: '20px', borderRadius: '5px', overflow: 'auto' }}>
          {error.message || JSON.stringify(error)}
        </pre>
        <p>Ensure Backend is running on port 3000</p>
        <button onClick={() => window.location.reload()} style={{ padding: '10px 20px', marginTop: '20px', cursor: 'pointer' }}>Retry</button>
      </div>
    );
  }
};

init();
