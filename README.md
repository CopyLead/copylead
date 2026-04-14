# CopyLP em React

Este repositório foi reorganizado para React + Vite, separando telas em componentes e páginas.

## Estrutura

- `src/pages`: páginas principais (`/login`, `/comprar`, `/fluxo-auth`)
- `src/components`: componentes reutilizáveis
- `src/styles`: estilos globais
- `legacy/`: arquivos HTML antigos preservados para referência

## Como rodar

```bash
npm install
npm run dev
```

## Onde acessar

Com o `npm run dev` rodando, abra no navegador:

- App principal: `http://localhost:5173/`
- Login: `http://localhost:5173/login`
- Comprar: `http://localhost:5173/comprar`
- Fluxo de autenticação: `http://localhost:5173/fluxo-auth`

> Se a porta `5173` estiver ocupada, o Vite mostra outra porta no terminal (ex.: `http://localhost:5174`).

## Build de produção

```bash
npm run build
npm run preview
```

Com o preview rodando, normalmente fica disponível em `http://localhost:4173` (ou porta informada no terminal).
