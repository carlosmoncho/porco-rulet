export const metadata = {
  title: 'Ruleta de Descuentos - Porco Diavolo',
  description: 'Gira la ruleta y gana descuentos exclusivos en Porco Diavolo',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning={true}>
        {/* Script para cargar EmailJS */}
        <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js" defer></script>
        {children}
      </body>
    </html>
  )
}
