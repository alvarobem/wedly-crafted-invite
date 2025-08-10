import { WeddingHero } from "@/components/WeddingHero";
import { WeddingDetails } from "@/components/WeddingDetails";
import { RSVPForm } from "@/components/RSVPForm";
import PlaylistForm from "@/components/PlaylistForm";
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
      
      {/* Playlist Section */}
      <section className="py-20 bg-gradient-to-br from-secondary/10 to-primary/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Ayúdanos a crear la playlist perfecta</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comparte tus canciones favoritas y hagamos de esta celebración algo inolvidable con la música que todos amamos
            </p>
          </div>
          <PlaylistForm />
        </div>
      </section>
    </div>
  );
};

export default Index;
