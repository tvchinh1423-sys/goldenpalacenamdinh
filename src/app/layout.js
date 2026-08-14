import './globals.css';
import { Montserrat, Playfair_Display, Great_Vibes } from 'next/font/google';

const montserrat = Montserrat({ subsets: ['latin', 'vietnamese'], variable: '--font-montserrat' });
const playfair = Playfair_Display({ subsets: ['latin', 'vietnamese'], variable: '--font-playfair' });
const greatVibes = Great_Vibes({ weight: '400', subsets: ['latin', 'vietnamese'], variable: '--font-greatvibes' });

export const metadata = {
  title: 'Golden Palace - Nơi khởi đầu hạnh phúc trọn vẹn',
  description: 'Trung tâm tổ chức Sự kiện, Tiệc cưới & Nhà hàng Golden Palace Nam Định',
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" className={`${montserrat.variable} ${playfair.variable} ${greatVibes.variable}`}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-surface text-on-surface antialiased flex flex-col min-h-screen">
        {children}
      </body>
    </html>
  );
}
