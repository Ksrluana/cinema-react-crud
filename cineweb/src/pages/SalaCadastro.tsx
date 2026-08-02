import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const salaSchema = z.object({
  numero: z.coerce.number().min(1, "O número da sala é obrigatório"),
  capacidade: z.coerce.number().min(1, "A capacidade deve ser maior que 0")
});

type SalaSchema = z.infer<typeof salaSchema>;

export function SalaCadastro() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(salaSchema)
  });

  const onSubmit = async (data: SalaSchema) => {
    try {
      await axios.post('http://localhost:3000/salas', data);
      alert("Sala cadastrada com sucesso!");
      reset();
      navigate('/salas');
    } catch (error) {
      console.error(error);
      alert("Erro ao cadastrar sala.");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Nova Sala</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <label className="form-label">Número da Sala</label>
          <input 
            type="number" 
            className={`form-control ${errors.numero ? 'is-invalid' : ''}`}
            {...register("numero")} 
          />
          <div className="invalid-feedback">{errors.numero?.message}</div>
        </div>

        <div className="mb-3">
          <label className="form-label">Capacidade (Pessoas)</label>
          <input 
            type="number" 
            className={`form-control ${errors.capacidade ? 'is-invalid' : ''}`}
            {...register("capacidade")} 
          />
          <div className="invalid-feedback">{errors.capacidade?.message}</div>
        </div>

        <button type="submit" className="btn btn-success">Salvar Sala</button>
        <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate('/salas')}>
            Cancelar
        </button>
      </form>
    </div>
  );
}