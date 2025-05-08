import FooterSection from "@/components/public-component/footer-section";
import Navbar from "@/components/public-component/navbar-component";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="font-sans">
      <Navbar />
      {children}
      <FooterSection/>
    </div>
  );
}
