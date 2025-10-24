// /api/webhook.js
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const evento = req.body;

    // Salva o evento em memória (pra teste)
    // Em produção, salve no banco
    global.ultimosEventos = global.ultimosEventos || [];
    global.ultimosEventos.push(evento);

    console.log("Webhook recebido:", evento);

    res.status(200).json({ ok: true });
  } else if (req.method === 'GET') {
    // Endpoint GET pra front buscar os eventos
    res.status(200).json(global.ultimosEventos || []);
  } else {
    res.status(405).json({ error: 'Método não permitido' });
  }
}
