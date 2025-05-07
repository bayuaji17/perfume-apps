import FooterSection from "@/components/public-component/footer-section";
import HeroSection from "@/components/public-component/hero-section";
import Navbar from "@/components/public-component/navbar-component";
import ScentSection from "@/components/public-component/scent-section";


export default function Home() {
  return (
    <div>
      <Navbar/>
      <HeroSection/>
      <ScentSection/>
      <FooterSection/>
    </div>
  );
}
