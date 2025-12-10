import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import type { Filme } from '../types';

export function FilmeLista() {
  const [filmes, setFilmes] = useState<Filme[]>([]);

  // CORREÇÃO: A função de carregar fica DENTRO do useEffect
  useEffect(() => {
    const carregarFilmes = async () => {
      try {
        const response = await axios.get('http://localhost:3000/filmes');
        setFilmes(response.data);
      } catch (error) {
        console.error("Erro ao buscar filmes", error);
      }
    };

    carregarFilmes();
  }, []); // Array vazio = roda apenas uma vez ao iniciar

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este filme?")) {
      try {
        await axios.delete(`http://localhost:3000/filmes/${id}`);
        
        // CORREÇÃO: Atualiza a lista localmente (filtra removendo o deletado)
        // Isso evita ter que chamar 'carregarFilmes' novamente
        setFilmes(listaAtual => listaAtual.filter(filme => filme.id !== id));
        
      } catch (error) {
        console.error("Erro ao excluir", error);
        alert("Erro ao excluir o filme.");
      }
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Catálogo de Filmes</h1>
        <Link to="/filmes/novo" className="btn btn-primary">
          <i className="bi bi-plus-circle me-2"></i>Novo Filme
        </Link>
      </div>

      <div className="row">
        {filmes.map(filme => (
          <div key={filme.id} className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{filme.titulo}</h5>
                <h6 className="card-subtitle mb-2 text-muted">{filme.genero} - {filme.duracao} min</h6>
                <p className="card-text text-truncate">{filme.sinopse}</p>
                <span className="badge bg-secondary">{filme.classificacao}</span>
              </div>
              <div className="card-footer bg-transparent border-top-0 d-flex justify-content-end gap-2">
                <button 
                  onClick={() => handleDelete(filme.id)} 
                  className="btn btn-outline-danger btn-sm"
                  title="Excluir Filme"
                >
                  <i className="bi bi-trash"></i> Excluir
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}