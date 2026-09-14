import './globals.css';
import { Montserrat, Playfair_Display, Great_Vibes, Lora, Cormorant_Garamond, Ballet, Alex_Brush } from 'next/font/google';
import Script from 'next/script';
import PwaRegister from '@/components/pwa/PwaRegister';

const montserrat = Montserrat({ subsets: ['latin', 'vietnamese'], variable: '--font-montserrat' });
const playfair = Playfair_Display({ subsets: ['latin', 'vietnamese'], variable: '--font-playfair' });
const greatVibes = Great_Vibes({ weight: '400', subsets: ['latin', 'vietnamese'], variable: '--font-greatvibes' });
const lora = Lora({ subsets: ['latin', 'vietnamese'], style: ['italic', 'normal'], variable: '--font-lora' });
const cormorant = Cormorant_Garamond({ weight: ['400', '600', '700'], subsets: ['latin', 'vietnamese'], style: ['italic', 'normal'], variable: '--font-cormorant' });
const ballet = Ballet({ subsets: ['latin', 'vietnamese'], variable: '--font-ballet' });
const alexBrush = Alex_Brush({ weight: '400', subsets: ['latin', 'vietnamese'], variable: '--font-alexbrush' });

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://goldenpalace.vn';
const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

export const viewport = {
  themeColor: '#D4AF37',
};

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Golden Palace - Nơi Khởi Đầu Hạnh Phúc Trọn Vẹn | Tiệc Cưới & Sự Kiện Nam Định',
    template: '%s | Golden Palace Nam Định',
  },
  description: 'Trung tâm Tổ chức Sự kiện, Tiệc cưới & Nhà hàng sang trọng hàng đầu tại Nam Định. Không gian lộng lẫy, ẩm thực đẳng cấp và dịch vụ chuyên nghiệp.',
  keywords: [
    'Golden Palace',
    'Golden Palace Nam Định',
    'Đặt tiệc cưới Nam Định',
    'Trung tâm tiệc cưới Nam Định',
    'Nhà hàng tiệc cưới Nam Định',
    'Tổ chức sự kiện Nam Định',
    'Hội nghị Nam Định',
  ],
  authors: [{ name: 'Golden Palace Nam Định' }],
  creator: 'Golden Palace Nam Định',
  publisher: 'Golden Palace Nam Định',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Golden Palace',
  },
  openGraph: {
    title: 'Golden Palace - Trung Tâm Tiệc Cưới & Sự Kiện Nam Định',
    description: 'Nơi tổ chức tiệc cưới, hội nghị và sự kiện đẳng cấp hàng đầu Nam Định.',
    url: baseUrl,
    siteName: 'Golden Palace Nam Định',
    locale: 'vi_VN',
    type: 'website',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Golden Palace Nam Định',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Golden Palace Nam Định',
    description: 'Trung Tâm Tiệc Cưới & Sự Kiện Đẳng Cấp Tại Nam Định',
    images: ['/logo.png'],
  },
  verification: {
    google: googleVerification || undefined,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// Dữ liệu cấu trúc JSON-LD cho Google Search Console & SEO Rich Snippets
const jsonLdSchema = {
  '@context': 'https://schema.org',
  '@type': ['Restaurant', 'EventVenue'],
  name: 'Golden Palace Nam Định',
  image: `${baseUrl}/logo.png`,
  '@id': baseUrl,
  url: baseUrl,
  telephone: '+84',
  priceRange: '$$$',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Nam Định',
    addressLocality: 'Nam Định',
    addressRegion: 'Nam Định',
    postalCode: '41000',
    addressCountry: 'VN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 20.4285,
    longitude: 106.1683,
  },
  servesCuisine: ['Tiệc cưới', 'Hội nghị', 'Ẩm thực Việt Nam', 'Á - Âu'],
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '08:00',
      closes: '22:00',
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" className={`${montserrat.variable} ${playfair.variable} ${greatVibes.variable} ${lora.variable} ${cormorant.variable} ${ballet.variable} ${alexBrush.variable}`}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Ballet:opsz@16..72&family=Dancing+Script:wght@500;600;700&family=Great+Vibes&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=Lora:ital,wght@0,400;0,600;1,400;1,600&display=swap" rel="stylesheet" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/logo-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Golden Palace" />
        
        {/* Schema.org Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
        />
      </head>
      <body className="bg-surface text-on-surface antialiased flex flex-col min-h-screen">
        {children}
        <PwaRegister />

        {/* Google Analytics 4 (GA4) Tracker */}
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}

