import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import type { Sala } from '../types';

export function SalaLista() {
  const [salas, setSalas] = useState<Sala[]>([]);

  useEffect(() => {
    const carregarSalas = async () => {
      try {
        const response = await axios.get('http://localhost:3000/salas');
        setSalas(response.data);
      } catch (error) {
        console.error("Erro ao carregar salas", error);
      }
    };
    carregarSalas();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Excluir esta sala?")) {
      try {
        await axios.delete(`http://localhost:3000/salas/${id}`);
        setSalas(lista => lista.filter(sala => sala.id !== id));
      } catch (error) {
        // CORREÇÃO AQUI: Usamos o 'error' no console para o aviso sumir
        console.error("Erro ao excluir sala", error);
        alert("Erro ao excluir");
      }
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Gerenciar Salas</h1>
        <Link to="/salas/nova" className="btn btn-primary">
          <i className="bi bi-plus-circle me-2"></i>Nova Sala
        </Link>
      </div>

      <table className="table table-striped table-hover shadow-sm">
        <thead className="table-dark">
          <tr>
            <th># Número</th>
            <th>Capacidade</th>
            <th className="text-end">Ações</th>
          </tr>
        </thead>
        <tbody>
          {salas.map(sala => (
            <tr key={sala.id}>
              <td>Sala {sala.numero}</td>
              <td>{sala.capacidade} lugares</td>
              <td className="text-end">
                <button 
                  onClick={() => handleDelete(sala.id)} 
                  className="btn btn-sm btn-outline-danger"
                  title="Excluir Sala"
                >
                  <i className="bi bi-trash"></i> Excluir
                </button>
              </td>
            </tr>
          ))}
          {salas.length === 0 && (
            <tr>
              <td colSpan={3} className="text-center text-muted py-4">
                Nenhuma sala cadastrada.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}