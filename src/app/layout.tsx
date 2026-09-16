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
      <body className="bg-slate-50 text-slate-900 font-sans antialiased selection:bg-emerald-500 selection:text-white dark:bg-slate-950 dark:text-slate-100">
        {children}
      </body>
    </html>
  );
}