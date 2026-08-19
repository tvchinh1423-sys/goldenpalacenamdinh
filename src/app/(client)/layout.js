'use client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FloatingCTA from '@/components/layout/FloatingCTA';
import FeedbackWidget from '@/components/layout/FeedbackWidget';
import { EstimateProvider } from '@/components/guest/EstimateContext';
import { usePathname } from 'next/navigation';

export default function ClientLayout({ children }) {
  const pathname = usePathname();

  // Hide site-wide Header, Footer, CTA & Feedback widget for standalone shared card links
  const isStandaloneCard = pathname?.startsWith('/thiep/') || pathname?.startsWith('/du-toan-chi-phi/link/');

  if (isStandaloneCard) {
    return (
      <div className="min-h-screen bg-[#faf6f0]">
        <EstimateProvider>
          {children}
        </EstimateProvider>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20">
        <EstimateProvider>
          {children}
        </EstimateProvider>
      </main>
      <Footer />
      <FloatingCTA />
      <FeedbackWidget />
    </div>
  );
}
