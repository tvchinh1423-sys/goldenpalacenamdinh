import './globals.css';
import { Inter, Playfair_Display } from 'next/font/google';

const inter = Inter({ subsets: ['latin', 'vietnamese'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin', 'vietnamese'], variable: '--font-playfair' });

export const metadata = {
  title: 'Golden Palace - Dự trù chi phí tiệc cưới',
  description: 'Công cụ tính toán và dự trù chi phí tiệc cưới tại Golden Palace Nam Định.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-surface text-on-surface antialiased flex flex-col min-h-screen">
        {children}
      </body>
    </html>
  );
}
