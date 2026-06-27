import Navbar from "../components/layout/Navbar";
import Hero from "../components/layout/Hero";
import FeaturesSection from "../components/layout/FeaturesSection";
import Footer from "../components/layout/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
}
