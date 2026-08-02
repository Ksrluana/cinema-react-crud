export interface Filme {
    id: string;
    titulo: string;
    sinopse: string;
    classificacao: string;
    duracao: number;
    genero: string;
    datasExibicao?: string; // Opcional
}

export interface Sala {
    id: string;
    numero: number;
    capacidade: number;
}

export interface Sessao {
    id: string;
    filmeId: string;
    salaId: string;
    dataHora: string;
}