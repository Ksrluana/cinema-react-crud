import { useState, useEffect } from 'react';
import { z } from 'zod';
import './Filmes.css';

// 1. Schema Atualizado com Classificação e Datas
const filmeSchema = z.object({
  titulo: z.string().min(1, "O Título é obrigatório."),
  genero: z.string().min(1, "O Gênero é obrigatório."),
  duracao: z.number().gt(0, "A Duração deve ser maior que 0."),
  sinopse: z.string().min(10, "A Sinopse deve ter no mínimo 10 caracteres."),
  classificacao: z.string().min(1, "Selecione a classificação."), // Novo
  datasExibicao: z.string().min(1, "Informe as datas de exibição.") // Novo
});

interface Filme { 
    id: string; 
    titulo: string; 
    genero: string; 
    duracao: number; 
    sinopse: string;
    classificacao: string; // Novo
    datasExibicao: string; // Novo
}

function Filmes() {
  const [filmes, setFilmes] = useState<Filme[]>([]);
  // Estado do formulário atualizado
  const [form, setForm] = useState({ titulo: '', genero: '', duracao: '', sinopse: '', classificacao: '', datasExibicao: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch('http://localhost:3000/filmes')
      .then(res => res.json())
      .then(dados => setFilmes(dados))
      .catch(err => console.error("Erro ao buscar filmes:", err));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  const salvarFilme = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dadosValidados = filmeSchema.parse({
        ...form,
        duracao: Number(form.duracao)
      });

      const novoFilme = { id: String(Date.now()), ...dadosValidados };
      
      const resposta = await fetch('http://localhost:3000/filmes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoFilme)
      });

      if (resposta.ok) {
        setFilmes([...filmes, novoFilme]);
        setForm({ titulo: '', genero: '', duracao: '', sinopse: '', classificacao: '', datasExibicao: '' });
        setErrors({});
        alert("Filme salvo na API com sucesso!");
      }

    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.issues.forEach(issue => {
          const key = String(issue.path[0]);
          fieldErrors[key] = issue.message;
        });
        setErrors(fieldErrors);
      }
    }
  };

const excluirFilme = async (id: string) => {
    // 1. Antes de excluir, verifica se tem sessões usando esse filme
    const checkRes = await fetch(`http://localhost:3000/sessoes?filmeId=${id}`);
    const sessoesVinculadas = await checkRes.json();

    if (sessoesVinculadas.length > 0) {
      // 2. Se tiver sessões, BLOQUEIA e avisa o usuário
      alert(`Não é possível excluir! Existem ${sessoesVinculadas.length} sessões agendadas com este filme.`);
      return; // Para a função aqui, não deixa deletar
    }

    // 3. Se não tiver nada, pergunta se tem certeza
    if (confirm("Tem certeza que deseja excluir este filme?")) {
      await fetch(`http://localhost:3000/filmes/${id}`, { method: 'DELETE' });
      setFilmes(filmes.filter(filme => filme.id !== id));
    }
  };

  return (
    <div className="container mt-4 text-light">
      <h2 className="mb-4"><i className="bi bi-film"></i> Gerenciar Filmes</h2>
      
      <form onSubmit={salvarFilme} className="row g-3 bg-dark p-4 rounded mb-4 border border-secondary">
        {/* Título */}
        <div className="col-md-6">
          <label className="form-label">Título</label>
          <input name="titulo" className={`form-control ${errors.titulo ? 'is-invalid' : ''}`} value={form.titulo} onChange={handleChange} />
          <div className="invalid-feedback">{errors.titulo}</div>
        </div>
        
        {/* Gênero */}
        <div className="col-md-3">
          <label className="form-label">Gênero</label>
          <input name="genero" className={`form-control ${errors.genero ? 'is-invalid' : ''}`} value={form.genero} onChange={handleChange} />
          <div className="invalid-feedback">{errors.genero}</div>
        </div>
        
        {/* Duração */}
        <div className="col-md-3">
          <label className="form-label">Duração (min)</label>
          <input type="number" name="duracao" className={`form-control ${errors.duracao ? 'is-invalid' : ''}`} value={form.duracao} onChange={handleChange} />
          <div className="invalid-feedback">{errors.duracao}</div>
        </div>

        {/* --- NOVOS CAMPOS EXIGIDOS PELO PDF --- */}
        <div className="col-md-4">
            <label className="form-label">Classificação</label>
            <select name="classificacao" className={`form-select ${errors.classificacao ? 'is-invalid' : ''}`} value={form.classificacao} onChange={handleChange}>
                <option value="">Selecione...</option>
                <option value="Livre">Livre</option>
                <option value="10 anos">10 anos</option>
                <option value="12 anos">12 anos</option>
                <option value="14 anos">14 anos</option>
                <option value="16 anos">16 anos</option>
                <option value="18 anos">18 anos</option>
            </select>
            <div className="invalid-feedback">{errors.classificacao}</div>
        </div>

        <div className="col-md-8">
            <label className="form-label">Datas de Exibição</label>
            <input 
                name="datasExibicao" 
                placeholder="Ex: 01/12 a 30/12"
                className={`form-control ${errors.datasExibicao ? 'is-invalid' : ''}`} 
                value={form.datasExibicao} 
                onChange={handleChange} 
            />
            <div className="invalid-feedback">{errors.datasExibicao}</div>
        </div>
        {/* -------------------------------------- */}

        <div className="col-12">
          <label className="form-label">Sinopse</label>
          <input name="sinopse" className={`form-control ${errors.sinopse ? 'is-invalid' : ''}`} value={form.sinopse} onChange={handleChange} />
          <div className="invalid-feedback">{errors.sinopse}</div>
        </div>

        <div className="col-12 mt-3">
          <button type="submit" className="btn btn-danger"><i className="bi bi-save me-2" ></i> Salvar</button>
        </div>
      </form>

      <div className="row">
        {filmes.map(filme => (
          <div key={filme.id} className="col-md-4 mb-3">
            <div className="card bg-secondary text-white h-100">
              <div className="card-body">
                <h5 className="card-title">{filme.titulo}</h5>
                
                {/* Exibindo os novos dados no Card */}
                <div className="mb-2">
                    <span className="badge bg-warning text-dark me-2">{filme.classificacao}</span>
                    <span className="badge bg-dark">{filme.genero}</span>
                </div>
                <p className="card-text small mb-1"><strong>Duração:</strong> {filme.duracao} min</p>
                <p className="card-text small mb-2"><strong>Exibição:</strong> {filme.datasExibicao}</p>
                
                <p className="card-text small">{filme.sinopse}</p>
                <button onClick={() => excluirFilme(filme.id)} className="btn btn-sm btn-dark text-danger"><i className="bi bi-trash"></i> Excluir</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Filmes;