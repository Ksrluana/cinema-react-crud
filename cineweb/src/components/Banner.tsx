import './Banner.css';

function Banner() {
  return (
    <div className="banner" style={{
        backgroundImage: `url("https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop")`
    }}>
      <div className="banner-vertical">
        <div className="banner-horizontal">
          <h1 className="banner-title">Nome do Filme</h1>
          
          <div className="banner-buttons">
            <button className="btn-assistir">► Assistir</button>
            <button className="btn-lista">+ Minha Lista</button>
          </div>

          <div className="banner-description">
            <p>Aqui vai a sinopse do filme. Uma breve descrição emocionante sobre o que acontece na história para prender a atenção do usuário.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Banner;