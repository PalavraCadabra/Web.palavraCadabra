import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import './globals.css';

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800', '900'],
  variable: '--font-nunito',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Palavra Cadabra — Comunicação para todos',
  description:
    'Plataforma de comunicação aumentativa e alternativa (CAA) que dá voz a pessoas não verbais, com alfabetização integrada e pesquisa científica.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`h-full antialiased scroll-smooth ${nunito.variable}`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
