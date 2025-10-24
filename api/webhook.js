// api/webhook.js
export default function handler(req, res) {
  // Inicializa array global para armazenar eventos
  if (!global.ultimosEventos) global.ultimosEventos = [];

  if (req.method === 'POST') {
    // Recebe webhook da Cakto ou Pluga
    const evento = req.body;
    global.ultimosEventos.push(evento);
    console.log("Webhook recebido:", evento);
    res.status(200).json({ ok: true });
  } else if (req.method === 'GET') {
    // Retorna os eventos para o frontend
    res.status(200).json(global.ultimosEventos);
  } else {
    res.status(405).json({ error: "Método não permitido" });
  }
}
