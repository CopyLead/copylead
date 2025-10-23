// ==UserScript==
// @name         CopyLP Painel
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Painel CopyLP - inicia minimizado, centraliza na 1ª maximização, toast inicial ajustado com neon
// @author       Luiz Claudio
// @match        https://saladofuturo.educacao.sp.gov.br/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=educacao.sp.gov.br
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    if (!location.hostname.includes("saladofuturo.educacao.sp.gov.br")) return;
    if (document.getElementById('hw_container')) return;

    function onReady(fn) {
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
        else fn();
    }

    onReady(function () {
        const html = `
        <style>
        :root{--bg:#fff;--card:#fff;--text:#000;--muted:#666;--r:10px;font-family:Arial,sans-serif}
        .hw_container{width:100%;height:100%;position:fixed;top:0;left:0;pointer-events:none;z-index:9999999;user-select:none}
        
        /* ADAPTATIVO PARA TODAS AS TELAS */
        .hw_wrap {
            width: 90%;
            max-width: 420px;
            min-width: 280px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: absolute;
            cursor: move;
            touch-action: none;
            pointer-events: auto;
        }
        @media(max-width:600px){
            .hw_wrap {
                width: 95%;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
            }
        }

        .hw_card{width:100%;background:var(--card);border:1px solid #ccc;border-radius:var(--r);padding:20px;display:flex;flex-direction:column;gap:16px;color:var(--text);position:relative}
        .hw_title{display:flex;align-items:center;font-size:14px;color:var(--text)}
        .hw_title span{margin-right:14px}
        .hw_statusline{display:flex;flex-wrap:wrap;align-items:center;gap:12px;font-size:13px;color:var(--muted)}
        .hw_btnstyle{padding:8px 12px;border:1px solid #000;background:transparent;color:#000;border-radius:6px;cursor:pointer;font-size:14px}
        .hw_k{background:#f2f2f2;padding:4px 8px;border-radius:6px;font-family:monospace;font-size:13px;color:#000}
        .hw_qr{width:100px;height:100px;border:1px solid #ccc;display:flex;align-items:center;justify-content:center;font-size:11px;color:var(--muted);background:#fff;margin-bottom:10px}
        #hw_restore{position:fixed;bottom:20px;right:20px;width:36px;height:36px;display:flex;align-items:center;justify-content:center;z-index:99999999;touch-action:none;cursor:move;}
        #hw_restore img{width:100%;height:100%;object-fit:contain;user-select:none;pointer-events:none}
        #hw_toast{position:fixed;bottom:26px;right:72px;background:rgba(0,0,0,0.85);color:#fff;padding:8px 12px;border-radius:8px;font-size:13px;box-shadow:0 6px 18px rgba(0,0,0,0.25);z-index:99999999;opacity:0;transform:translateY(6px);transition:opacity 210ms ease, transform 210ms ease;pointer-events:none;display:none;white-space:nowrap;}
        #hw_email{padding:8px 10px;border:1px solid #ccc;border-radius:6px;font-size:14px;width:100%;box-sizing:border-box}
        #hw_min{position:absolute;top:8px;right:8px;border:none;background:transparent;color:#000;font-size:18px;cursor:pointer;line-height:1}
        </style>

        <div class="hw_container" id="hw_container">
          <div class="hw_wrap" id="hw_drag">
            <div class="hw_card" id="hw_card" tabindex="0">
              <button id="hw_min" title="Minimizar">×</button>
              <div class="hw_title">
                <div><span>CopyLP</span><span>Mensalidade: R$10,00</span><span>Expira: —</span></div>
              </div>
              <div class="hw_statusline">
                <div><strong>Status:</strong> <span id="hw_status">Não ativado</span></div>
                <div><strong>Chave:</strong> <span class="hw_k" id="hw_k">—</span></div>
              </div>
              <div class="hw_qr" aria-hidden>QR</div>
              <input type="email" id="hw_email" placeholder="Digite seu e-mail"/>
              <button class="hw_btnstyle" id="hw_btn">Gerar chave</button>
              <div class="small">Após pagamento você receberá a chave por e-mail.</div>
            </div>
          </div>
        </div>

        <div id="hw_restore" title="Restaurar painel" draggable="false">
          <img src="https://camo.githubusercontent.com/557ad68f0a36c0067b8c94210fcdf3000374b7378ddad748478d4a0dc854da21/68747470733a2f2f692e696d6775722e636f6d2f6c336c584839302e706e67" alt="Ícone"/>
        </div>
        `;

        const container = document.createElement('div');
        container.innerHTML = html;
        document.body.appendChild(container);

        const dragEl = document.getElementById('hw_drag');
        const restoreEl = document.getElementById('hw_restore');
        const btnEl = document.getElementById('hw_btn');
        const keyEl = document.getElementById('hw_k');
        const statusEl = document.getElementById('hw_status');
        const pageEl = document.getElementById('hw_container');
        const minEl = document.getElementById('hw_min');
        const emailEl = document.getElementById('hw_email');

        let dragging=false, sx, sy, il, it, moved=false;
        let lastPos = { left:null, top:null };
        let firstMax = true;

        function sDrag(x,y,el){dragging=true;moved=false;const r=el.getBoundingClientRect();sx=x;sy=y;il=r.left;it=r.top;el.style.transition='none'}
        function mDrag(x,y,el){if(!dragging)return;const dx=x-sx,dy=y-sy;if(Math.abs(dx)>3||Math.abs(dy)>3)moved=true;el.style.left=(il+dx)+'px';el.style.top=(it+dy)+'px';el.style.position='fixed';el.style.transform='none'}
        function eDrag(el){dragging=false;el.style.transition='';if(el===dragEl){lastPos.left=el.style.left; lastPos.top=el.style.top;}}

        ['mousedown','touchstart'].forEach(e=>dragEl.addEventListener(e,ev=>{const p=ev.touches?ev.touches[0]:ev;sDrag(p.clientX,p.clientY,dragEl)}));
        ['mousemove','touchmove'].forEach(e=>window.addEventListener(e,ev=>{const p=ev.touches?ev.touches[0]:ev;mDrag(p.clientX,p.clientY,dragEl)}));
        ['mouseup','touchend'].forEach(e=>window.addEventListener(e,()=>eDrag(dragEl)));

        restoreEl.addEventListener('click',()=>{if(!moved) restorePanel()});

        function minimizePanel(){
          pageEl.style.pointerEvents='none';
          dragEl.style.display='none';
          restoreEl.style.display='flex';
        }

        function restorePanel(){
          pageEl.style.pointerEvents='auto';
          dragEl.style.display='flex';
          restoreEl.style.display='none';
          if(firstMax){
            dragEl.style.position='fixed';
            dragEl.style.left='50%';
            dragEl.style.top='50%';
            dragEl.style.transform='translate(-50%,-50%)';
            firstMax=false;
          } else if(lastPos.left!==null && lastPos.top!==null){
            dragEl.style.position='fixed';
            dragEl.style.left=lastPos.left;
            dragEl.style.top=lastPos.top;
            dragEl.style.transform='none';
          }
        }

        minEl.addEventListener('click',minimizePanel);

        let activated=false;
        btnEl.addEventListener('click',()=>{
          const em=emailEl.value.trim();
          if(!em){emailEl.style.border='1px solid red'; setTimeout(()=>emailEl.style.border='1px solid #ccc',1500); return;}
          activated=!activated;
          statusEl.textContent=activated?'Ativado':'Não ativado';
          keyEl.textContent=activated?'CHAVE-12345-XYZ':'—';
          if(activated){ showToast('Script Ativado',5000); }
        });

        window.addEventListener('keydown',(e)=>{
          if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA'||e.target.isContentEditable)return;
          if(e.code==='Space'){
            e.preventDefault();
            if(dragEl.style.display==='none') restorePanel();
            else minimizePanel();
          }
        });

        let toastTimer=null;
        function showToast(text,ms){
          let toastEl = document.getElementById('hw_toast');
          toastEl.textContent=text;
          toastEl.style.display='block';
          void toastEl.offsetWidth;
          toastEl.style.opacity='1';
          toastEl.style.transform='translateY(0)';
          if(toastTimer) clearTimeout(toastTimer);
          toastTimer=setTimeout(()=>{
            toastEl.style.opacity = '0';
            toastEl.style.transform = 'translateY(6px)';
            setTimeout(()=>toastEl.style.display='none',250);
          }, ms||5000);
        }

        function showInitialToast() {
          const toastEl = document.createElement('div');
          toastEl.id = 'hw_initial_toast';
          toastEl.textContent = 'Script Ativado com Sucesso!';
          toastEl.style.height = '36px';
          toastEl.style.lineHeight = '36px';
          toastEl.style.padding = '0 12px';
          toastEl.style.fontSize = '14px';
          toastEl.style.position = 'fixed';
          toastEl.style.left = (window.innerWidth / 2 - toastEl.offsetWidth / 2) + 'px';
          toastEl.style.bottom = '30px';
          toastEl.style.background = 'rgba(0,0,0,0.85)';
          toastEl.style.color = '#fff';
          toastEl.style.border = '2px solid white';
          toastEl.style.borderRadius = '8px';
          toastEl.style.boxShadow = '0 0 8px 2px #fff';
          toastEl.style.opacity = '0';
          toastEl.style.transition = 'opacity 210ms ease, transform 210ms ease';
          toastEl.style.pointerEvents = 'none';
          toastEl.style.whiteSpace = 'nowrap';
          toastEl.style.display = 'flex';
          toastEl.style.alignItems = 'center';
          toastEl.style.justifyContent = 'center';
          document.body.appendChild(toastEl);
          requestAnimationFrame(() => {
              toastEl.style.left = (window.innerWidth / 2 - toastEl.offsetWidth / 2) + 'px';
              toastEl.style.opacity = '1';
              toastEl.style.transform = 'translateY(0)';
          });
          setTimeout(() => {
              toastEl.style.opacity = '0';
              toastEl.style.transform = 'translateY(6px)';
              setTimeout(() => toastEl.remove(), 250);
          }, 5000);
        }

        dragEl.style.display='none';
        restoreEl.style.display='flex';
        showInitialToast();
    });
})();
