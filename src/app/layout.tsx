import type { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from '@/components/common/GoogleSnackbar';

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
      <body className="bg-google-surface-light text-slate-900 antialiased selection:bg-google-blue-600 selection:text-white dark:bg-google-surface-dark dark:text-zinc-100">
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
