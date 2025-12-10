import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <header className="cabecalho">
      <div className="logo">
        <h1>CineWeb</h1>
      </div>
      <nav>
        <ul>
          {/* O Link troca a página sem recarregar tudo */}
          <li><Link to="/">Home</Link></li>
          <li><Link to="/filmes">Gerenciar Filmes</Link></li>
          <li><Link to="/salas">Gerenciar Salas</Link></li>
          <li><Link to="/sessoes">Gerenciar Sessões</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;