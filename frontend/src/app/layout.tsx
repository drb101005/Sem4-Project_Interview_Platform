import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Interview Platform',
  description: 'Practice interviews with AI feedback',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-grid">
        <div className="min-h-screen">{children}</div>
      </body>
    </html>
  );
}
