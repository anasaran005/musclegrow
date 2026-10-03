import type { Metadata, Viewport } from 'next';
import './globals.css';
import { BRAND } from '@/config/brand';
import { Navbar } from '@/components/layout/Navbar';
import { BottomNav } from '@/components/layout/BottomNav';
import { Footer } from '@/components/layout/Footer';
import { FloatingWhatsApp } from '@/components/layout/FloatingWhatsApp';
import { StoreHydration } from '@/components/providers/StoreHydration';

export const metadata: Metadata = {
  title: {
    default: `${BRAND.name} - Calorie & Protein Measured Meals in Coimbatore`,
    template: `%s | ${BRAND.name}`,
  },
  description: BRAND.shortDescription,
  manifest: '/manifest.json',
  metadataBase: new URL('https://musclegrow.fit'),
  keywords: [
    'meal subscription Coimbatore',
    'protein food Coimbatore',
    'calorie counted meals',
    'healthy food delivery RS Puram',
    'diet food Peelamedu',
    'gym diet Coimbatore',
    'high protein lunch box',
  ],
  authors: [{ name: BRAND.name }],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://musclegrow.fit',
    title: `${BRAND.name} - Every Gram Counted`,
    description: BRAND.tagline,
    siteName: BRAND.name,
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: `${BRAND.name} Fresh Healthy Meals`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: BRAND.name,
    description: BRAND.tagline,
  },
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#14532D',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FoodEstablishment',
    name: BRAND.name,
    description: BRAND.tagline,
    url: 'https://musclegrow.fit',
    telephone: BRAND.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: '142, D.B. Road, RS Puram',
      addressLocality: 'Coimbatore',
      addressRegion: 'Tamil Nadu',
      postalCode: '641002',
      addressCountry: 'IN',
    },
    servesCuisine: 'South Indian, High-Protein, Healthy Bowls, Millets',
    priceRange: '₹250 - ₹350',
    areaServed: {
      '@type': 'City',
      name: 'Coimbatore',
    },
  };

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-background text-gray-900 antialiased selection:bg-lime-brand/30 selection:text-primary">
        <StoreHydration />
        <Navbar />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
        <FloatingWhatsApp />
        <BottomNav />
      </body>
    </html>
  );
}
