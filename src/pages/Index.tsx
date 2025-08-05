import { WeddingHero } from "@/components/WeddingHero";
import { WeddingDetails } from "@/components/WeddingDetails";
import { RSVPForm } from "@/components/RSVPForm";

const Index = () => {
  return (
    <div className="min-h-screen">
      <WeddingHero />
      <WeddingDetails />
      <RSVPForm />
    </div>
  );
};

export default Index;
