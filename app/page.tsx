import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans flex flex-col">
      <Navbar />

      {/* Phần nội dung chính (flex-grow để đẩy Footer xuống dưới cùng nếu màn hình quá cao) */}
      <div className="flex-grow">
        <HeroSection />
        <FeaturesSection />
      </div>

      <Footer />
    </div>
  );
}
