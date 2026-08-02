# CineWeb

Aplicação web para gerenciamento de cinema, permitindo cadastrar filmes e salas, agendar sessões e registrar vendas de ingressos.

O projeto foi desenvolvido com React, TypeScript e Vite, utilizando o JSON Server como API local para persistência dos dados.

## Funcionalidades

- Dashboard com quantidade de filmes, salas e sessões
- Cadastro e listagem de filmes
- Classificação indicativa e datas de exibição dos filmes
- Exclusão de filmes
- Cadastro e listagem de salas
- Exclusão de salas
- Agendamento e listagem de sessões
- Associação de filmes e salas às sessões
- Exclusão de sessões
- Venda de ingressos do tipo inteira ou meia-entrada
- Contagem de ingressos vendidos por sessão
- Validação de formulários
- Bloqueio da exclusão de filmes ou salas vinculados a sessões

## Tecnologias utilizadas

- React
- TypeScript
- Vite
- React Router
- Bootstrap
- Bootstrap Icons
- Zod
- JSON Server
- CSS
- Git e GitHub

## Estrutura principal

```text
cineweb/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── types/
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── db.json
├── package.json
└── vite.config.ts
```

## Como executar

### Pré-requisitos

Tenha instalado:

- Node.js
- npm
- Git

### 1. Clone o repositório

```bash
git clone https://github.com/Ksrluana/cinema-react-crud.git
```

### 2. Entre na pasta da aplicação

```bash
cd cinema-react-crud/cineweb
```

### 3. Instale as dependências

```bash
npm install
```

### 4. Inicie a API local

Abra um terminal dentro da pasta `cineweb` e execute:

```bash
npm run server
```

O JSON Server será iniciado em:

```text
http://localhost:3000
```

### 5. Inicie a aplicação

Abra outro terminal dentro da pasta `cineweb` e execute:

```bash
npm run dev
```

O endereço da aplicação será exibido no terminal, normalmente:

```text
http://localhost:5173
```

## Dados armazenados

O arquivo `db.json` funciona como banco de dados local e contém:

- Filmes
- Salas
- Sessões
- Ingressos

## Validações

Os formulários utilizam Zod para validar informações como:

- Campos obrigatórios
- Duração válida do filme
- Capacidade válida da sala
- Sinopse com tamanho mínimo
- Classificação indicativa
- Datas e horários das sessões
- Bloqueio de datas retroativas

## Melhorias futuras

- Implementar edição de filmes
- Implementar edição de salas
- Implementar edição de sessões
- Adicionar pesquisa e filtros
- Criar autenticação de usuários
- Adicionar testes automatizados
- Substituir o JSON Server por uma API própria
- Publicar a aplicação online
- Adicionar screenshots do sistema

## Autoria

Projeto individual desenvolvido por Luana Kesia para prática de React, TypeScript, gerenciamento de estados, validação de formulários e consumo de API.
