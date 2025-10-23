// ==UserScript==
// @name         CopyLP Painel Adaptativo
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Painel CopyLP adaptativo — centraliza na 1ª vez, salva posição, funciona em qualquer dispositivo (mouse e toque)
// @author       Luiz Claudio
// @match        https://saladofuturo.educacao.sp.gov.br/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=educacao.sp.gov.br
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  if (!location.hostname.includes("saladofuturo.educacao.sp.gov.br")) return;
  if (document.getElementById('copylp_container')) return;

  function onReady(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  onReady(() => {
    const html = `
    <style>
      :root {
        --bg: #fff;
        --text: #000;
        --muted: #555;
        --r: 10px;
        font-family: Arial, sans-serif;
      }

      #copylp_container {
        position: fixed;
        inset: 0;
        z-index: 999999;
        pointer-events: none;
      }

      #copylp_panel {
        position: fixed;
        width: 420px;
        max-width: 90vw;
        background: var(--bg);
        border: 1px solid #ccc;
        border-radius: var(--r);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.25);
        padding: 16px;
        color: var(--text);
        pointer-events: auto;
        box-sizing: border-box;
        touch-action: none;
      }

      #copylp_panel h2 {
        margin: 0 0 8px 0;
        font-size: 18px;
      }

      #copylp_panel p {
        margin: 4px 0;
        color: var(--muted);
        font-size: 14px;
      }

      #copylp_minimize {
        position: absolute;
        top: 6px;
        right: 10px;
        font-size: 22px;
        background: transparent;
        border: none;
        cursor: pointer;
        color: var(--text);
      }

      #copylp_restore {
        display: none;
        position: fixed;
        bottom: 16px;
        right: 16px;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: rgba(0, 0, 0, 0.75);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 99999999;
        box-shadow: 0 0 8px rgba(255, 255, 255, 0.4);
      }

      #copylp_restore img {
        width: 28px;
        height: 28px;
        filter: invert(1);
        pointer-events: none;
      }

      @media (max-width: 600px) {
        #copylp_panel {
          width: 95vw;
          padding: 12px;
          font-size: 14px;
        }
        #copylp_panel h2 {
          font-size: 16px;
        }
        #copylp_restore {
          width: 42px;
          height: 42px;
          bottom: 12px;
          right: 12px;
        }
      }
    </style>

    <div id="copylp_container">
      <div id="copylp_panel">
        <button id="copylp_minimize">×</button>
        <h2>CopyLP Painel</h2>
        <p><strong>Status:</strong> Não ativado</p>
        <p><strong>Mensalidade:</strong> R$10,00</p>
        <p><strong>Expira:</strong> —</p>
        <input id="copylp_email" type="email" placeholder="Digite seu e-mail" style="width:100%;padding:8px;border:1px solid #ccc;border-radius:6px;font-size:14px;margin:8px 0;">
        <button id="copylp_gerar" style="width:100%;padding:8px;border:1px solid #000;border-radius:6px;background:transparent;cursor:pointer;">Gerar Chave</button>
      </div>
    </div>

    <div id="copylp_restore">
      <img src="https://cdn-icons-png.flaticon.com/512/1828/1828919.png" alt="Restaurar"/>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', html);

    const panel = document.getElementById('copylp_panel');
    const restore = document.getElementById('copylp_restore');
    const minimize = document.getElementById('copylp_minimize');

    // 🔹 Recuperar posição salva
    const savedLeft = localStorage.getItem("copylp_left");
    const savedTop = localStorage.getItem("copylp_top");

    if (savedLeft && savedTop) {
      panel.style.left = savedLeft;
      panel.style.top = savedTop;
    } else {
      // Centraliza na 1ª vez
      const left = (window.innerWidth - panel.offsetWidth) / 2;
      const top = (window.innerHeight - panel.offsetHeight) / 2;
      panel.style.left = left + "px";
      panel.style.top = top + "px";
    }

    // 🔹 Movimentação (mouse e toque)
    let dragging = false, startX = 0, startY = 0, startLeft = 0, startTop = 0;

    function startDrag(x, y) {
      dragging = true;
      startX = x;
      startY = y;
      startLeft = parseFloat(panel.style.left || 0);
      startTop = parseFloat(panel.style.top || 0);
      panel.style.transition = "none";
    }

    function moveDrag(x, y) {
      if (!dragging) return;
      const dx = x - startX;
      const dy = y - startY;
      panel.style.left = startLeft + dx + "px";
      panel.style.top = startTop + dy + "px";
    }

    function endDrag() {
      dragging = false;
      panel.style.transition = "";
      // Salvar posição
      localStorage.setItem("copylp_left", panel.style.left);
      localStorage.setItem("copylp_top", panel.style.top);
    }

    panel.addEventListener("mousedown", e => startDrag(e.clientX, e.clientY));
    window.addEventListener("mousemove", e => moveDrag(e.clientX, e.clientY));
    window.addEventListener("mouseup", endDrag);

    panel.addEventListener("touchstart", e => startDrag(e.touches[0].clientX, e.touches[0].clientY));
    window.addEventListener("touchmove", e => moveDrag(e.touches[0].clientX, e.touches[0].clientY));
    window.addEventListener("touchend", endDrag);

    // 🔹 Minimizar / Restaurar
    minimize.addEventListener("click", () => {
      panel.style.display = "none";
      restore.style.display = "flex";
    });

    restore.addEventListener("click", () => {
      panel.style.display = "block";
      restore.style.display = "none";
    });

    // 🔹 Adaptação ao redimensionar
    window.addEventListener("resize", () => {
      const left = parseFloat(panel.style.left);
      const top = parseFloat(panel.style.top);

      // Garante que não saia da tela
      if (left + panel.offsetWidth > window.innerWidth) {
        panel.style.left = (window.innerWidth - panel.offsetWidth - 10) + "px";
      }
      if (top + panel.offsetHeight > window.innerHeight) {
        panel.style.top = (window.innerHeight - panel.offsetHeight - 10) + "px";
      }
    });
  });
})();
