// api/webhook.js
export const config = {
  api: {
    bodyParser: true, // habilita parse automático do body como JSON
  },
};

export default async function handler(req, res) {
  if (!global.ultimosEventos) global.ultimosEventos = [];

  if (req.method === 'POST') {
    let evento;
    try {
      evento = req.body;
      // Se estiver vazio, tenta converter manualmente
      if (!evento || Object.keys(evento).length === 0) {
        const buffers = [];
        for await (const chunk of req) buffers.push(chunk);
        const raw = Buffer.concat(buffers).toString();
        evento = JSON.parse(raw);
      }
    } catch (e) {
      console.error("Erro ao ler webhook:", e);
      return res.status(400).json({ error: "Corpo inválido" });
    }

    global.ultimosEventos.push(evento);
    console.log("Webhook recebido:", evento);
    res.status(200).json({ ok: true });
  } else if (req.method === 'GET') {
    res.status(200).json(global.ultimosEventos);
  } else {
    res.status(405).json({ error: "Método não permitido" });
  }
}
