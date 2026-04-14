const providers = [
  {
    name: 'Google',
    icon: 'https://www.gstatic.com/marketing-cms/assets/images/d5/dc/cfe9ce8b4425b410b49b7f2dd3f3/g.webp=s96-fcrop64=1,00000000ffffffff-rw',
  },
  {
    name: 'Microsoft',
    icon: 'https://cdn-icons-png.flaticon.com/128/732/732221.png',
  },
];

export default function LoginCard() {
  return (
    <section className="login-container">
      <img
        src="https://i.imgur.com/l3lXH90.png"
        alt="Logo CopyLP"
        className="logo"
      />
      <h2>CopyLP Login</h2>
      <p className="small">Use o e-mail da compra para fazer login.</p>

      {providers.map((provider) => (
        <button className="btn" key={provider.name} type="button">
          <img src={provider.icon} alt={`Logo ${provider.name}`} />
          <span>Entrar com {provider.name}</span>
        </button>
      ))}

      <p className="small">Depois do login, você poderá gerar sua chave e usar o painel.</p>
    </section>
  );
}
