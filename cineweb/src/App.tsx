import 'bootstrap/dist/css/bootstrap.min.css'; // Estilo do Bootstrap
import 'bootstrap-icons/font/bootstrap-icons.css'; // Ícones
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Filmes from './components/Filmes';
import Salas from './components/Salas';
import Sessoes from './components/Sessoes';

function App() {
  return (
    <BrowserRouter>
      {/* O Header fica fora das rotas para aparecer em todas as páginas */}
      <Header />
      
      <main style={{ padding: '20px', color: 'white', minHeight: '80vh' }}>
        <Routes>
          {/* Rota da Página Inicial (Dashboard) */}
          <Route path="/" element={<Home />} />
          
          {/* Rotas dos Módulos de Gerenciamento */}
          <Route path="/filmes" element={<Filmes />} />
          <Route path="/salas" element={<Salas />} />
          <Route path="/sessoes" element={<Sessoes />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;