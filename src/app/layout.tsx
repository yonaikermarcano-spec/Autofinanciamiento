import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AutoLending OS - Sistema Integral de Financiamiento Vehicular',
  description: 'Plataforma todo-en-uno para Financiadoras de Vehículos B2C/B2B en Venezuela',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="g-app-shell bg-[var(--bg)] text-[var(--text)] antialiased selection:bg-[var(--primary)] selection:text-white">
        {children}
      </body>
    </html>
  );
}
