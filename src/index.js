import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
 import App from './App';
import { ToastContainer } from 'react-toastify';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ToastContainer position="top-right" autoClose={5000} hideProgressBar={true} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable
pauseOnHover theme="dark" />
    <App />
  </React.StrictMode>
);