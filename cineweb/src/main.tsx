import 'bootstrap/dist/css/bootstrap.min.css'; // Estilo do Bootstrap
import 'bootstrap-icons/font/bootstrap-icons.css'; // Ícones
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css' // (Ou sem essa linha se você apagou o arquivo)

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)