'use client';

import { useState, useEffect } from 'react';
import RuletaDescuentos from '../components/RuletaDescuentos';
import './globals.css';

export default function Home() {
  // Estado para controlar si estamos en el cliente
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Marcar que el componente está montado (cliente)
    setIsMounted(true);
    
    // Inicializar EmailJS solo en el cliente
    if (typeof window !== 'undefined' && typeof window.emailjs !== 'undefined') {
      window.emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY);
    }
  }, []);

  // Solo renderizar el componente de la ruleta cuando estamos en el cliente
  // Esto evita problemas de hidratación
  if (!isMounted) {
    return null; // O un loader/skeleton mientras se carga
  }

  return (
    <main>
      <RuletaDescuentos />
    </main>
  );
}
