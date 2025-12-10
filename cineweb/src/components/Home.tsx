import { useState, useEffect } from 'react';
import './Home.css';

function Home() {
  const [qtdFilmes, setQtdFilmes] = useState(0);
  const [qtdSalas, setQtdSalas] = useState(0);
  const [qtdSessoes, setQtdSessoes] = useState(0);

  useEffect(() => {
    // Agora buscamos direto do Servidor (API), e não mais do localStorage
    
    // 1. Conta Filmes
    fetch('http://localhost:3000/filmes')
      .then(res => res.json())
      .then(dados => setQtdFilmes(dados.length))
      .catch(err => console.error(err));

    // 2. Conta Salas
    fetch('http://localhost:3000/salas')
      .then(res => res.json())
      .then(dados => setQtdSalas(dados.length))
      .catch(err => console.error(err));

    // 3. Conta Sessões
    fetch('http://localhost:3000/sessoes')
      .then(res => res.json())
      .then(dados => setQtdSessoes(dados.length))
      .catch(err => console.error(err));

  }, []);

  return (
    <div className="home-container">
      <div className="welcome-section">
        <h2>Bem-vindo ao CineWeb!</h2>
        <p className="text-secondary">Visão geral do seu cinema.</p>
      </div>

      <div className="dashboard-grid">
        {/* Card Filmes */}
        <div className="card">
          <div className="card-icon">🎬</div>
          <div className="card-info">
            <h3>Filmes</h3>
            <span className="card-number">{qtdFilmes}</span>
            <span className="card-sub">Cadastrados</span>
          </div>
        </div>

        {/* Card Salas */}
        <div className="card">
          <div className="card-icon">🚪</div>
          <div className="card-info">
            <h3>Salas</h3>
            <span className="card-number">{qtdSalas}</span>
            <span className="card-sub">Disponíveis</span>
          </div>
        </div>

        {/* Card Sessões */}
        <div className="card">
          <div className="card-icon">🎟️</div>
          <div className="card-info">
            <h3>Sessões</h3>
            <span className="card-number">{qtdSessoes}</span>
            <span className="card-sub">Agendadas</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;