export default function FluxoAutenticacaoPage() {
  return (
    <section className="doc-page">
      <h2>Fluxo recomendado de autenticação</h2>
      <ol>
        <li>Usuário faz login via Google ou Microsoft.</li>
        <li>Backend recebe o e-mail autenticado.</li>
        <li>Servidor verifica se o pagamento está ativo no banco.</li>
        <li>Somente com status ativo o backend gera JWT.</li>
      </ol>
      <p>
        Esse formato mantém OAuth2 correto e impede acesso de contas sem mensalidade ativa.
      </p>
    </section>
  );
}
