import { useEffect, useMemo, useState } from 'react';

function createColumn() {
  const lines = Array.from({ length: 50 }, () => (Math.random() > 0.5 ? '1' : '0'));
  return lines.map((digit, index) => (index % 8 === 7 ? `${digit}\n` : digit)).join('');
}

export default function ComprarPage() {
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    const update = () => {
      const total = Math.floor(window.innerWidth / 20);
      setColumns(
        Array.from({ length: total }, (_, i) => ({
          id: `${i}-${Math.random()}`,
          left: i * 20,
          duration: (Math.random() * 3 + 2).toFixed(2),
          delay: (Math.random() * 2).toFixed(2),
          text: createColumn(),
        })),
      );
    };

    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const description = useMemo(
    () =>
      'O CopyLP automatiza redações de forma rápida e prática para quem quer ganhar tempo e produtividade.',
    [],
  );

  return (
    <section className="matrix-page">
      <div className="matrix-bg" aria-hidden>
        {columns.map((column) => (
          <div
            key={column.id}
            className="matrix-column"
            style={{
              left: `${column.left}px`,
              animationDuration: `${column.duration}s`,
              animationDelay: `${column.delay}s`,
            }}
          >
            {column.text}
          </div>
        ))}
      </div>

      <div className="container">
        <h2>🛒 Comprar CopyLP</h2>
        <p>{description}</p>
        <a
          href="https://pay.cakto.com.br/793wzey_619822"
          target="_blank"
          rel="noreferrer"
          className="pix-btn"
        >
          💰 Pagar com PIX
        </a>
      </div>
    </section>
  );
}
