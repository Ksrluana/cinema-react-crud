import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import type { Sessao, Filme, Sala } from '../types';

export function SessaoLista() {
  const [sessoes, setSessoes] = useState<Sessao[]>([]);
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [salas, setSalas] = useState<Sala[]>([]);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        // Buscamos tudo para poder cruzar os dados
        const [resSessoes, resFilmes, resSalas] = await Promise.all([
            axios.get('http://localhost:3000/sessoes'),
            axios.get('http://localhost:3000/filmes'),
            axios.get('http://localhost:3000/salas')
        ]);
        
        setSessoes(resSessoes.data);
        setFilmes(resFilmes.data);
        setSalas(resSalas.data);
      } catch (error) {
        console.error("Erro ao carregar dados", error);
      }
    };
    carregarDados();
  }, []);

  // Função auxiliar para achar o nome do filme pelo ID
  const getNomeFilme = (id: string) => {
      const filme = filmes.find(f => f.id === id);
      return filme ? filme.titulo : 'Filme não encontrado';
  };

  // Função auxiliar para achar o número da sala pelo ID
  const getNumeroSala = (id: string) => {
      const sala = salas.find(s => s.id === id);
      return sala ? `Sala ${sala.numero}` : 'Sala n/d';
  };

  const handleDelete = async (id: string) => {
      if(confirm("Cancelar esta sessão?")) {
          await axios.delete(`http://localhost:3000/sessoes/${id}`);
          setSessoes(prev => prev.filter(s => s.id !== id));
      }
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Gestão de Sessões</h1>
        <Link to="/sessoes/nova" className="btn btn-primary">Agendar Sessão</Link>
      </div>

      <div className="list-group">
        {sessoes.map(sessao => (
            <div key={sessao.id} className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                <div>
                    <h5 className="mb-1">{getNomeFilme(sessao.filmeId)}</h5>
                    <p className="mb-1 text-muted">
                        {getNumeroSala(sessao.salaId)} | {new Date(sessao.dataHora).toLocaleString('pt-BR')}
                    </p>
                </div>
                <div>
                     <button className="btn btn-sm btn-success me-2">
                        <i className="bi bi-ticket-perforated"></i> Vender
                     </button>
                     <button onClick={() => handleDelete(sessao.id)} className="btn btn-sm btn-outline-danger">
                        <i className="bi bi-trash"></i>
                     </button>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
}