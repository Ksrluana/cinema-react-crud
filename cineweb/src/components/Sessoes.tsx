import { useState, useEffect } from 'react';
import { z } from 'zod';

// Interfaces
interface Filme { id: string; titulo: string; }
interface Sala { id: string; numero: number; capacidade: number; }
interface Sessao { id: string; filmeId: string; salaId: string; dataHora: string; }
interface Ingresso { id: string; sessaoId: string; tipo: 'Inteira' | 'Meia'; valor: number; }

function Sessoes() {
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [salas, setSalas] = useState<Sala[]>([]);
  const [sessoes, setSessoes] = useState<Sessao[]>([]);
  const [ingressos, setIngressos] = useState<Ingresso[]>([]);

  // Estados do Formulário e UI
  const [form, setForm] = useState({ filmeId: '', salaId: '', dataHora: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sessaoVenda, setSessaoVenda] = useState<Sessao | null>(null);
  const [tipoIngresso, setTipoIngresso] = useState<'Inteira' | 'Meia'>('Inteira');

  // 1. CARREGAR TUDO DA API AO INICIAR
  useEffect(() => {
    fetch('http://localhost:3000/filmes').then(res => res.json()).then(setFilmes);
    fetch('http://localhost:3000/salas').then(res => res.json()).then(setSalas);
    fetch('http://localhost:3000/sessoes').then(res => res.json()).then(setSessoes);
    fetch('http://localhost:3000/ingressos').then(res => res.json()).then(setIngressos);
  }, []);

  // Schema Zod
  const sessaoSchema = z.object({
    filmeId: z.string().min(1, "Selecione um filme"),
    salaId: z.string().min(1, "Selecione uma sala"),
    dataHora: z.string().refine((data) => new Date(data) > new Date(), { message: "Data retroativa não permitida" })
  });

  const salvarSessao = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dados = sessaoSchema.parse(form);
      const novaSessao = { id: String(Date.now()), ...dados };

      // POST na API
      const res = await fetch('http://localhost:3000/sessoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novaSessao)
      });

      if (res.ok) {
        setSessoes([...sessoes, novaSessao]);
        setForm({ filmeId: '', salaId: '', dataHora: '' });
        setErrors({});
        alert("Sessão criada com sucesso!");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.issues.forEach(issue => fieldErrors[String(issue.path[0])] = issue.message);
        setErrors(fieldErrors);
      }
    }
  };

  const excluirSessao = async (id: string) => {
    await fetch(`http://localhost:3000/sessoes/${id}`, { method: 'DELETE' });
    setSessoes(sessoes.filter(s => s.id !== id));
  };

  const confirmarVenda = async () => {
    if (!sessaoVenda) return;
    const valorBase = 30.00;
    const valorFinal = tipoIngresso === 'Meia' ? valorBase / 2 : valorBase;

    const novoIngresso: Ingresso = {
      id: String(Date.now()),
      sessaoId: sessaoVenda.id,
      tipo: tipoIngresso,
      valor: valorFinal
    };

    // Salva Ingresso na API
    const res = await fetch('http://localhost:3000/ingressos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoIngresso)
    });

    if (res.ok) {
        setIngressos([...ingressos, novoIngresso]);
        setSessaoVenda(null);
        alert(`Venda Confirmada! ID: ${novoIngresso.id}`);
    }
  };

  // Helpers
  const getFilme = (id: string) => filmes.find(f => f.id === id)?.titulo || '???';
  const getSala = (id: string) => salas.find(s => s.id === id)?.numero || '???';
  const contarIngressos = (sessaoId: string) => ingressos.filter(i => i.sessaoId === sessaoId).length;

  return (
    <div className="container mt-4 text-light">
      <h2 className="mb-4"><i className="bi bi-calendar-event"></i> Gerenciar Sessões (API)</h2>

      <form onSubmit={salvarSessao} className="row g-3 bg-dark p-4 rounded mb-5 border border-secondary">
        <div className="col-md-4">
          <label>Filme</label>
          <select 
            className={`form-select ${errors.filmeId ? 'is-invalid' : ''}`} 
            value={form.filmeId} 
            onChange={e => setForm({...form, filmeId: e.target.value})}
          >
            <option value="">Selecione...</option>
            {filmes.map(f => <option key={f.id} value={f.id}>{f.titulo}</option>)}
          </select>
          <div className="invalid-feedback">{errors.filmeId}</div>
        </div>

        <div className="col-md-4">
          <label>Sala</label>
          <select 
            className={`form-select ${errors.salaId ? 'is-invalid' : ''}`} 
            value={form.salaId} 
            onChange={e => setForm({...form, salaId: e.target.value})}
          >
            <option value="">Selecione...</option>
            {salas.map(s => <option key={s.id} value={s.id}>Sala {s.numero}</option>)}
          </select>
          <div className="invalid-feedback">{errors.salaId}</div>
        </div>

        <div className="col-md-4">
          <label>Data/Hora</label>
          <input 
            type="datetime-local" 
            className={`form-control ${errors.dataHora ? 'is-invalid' : ''}`} 
            value={form.dataHora} 
            onChange={e => setForm({...form, dataHora: e.target.value})} 
          />
          <div className="invalid-feedback">{errors.dataHora}</div>
        </div>

        <div className="col-12">
          <button className="btn btn-danger"><i className="bi bi-plus-circle"></i> Agendar Sessão</button>
        </div>
      </form>

      {/* Tabela */}
      <div className="table-responsive">
        <table className="table table-dark table-hover table-striped border border-secondary">
          <thead>
            <tr>
              <th>Filme</th>
              <th>Sala</th>
              <th>Horário</th>
              <th>Ingressos</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {sessoes.map(sessao => (
              <tr key={sessao.id}>
                <td>{getFilme(sessao.filmeId)}</td>
                <td>Sala {getSala(sessao.salaId)}</td>
                <td>{new Date(sessao.dataHora).toLocaleString('pt-BR')}</td>
                <td><span className="badge bg-info">{contarIngressos(sessao.id)} vendidos</span></td>
                <td>
                    <button className="btn btn-success btn-sm me-2" onClick={() => setSessaoVenda(sessao)}>
                        <i className="bi bi-ticket-perforated"></i> Vender
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => excluirSessao(sessao.id)}>
                        <i className="bi bi-trash"></i>
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Venda */}
      {sessaoVenda && (
        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.8)' }}>
          <div className="modal-dialog">
            <div className="modal-content bg-dark text-white border border-secondary">
              <div className="modal-header">
                <h5 className="modal-title">Vender Ingresso: {getFilme(sessaoVenda.filmeId)}</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setSessaoVenda(null)}></button>
              </div>
              <div className="modal-body">
                <p>Data: {new Date(sessaoVenda.dataHora).toLocaleString('pt-BR')}</p>
                <div className="mb-3">
                    <label className="form-label">Tipo de Ingresso</label>
                    <select 
                        className="form-select" 
                        value={tipoIngresso} 
                        onChange={e => setTipoIngresso(e.target.value as 'Inteira' | 'Meia')}
                    >
                        <option value="Inteira">Inteira (R$ 30,00)</option>
                        <option value="Meia">Meia-Entrada (R$ 15,00)</option>
                    </select>
                </div>
                <h4 className="text-end text-success">Total: R$ {tipoIngresso === 'Inteira' ? '30,00' : '15,00'}</h4>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setSessaoVenda(null)}>Cancelar</button>
                <button type="button" className="btn btn-success" onClick={confirmarVenda}>Confirmar Venda</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Sessoes;