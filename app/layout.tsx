import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Veloce Studio | Custom B2B Software Engineering',
  description: 'Production-ready web platforms, internal CRMs, booking engines, and customer management systems.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-obsidian text-brightText antialiased selection:bg-accentCyan selection:text-obsidian">
        {children}
      </body>
    </html>
  );
}
