import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FloatingCTA from '@/components/layout/FloatingCTA';
import { EstimateProvider } from '@/components/guest/EstimateContext';

export default function ClientLayout({ children }) {
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
    </div>
  );
}
