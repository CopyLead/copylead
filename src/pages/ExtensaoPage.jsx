export default function ExtensaoPage() {
  return (
    <section className="doc-page">
      <h2>Extensão CopyLP (Userscript)</h2>
      <p>
        O site React continua funcionando e a extensão também. Para usar a extensão como no projeto
        original, instale o Tampermonkey e depois instale o script abaixo.
      </p>

      <ol>
        <li>Instale a extensão Tampermonkey no navegador.</li>
        <li>
          Clique para instalar o userscript:{' '}
          <a href="/copylead.user.js" target="_blank" rel="noreferrer">
            copylead.user.js
          </a>
        </li>
        <li>Edite os campos de configuração do script (client IDs e backend URL).</li>
        <li>Acesse o site da Sala do Futuro para validar o painel flutuante.</li>
      </ol>

      <p>
        O arquivo original do userscript foi preservado em formato executável em{' '}
        <code>public/copylead.user.js</code>.
      </p>
    </section>
  );
}
