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
  title: 'Veloce Studio - Business Software Systems for Local Businesses',
  description: 'Custom business software for gyms, salons, restaurants, real-estate agencies and growing businesses in Sale, Rabat, Casablanca and beyond.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${archivo.variable} ${jetbrainsMono.variable} scroll-smooth`}>
      <body className="min-h-screen bg-paper font-sans text-ink antialiased selection:bg-accent selection:text-paper">
        {children}
      </body>
    </html>
  );
}
