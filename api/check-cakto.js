// /api/check-cakto.js
export default async function handler(req, res) {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ active: false, error: "Missing email" });
  }

  const caktoToken = process.env.CAKTO_TOKEN;

  try {
    // Chama a API da Cakto
    const resp = await fetch(`https://api.cakto.com/v1/customers?email=${email}`, {
      headers: {
        Authorization: `Bearer ${caktoToken}`,
        "Content-Type": "application/json",
      },
    });

    const users = await resp.json();
    const user = users?.[0];

    if (!user) {
      return res.json({ active: false, reason: "Usuário não encontrado" });
    }

    const assinatura = user.subscriptions?.[0];
    const ativa = assinatura && assinatura.status === "active";

    res.json({
      active: ativa,
      expiresAt: assinatura?.current_period_end || null,
      reason: ativa ? "Ativa" : "Expirada ou inexistente",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ active: false, error: "Erro no servidor" });
  }
}
