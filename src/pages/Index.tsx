import { WeddingHero } from "@/components/WeddingHero";
import { WeddingDetails } from "@/components/WeddingDetails";
import { RSVPForm } from "@/components/RSVPForm";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Settings } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Fixed admin access button */}
      <div className="fixed top-4 right-4 z-50">
        <Link to="/auth">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Acceso Novios
          </Button>
        </Link>
      </div>
      
      <WeddingHero />
      <WeddingDetails />
      <RSVPForm />
    </div>
  );
};

export default Index;
