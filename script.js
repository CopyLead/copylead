// ==UserScript==
// @name         CopyLP Painel Adaptativo + QR (fix móvel)
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Painel CopyLP adaptativo, movel em qualquer dispositivo e com espaço para QR Code no modo maximizado (sem alterar o design do mini painel)
// @author       Luiz
// @match        https://saladofuturo.educacao.sp.gov.br/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const painel = document.createElement("div");
    painel.id = "copylp-painel";
    painel.style.position = "fixed";
    painel.style.zIndex = "9999";
    painel.style.background = "rgba(0,0,0,0.85)";
    painel.style.color = "#fff";
    painel.style.padding = "12px 20px";
    painel.style.borderRadius = "14px";
    painel.style.boxShadow = "0 0 15px rgba(255,255,255,0.4)";
    painel.style.backdropFilter = "blur(4px)";
    painel.style.userSelect = "none";
    painel.style.cursor = "move";
    painel.style.transition = "opacity 0.3s ease, transform 0.2s ease";
    painel.style.maxWidth = "90vw";
    painel.style.maxHeight = "90vh";
    painel.style.overflow = "auto";

    painel.innerHTML = `
        <div id="painelConteudo">
            <b style="font-size: 18px;">Painel CopyLP</b><br>
            <small style="opacity:0.8;">Movimente e minimize</small>

            <div id="qrArea" style="margin-top:15px; display:none; text-align:center;">
                <h4 style="margin-bottom:6px;">QR Code</h4>
                <div id="qrBox" style="width:150px; height:150px; border:2px dashed #fff; border-radius:10px; display:inline-block; opacity:0.5; font-size:12px; line-height:150px;">
                    Área para QR
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(painel);

    // Restaura posição salva
    const savedX = localStorage.getItem("copylp_x");
    const savedY = localStorage.getItem("copylp_y");

    if (savedX && savedY) {
        painel.style.left = `${savedX}px`;
        painel.style.top = `${savedY}px`;
    } else {
        const centerX = (window.innerWidth - painel.offsetWidth) / 2;
        const centerY = (window.innerHeight - painel.offsetHeight) / 2;
        painel.style.left = `${centerX}px`;
        painel.style.top = `${centerY}px`;
    }

    // Torna o painel movel (PC e celular)
    let isDragging = false, offsetX = 0, offsetY = 0;

    const startDrag = (x, y) => {
        isDragging = true;
        offsetX = x - painel.offsetLeft;
        offsetY = y - painel.offsetTop;
        painel.style.transition = "none";
    };

    const moveDrag = (x, y) => {
        if (!isDragging) return;

        const maxX = window.innerWidth - painel.offsetWidth;
        const maxY = window.innerHeight - painel.offsetHeight;

        const newX = Math.min(maxX, Math.max(0, x - offsetX));
        const newY = Math.min(maxY, Math.max(0, y - offsetY));

        painel.style.left = `${newX}px`;
        painel.style.top = `${newY}px`;
    };

    const endDrag = () => {
        if (!isDragging) return;
        isDragging = false;
        painel.style.transition = "opacity 0.3s ease, transform 0.2s ease";
        localStorage.setItem("copylp_x", parseInt(painel.style.left));
        localStorage.setItem("copylp_y", parseInt(painel.style.top));
    };

    // Eventos de mouse
    painel.addEventListener("mousedown", (e) => startDrag(e.clientX, e.clientY));
    document.addEventListener("mousemove", (e) => moveDrag(e.clientX, e.clientY));
    document.addEventListener("mouseup", endDrag);

    // Eventos de toque (mobile/tablet)
    painel.addEventListener("touchstart", (e) => {
        const t = e.touches[0];
        startDrag(t.clientX, t.clientY);
    });
    document.addEventListener("touchmove", (e) => {
        const t = e.touches[0];
        moveDrag(t.clientX, t.clientY);
    }, { passive: false });
    document.addEventListener("touchend", endDrag);

    // Botão de minimizar (visual original)
    const btnMin = document.createElement("button");
    btnMin.textContent = "—";
    btnMin.style.position = "absolute";
    btnMin.style.top = "5px";
    btnMin.style.right = "8px";
    btnMin.style.background = "transparent";
    btnMin.style.color = "#fff";
    btnMin.style.border = "none";
    btnMin.style.fontSize = "18px";
    btnMin.style.cursor = "pointer";
    btnMin.style.textShadow = "0 0 6px white";
    painel.appendChild(btnMin);

    let minimized = false;
    btnMin.addEventListener("click", () => {
        minimized = !minimized;
        painel.querySelector("#painelConteudo").style.display = minimized ? "none" : "block";
        painel.style.width = minimized ? "auto" : "fit-content";
        painel.style.height = minimized ? "auto" : "fit-content";
        btnMin.textContent = minimized ? "⬜" : "—";

        if (!minimized) {
            document.getElementById("qrArea").style.display = "block";
        }
    });

    // Mostra QR code por padrão apenas no modo maximizado
    document.getElementById("qrArea").style.display = "block";

})();
