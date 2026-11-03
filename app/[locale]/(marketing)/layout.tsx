import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ContactModal from "@/components/marketing/ContactModal";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
      <ContactModal />
    </>
  );
}
