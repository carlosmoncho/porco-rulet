'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

export default function RuletaDescuentos() {
  // Estados
  const [girando, setGirando] = useState(false);
  const [resultadoTexto, setResultadoTexto] = useState('');
  const [showResultado, setShowResultado] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [premioSeleccionado, setPremioSeleccionado] = useState(null);
  const [showCodigoDescuento, setShowCodigoDescuento] = useState(false);
  const [codigo, setCodigo] = useState('');
  const [enviando, setEnviando] = useState(false);

  // Referencias
  const ruletaRef = useRef(null);
  const containerRef = useRef(null);
  const emailInputRef = useRef(null);

  // Premios
  const premios = [
    { valor: 5, texto: "¡Has ganado un 5% de descuento en Porco Diavolo!", angulo: 60 },
    { valor: 10, texto: "¡Has ganado un 10% de descuento en Porco Diavolo!", angulo: 180 },
    { valor: 15, texto: "¡Has ganado un 15% de descuento en Porco Diavolo!", angulo: 300 }
  ];

  // Manejar clic en girar
  const handleGirar = () => {
    if (girando) return;

    // Ocultar modal y código de descuento
    setShowModal(false);
    setShowCodigoDescuento(false);
    setShowResultado(false);
    setResultadoTexto("");

    // Limpiar confeti anterior
    const confettiElements = document.querySelectorAll('.confetti');
    confettiElements.forEach(el => el.remove());

    // Activar giro
    setGirando(true);

    // Seleccionar premio aleatorio
    const premioIndex = Math.floor(Math.random() * premios.length);
    const premio = premios[premioIndex];
    setPremioSeleccionado(premio);

    // Calcular ángulo final
    const rotaciones = 5 + Math.floor(Math.random() * 3);
    const anguloFinal = rotaciones * 360 - premio.angulo;

    // Aplicar rotación
    if (ruletaRef.current) {
      ruletaRef.current.style.transform = `rotate(${anguloFinal}deg)`;
    }

    // Mostrar resultado después de la animación
    setTimeout(() => {
      setResultadoTexto(premio.texto);
      setShowResultado(true);
      crearConfeti();

      // Mostrar modal después de un momento
      setTimeout(() => {
        setShowModal(true);
        setGirando(false);
      }, 1500);
    }, 6100);
  };

  // Manejar envío de correo
  const handleEnviarCorreo = async (e) => {
    e.preventDefault();
    
    if (!premioSeleccionado) return;
    
    const email = emailInputRef.current.value.trim();
    
    // Validación básica del correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      alert('Por favor, introduce un correo electrónico válido');
      return;
    }
    
    // Mostrar mensaje de carga
    setEnviando(true);
    
    // Generar código de descuento
    const nuevoCodigo = generarCodigo(premioSeleccionado.valor);
    setCodigo(nuevoCodigo);
    
    try {
      // Enviar correo electrónico usando EmailJS
      if (typeof window !== 'undefined' && typeof window.emailjs !== 'undefined') {
        await window.emailjs.send(
          process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
          process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
          {
            to_email: email,
            codigo_descuento: nuevoCodigo,
            valor_descuento: premioSeleccionado.valor + '%',
            mensaje: `¡Felicidades! Has ganado un descuento del ${premioSeleccionado.valor}% en tu próxima visita a Porco Diavolo.`
          }
        );
      }
      
      // Mostrar código de descuento
      setShowCodigoDescuento(true);
      
      // Guardar en localStorage
      try {
        const guardados = JSON.parse(localStorage.getItem('porco_diavolo_emails') || '[]');
        guardados.push({
          email: email,
          codigo: nuevoCodigo,
          descuento: premioSeleccionado.valor,
          fecha: new Date().toISOString()
        });
        localStorage.setItem('porco_diavolo_emails', JSON.stringify(guardados));
      } catch (e) {
        console.error('Error al guardar en localStorage:', e);
      }
      
      // Crear confeti para celebrar
      crearConfeti();
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      alert('Hubo un problema al enviar el correo. Por favor, inténtalo de nuevo.');
    } finally {
      setEnviando(false);
    }
  };

  // Cerrar modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Generar código aleatorio
  const generarCodigo = (descuento) => {
    const letras = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const numeros = '123456789';
    
    let codigo = 'PORCO';
    
    // Añadir 2 letras aleatorias
    for (let i = 0; i < 2; i++) {
      codigo += letras.charAt(Math.floor(Math.random() * letras.length));
    }
    
    // Añadir el valor del descuento (sin %)
    codigo += descuento;
    
    // Añadir 3 números aleatorios
    for (let i = 0; i < 3; i++) {
      codigo += numeros.charAt(Math.floor(Math.random() * numeros.length));
    }
    
    return codigo;
  };

  // Crear confeti
  const crearConfeti = () => {
    const colors = ['#DA0C85', '#2293AC', '#D4AF37', '#F8E7B0', '#E5E4E2'];
    
    for (let i = 0; i < 80; i++) {
      const confetti = document.createElement('div');
      confetti.classList.add('confetti');
      
      // Propiedades aleatorias
      const size = Math.random() * 8 + 4;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const left = Math.random() * 100 + '%';
      const opacity = Math.random() * 0.8 + 0.2;
      const duration = Math.random() * 1.5 + 1.5;
      const delay = Math.random() * 0.5;
      
      // Aplicar estilos
      confetti.style.width = `${size}px`;
      confetti.style.height = `${size}px`;
      confetti.style.backgroundColor = color;
      confetti.style.left = left;
      confetti.style.opacity = opacity;
      confetti.style.animationDuration = `${duration}s`;
      confetti.style.animationDelay = `${delay}s`;
      
      // Formas variadas
      const shapes = ['50%', '0%'];
      confetti.style.borderRadius = shapes[Math.floor(Math.random() * shapes.length)];
      
      // Añadir a la página
      if (containerRef.current) {
        containerRef.current.appendChild(confetti);
      }
      
      // Eliminar después de la animación
      setTimeout(() => {
        confetti.remove();
      }, (duration + delay) * 1000);
    }
  };

  return (
    <>
      <div className="container" ref={containerRef}>
        <h1>¡Gira y <span>Gana</span> en Porco Diavolo!</h1>
        
        <div className="ruleta-container">
          <div className="flecha-container">
            <div className="flecha"></div>
          </div>
          <div className="ruleta" ref={ruletaRef}>
            <div className="ruleta-shine"></div>
            <div className="etiqueta etiqueta-5"><span>5%</span></div>
            <div className="etiqueta etiqueta-10"><span>10%</span></div>
            <div className="etiqueta etiqueta-15"><span>15%</span></div>
          </div>
          <div className="ruleta-center">
            <Image 
              src="/logo.jpeg" 
              alt="Porco Diavolo Logo" 
              className="center-logo" 
              width={80} 
              height={80} 
              priority 
            />
          </div>
        </div>
        
        <button
          className="btn-spin"
          onClick={handleGirar}
          disabled={girando}
        >
          Girar Ruleta
        </button>
        
        <div className="resultado-container">
          <div className={`resultado ${showResultado ? 'show' : ''}`}>
            {resultadoTexto}
          </div>
        </div>
        
        <div className="footer">PORCO DIAVOLO - GAUDIR A MOSSOS</div>
      </div>
      
      {/* Modal para solicitar correo */}
      <div className="modal-overlay" style={{ display: showModal ? 'flex' : 'none' }}>
        <div className="modal">
          <button className="modal-close" onClick={handleCloseModal}>&times;</button>
          
          {!showCodigoDescuento ? (
            <form className="email-form" onSubmit={handleEnviarCorreo}>
              <h3>¡Ingresa tu correo electrónico para recibir tu código de descuento!</h3>
              <input 
                type="email" 
                ref={emailInputRef}
                placeholder="tucorreo@ejemplo.com" 
                required 
              />
              <button type="submit" disabled={enviando}>
                {enviando ? 'Enviando...' : 'Enviar'}
              </button>
            </form>
          ) : (
            <div className="codigo-descuento">
              <h3>¡Tu código de descuento!</h3>
              <div className="codigo-descuento-img">
                <div className="codigo-texto">{codigo}</div>
                <div className="codigo-descripcion">
                  {premioSeleccionado && `Descuento del ${premioSeleccionado.valor}% en tu próxima visita`}
                </div>
              </div>
              <button 
                className="codigo-btn-cerrar" 
                onClick={handleCloseModal}
              >
                Cerrar
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}