import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Hero } from '@/components/home/Hero';
import { ProofStrip } from '@/components/home/ProofStrip';
import { ProblemSection } from '@/components/home/ProblemSection';
import { BusinessSelector } from '@/components/home/BusinessSelector';
import { ProductShowcase } from '@/components/home/ProductShowcase';
import { BeforeAfter } from '@/components/home/BeforeAfter';
import { ProcessSection } from '@/components/home/ProcessSection';
import { Deliverables } from '@/components/home/Deliverables';
import { FinalCTA } from '@/components/home/FinalCTA';
import { MobileStickyCTA } from '@/components/home/MobileStickyCTA';

export default function Home() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <Header />
      <main className="pb-20 md:pb-0">
        <Hero />
        <ProofStrip />
        <ProblemSection />
        <BusinessSelector />
        <ProductShowcase />
        <BeforeAfter />
        <ProcessSection />
        <Deliverables />
        <FinalCTA />
      </main>
      <Footer />
      <MobileStickyCTA />
    </div>
  );
}
