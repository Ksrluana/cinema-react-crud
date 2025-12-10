import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import type { Filme, Sala } from '../types';

// Validação Zod
const sessaoSchema = z.object({
  filmeId: z.string().min(1, "Selecione um filme"),
  salaId: z.string().min(1, "Selecione uma sala"),
  dataHora: z.string().refine((data) => new Date(data) > new Date(), {
    message: "A data e horário devem ser no futuro", // Regra do PDF (não retroativa)
  })
});

type SessaoSchema = z.infer<typeof sessaoSchema>;

export function SessaoCadastro() {
  const navigate = useNavigate();
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [salas, setSalas] = useState<Sala[]>([]);

  // Carregar Filmes e Salas assim que a tela abre
  useEffect(() => {
    axios.get('http://localhost:3000/filmes').then(res => setFilmes(res.data));
    axios.get('http://localhost:3000/salas').then(res => setSalas(res.data));
  }, []);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(sessaoSchema)
  });

  const onSubmit = async (data: SessaoSchema) => {
    try {
      await axios.post('http://localhost:3000/sessoes', data);
      alert("Sessão agendada com sucesso!");
      reset();
      navigate('/sessoes');
    } catch (error) {
      console.error(error);
      alert("Erro ao agendar sessão.");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Agendar Sessão</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        
        {/* Select de Filmes */}
        <div className="mb-3">
          <label className="form-label">Filme</label>
          <select className={`form-select ${errors.filmeId ? 'is-invalid' : ''}`} {...register("filmeId")}>
            <option value="">Selecione um filme...</option>
            {filmes.map(filme => (
              <option key={filme.id} value={filme.id}>{filme.titulo}</option>
            ))}
          </select>
          <div className="invalid-feedback">{errors.filmeId?.message}</div>
        </div>

        {/* Select de Salas */}
        <div className="mb-3">
          <label className="form-label">Sala</label>
          <select className={`form-select ${errors.salaId ? 'is-invalid' : ''}`} {...register("salaId")}>
            <option value="">Selecione uma sala...</option>
            {salas.map(sala => (
              <option key={sala.id} value={sala.id}>
                Sala {sala.numero} ({sala.capacidade} lugares)
              </option>
            ))}
          </select>
          <div className="invalid-feedback">{errors.salaId?.message}</div>
        </div>

        {/* Data e Hora */}
        <div className="mb-3">
          <label className="form-label">Data e Horário</label>
          <input 
            type="datetime-local" 
            className={`form-control ${errors.dataHora ? 'is-invalid' : ''}`}
            {...register("dataHora")} 
          />
          <div className="invalid-feedback">{errors.dataHora?.message}</div>
        </div>

        <button type="submit" className="btn btn-success">Agendar Sessão</button>
        <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate('/sessoes')}>
            Cancelar
        </button>
      </form>
    </div>
  );
}