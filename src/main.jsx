import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/index.css';

const redirectedPath = window.sessionStorage.getItem('everest_redirect_path');

if (redirectedPath && window.location.pathname === '/') {
  window.sessionStorage.removeItem('everest_redirect_path');
  window.history.replaceState(null, '', redirectedPath);
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
