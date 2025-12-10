import { useState, useEffect } from 'react';
import { z } from 'zod';
import './Salas.css';

// 1. Schema Zod (Simplificado para evitar erro de versão)
const salaSchema = z.object({
  // Removemos o objeto de erro interno e confiamos no .gt(0)
  numero: z.number().gt(0, "Informe um número válido para a sala"),
  capacidade: z.number().gt(0, "Informe uma capacidade válida")
});

interface Sala { id: string; numero: number; capacidade: number; }

function Salas() {
  const [salas, setSalas] = useState<Sala[]>([]);
  const [form, setForm] = useState({ numero: '', capacidade: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch('http://localhost:3000/salas').then(res => res.json()).then(setSalas);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) {
        const newErrors = { ...errors };
        delete newErrors[name];
        setErrors(newErrors);
    }
  };

  const salvarSala = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dados = salaSchema.parse({
        numero: Number(form.numero),
        capacidade: Number(form.capacidade)
      });

      const novaSala = { id: String(Date.now()), ...dados };

      const res = await fetch('http://localhost:3000/salas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novaSala)
      });

      if (res.ok) {
        setSalas([...salas, novaSala]);
        setForm({ numero: '', capacidade: '' });
        setErrors({});
        alert("Sala salva com sucesso!");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.issues.forEach(issue => fieldErrors[String(issue.path[0])] = issue.message);
        setErrors(fieldErrors);
      }
    }
  };

  const excluirSala = async (id: string) => {
    const checkRes = await fetch(`http://localhost:3000/sessoes?salaId=${id}`);
    const sessoesVinculadas = await checkRes.json();

    if (sessoesVinculadas.length > 0) {
      alert(`Impossível excluir! Sala em uso por ${sessoesVinculadas.length} sessões.`);
      return;
    }

    if (confirm("Excluir esta sala?")) {
      await fetch(`http://localhost:3000/salas/${id}`, { method: 'DELETE' });
      setSalas(salas.filter(s => s.id !== id));
    }
  };

  return (
    <div className="container mt-4 text-light">
      <h2 className="mb-4"><i className="bi bi-door-open"></i> Gerenciar Salas</h2>
      
      <form onSubmit={salvarSala} className="row g-3 bg-dark p-4 rounded mb-4 border border-secondary">
        <div className="col-md-6">
          <label className="form-label">Número da Sala</label>
          <input 
            type="number"
            name="numero"
            className={`form-control ${errors.numero ? 'is-invalid' : ''}`} 
            value={form.numero} 
            onChange={handleChange} 
          />
          <div className="invalid-feedback">{errors.numero}</div>
        </div>

        <div className="col-md-6">
          <label className="form-label">Capacidade (Pessoas)</label>
          <input 
            type="number"
            name="capacidade"
            className={`form-control ${errors.capacidade ? 'is-invalid' : ''}`} 
            value={form.capacidade} 
            onChange={handleChange} 
          />
          <div className="invalid-feedback">{errors.capacidade}</div>
        </div>

        <div className="col-12 mt-3">
          <button type="submit" className="btn btn-danger">
            <i className="bi bi-save me-1"></i> Salvar
          </button>
        </div>
      </form>

      <div className="row">
        {salas.map(sala => (
          <div key={sala.id} className="col-md-4 mb-3">
            <div className="card bg-secondary text-white">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                    <h5 className="card-title mb-0">Sala {sala.numero}</h5>
                    <small className="text-warning"><i className="bi bi-people-fill m-1"></i> {sala.capacidade} Lugares</small>
                </div>
                <button onClick={() => excluirSala(sala.id)} className="btn btn-sm btn-dark text-danger m-3">
                    <i className="bi bi-trash m-1"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Salas;