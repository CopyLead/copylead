export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const evento = req.body;

    console.log("Evento recebido da Cakto:", evento);

    // Exemplo: tratamento do evento
    if (evento.event === "payment.approved") {
      console.log("✅ Pagamento aprovado de:", evento.data?.customer?.email);
    }

    // Você pode salvar em banco de dados ou enviar pra front via fetch
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro interno' });
  }
}
