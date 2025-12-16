import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log("Initializing React App...");

try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error("Could not find root element 'root'");
  }

  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error("Failed to mount React app:", error);
  document.body.innerHTML = `<div style="padding: 20px; color: red;"><h1>Application Error</h1><p>${error instanceof Error ? error.message : String(error)}</p></div>`;
}