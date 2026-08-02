import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// 1. Definição das Regras de Validação (Schema)
const filmeSchema = z.object({
  titulo: z.string().min(1, "O título é obrigatório"),
  sinopse: z.string().min(10, "A sinopse deve ter no mínimo 10 caracteres"),
  duracao: z.coerce.number().min(1, "A duração deve ser maior que 0 minutos"),
  classificacao: z.string().min(1, "Selecione uma classificação"),
  genero: z.string().min(1, "O gênero é obrigatório"),
  datasExibicao: z.string().optional() // Campo opcional (texto livre por enquanto)
});

// Cria o tipo TypeScript baseado no Schema acima
type FilmeSchema = z.infer<typeof filmeSchema>;

export function FilmeCadastro() {
  const navigate = useNavigate(); // Para redirecionar após salvar

const { 
  register, 
  handleSubmit, 
  formState: { errors }, 
  reset 
} = useForm({ // <--- Remova o <FilmeSchema> daqui
  resolver: zodResolver(filmeSchema)
});

  // Função que roda ao clicar em Salvar (se tudo estiver válido)
  const onSubmit = async (data: FilmeSchema) => {
    try {
      await axios.post('http://localhost:3000/filmes', data);
      alert("Filme cadastrado com sucesso!");
      reset(); // Limpa o formulário
      navigate('/filmes'); // Volta para a lista
    } catch (error) {
      console.error(error);
      alert("Erro ao cadastrar filme.");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Novo Filme</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="row g-3">
        
        {/* Título */}
        <div className="col-md-6">
          <label className="form-label">Título do Filme</label>
          <input 
            type="text" 
            className={`form-control ${errors.titulo ? 'is-invalid' : ''}`} 
            {...register("titulo")} 
          />
          <div className="invalid-feedback">{errors.titulo?.message}</div>
        </div>

        {/* Duração */}
        <div className="col-md-3">
          <label className="form-label">Duração (minutos)</label>
          <input 
            type="number" 
            className={`form-control ${errors.duracao ? 'is-invalid' : ''}`} 
            {...register("duracao", { valueAsNumber: true })} 
          />
          <div className="invalid-feedback">{errors.duracao?.message}</div>
        </div>

        {/* Classificação */}
        <div className="col-md-3">
            <label className="form-label">Classificação</label>
            <select className={`form-select ${errors.classificacao ? 'is-invalid' : ''}`} {...register("classificacao")}>
                <option value="">Selecione...</option>
                <option value="Livre">Livre</option>
                <option value="10 anos">10 anos</option>
                <option value="12 anos">12 anos</option>
                <option value="14 anos">14 anos</option>
                <option value="16 anos">16 anos</option>
                <option value="18 anos">18 anos</option>
            </select>
            <div className="invalid-feedback">{errors.classificacao?.message}</div>
        </div>

        {/* Gênero */}
        <div className="col-md-6">
            <label className="form-label">Gênero</label>
            <input 
                type="text" 
                className={`form-control ${errors.genero ? 'is-invalid' : ''}`} 
                {...register("genero")} 
            />
            <div className="invalid-feedback">{errors.genero?.message}</div>
        </div>

        {/* Sinopse */}
        <div className="col-12">
            <label className="form-label">Sinopse</label>
            <textarea 
                rows={3}
                className={`form-control ${errors.sinopse ? 'is-invalid' : ''}`}
                {...register("sinopse")}
            ></textarea>
            <div className="invalid-feedback">{errors.sinopse?.message}</div>
        </div>

        {/* Botão Salvar */}
        <div className="col-12">
          <button type="submit" className="btn btn-success">
            <i className="bi bi-check-lg me-2"></i>Salvar Filme
          </button>
          <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate('/filmes')}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}