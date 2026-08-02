import './MovieList.css';

// Dados de exemplo (depois a gente puxa de uma API real)
const filmes = [
  { id: 1, nome: "A Origem", capa: "https://image.tmdb.org/t/p/w300/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg" },
  { id: 2, nome: "The Batman", capa: "https://image.tmdb.org/t/p/w300/74xTEgt7R36Fpooo50r9T25onhq.jpg" },
  { id: 3, nome: "Interestelar", capa: "https://image.tmdb.org/t/p/w300/nCbkOyOMTEwlEV0LtCOvCnwEONA.jpg" },
  { id: 4, nome: "Vingadores", capa: "https://image.tmdb.org/t/p/w300/q6725aR8Zs4IwGMXzZT8aC8lh41.jpg" },
  { id: 5, nome: "Matrix", capa: "https://image.tmdb.org/t/p/w300/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg" },
  { id: 6, nome: "Top Gun: Maverick", capa: "https://image.tmdb.org/t/p/w300/62HCnUTziyWcpDaBO2i1DXDAoLu.jpg" }
];

function MovieList({ titulo }: { titulo: string }) {
  return (
    <div className="movie-row">
      <h2>{titulo}</h2>
      <div className="movie-list-area">
        <div className="movie-list">
          {filmes.map((filme) => (
            <div key={filme.id} className="movie-item">
              <img src={filme.capa} alt={filme.nome} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MovieList;