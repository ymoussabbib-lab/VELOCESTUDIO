import type { Metadata } from 'next';
import { Archivo, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const archivo = Archivo({
  subsets: ['latin'],
  weight: ['400', '500', '600', '800', '900'],
  variable: '--font-archivo',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Veloce Studio — Casablanca Software Engineering Studio',
  description: 'Five businesses run their entire day on software we built. Bespoke operational systems, booking engines, POS, and access control.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${archivo.variable} ${jetbrainsMono.variable} scroll-smooth`}>
      <body className="bg-paper text-ink font-sans antialiased selection:bg-accent selection:text-paper min-h-screen">
        {children}
      </body>
    </html>
  );
}
