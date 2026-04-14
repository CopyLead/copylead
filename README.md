# CopyLP em React + Extensão Userscript

Este repositório agora mantém **duas partes funcionando juntas**:

1. **Site React (Vite)** para páginas web (`/login`, `/comprar`, `/fluxo-auth`, `/extensao`)
2. **Extensão userscript (Tampermonkey)** no arquivo `public/copylead.user.js`

## Estrutura

- `src/pages`: páginas principais
- `src/components`: componentes reutilizáveis
- `src/styles`: estilos globais
- `public/copylead.user.js`: script da extensão (modo original Tampermonkey)
- `legacy/`: HTMLs antigos preservados para referência

## Como rodar o site

```bash
npm install
npm run dev
```

## Onde acessar (site)

Com `npm run dev`:

- App principal: `http://localhost:5173/`
- Login: `http://localhost:5173/login`
- Comprar: `http://localhost:5173/comprar`
- Fluxo auth: `http://localhost:5173/fluxo-auth`
- Página da extensão: `http://localhost:5173/extensao`

> Se a porta `5173` estiver ocupada, use a porta mostrada no terminal.

## Como instalar a extensão (userscript)

1. Instale o **Tampermonkey** no navegador.
2. Com o dev server rodando, abra `http://localhost:5173/copylead.user.js`.
3. O Tampermonkey abrirá a tela de instalação.
4. Edite no script os valores:
   - `GOOGLE_CLIENT_ID`
   - `MS_CLIENT_ID`
   - `BACKEND_URL`

## Build de produção

```bash
npm run build
npm run preview
```
