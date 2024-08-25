import React from 'react';
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css';
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from './context/ThemeContext';


ReactDOM.createRoot(document.getElementById('root')).render(
  <>
  <ThemeProvider>
    <ToastContainer />
      <App />
  </ThemeProvider>
  </>
)
