document.getElementById("verificar").addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  if (!email) return alert("Digite seu e-mail");

  try {
    const res = await fetch(`https://seuapp.vercel.app/api/check-cakto?email=${encodeURIComponent(email)}`);
    const data = await res.json();

    if (data.active) {
      liberarPainel();
    } else {
      bloquearPainel(data.reason);
    }
  } catch (err) {
    console.error("Erro:", err);
    bloquearPainel("Erro ao verificar assinatura");
  }
});

function liberarPainel() {
  document.getElementById("painel").style.display = "block";
  showToast("✅ Acesso liberado");
}

function bloquearPainel(reason) {
  document.getElementById("painel").style.display = "none";
  showToast(`🚫 Acesso negado: ${reason}`);
}

function showToast(msg) {
  const toast = document.createElement("div");
  toast.textContent = msg;
  toast.style.position = "fixed";
  toast.style.bottom = "20px";
  toast.style.right = "20px";
  toast.style.background = "rgba(0,0,0,0.8)";
  toast.style.color = "#fff";
  toast.style.padding = "10px 20px";
  toast.style.borderRadius = "8px";
  toast.style.fontSize = "14px";
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}
