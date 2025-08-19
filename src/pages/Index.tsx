import { WeddingHero } from "@/components/WeddingHero";
import { WeddingDetails } from "@/components/WeddingDetails";
import { RSVPForm } from "@/components/RSVPForm";
import PlaylistForm from "@/components/PlaylistForm";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Heart, Settings } from "lucide-react";

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
      <section className="py-10">
        <div className="flex items-center justify-center gap-6 mt-4 mb-10">
          <div className="flex-1 h-px bg-gray-300"></div>
          <div className="text-center">
            <div className="text-3xl font-serif">¡Que no falte la música!</div>
          </div>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-muted-foreground mx-auto text-lg text-stone-600">
              Nos encantaría que nos dijeras esa canción que no puede faltar en tu fiesta perfecta... ¡queremos que se haga realidad!
            </p>
          </div>
          <PlaylistForm />
        </div>
      </section>

      {/* Regalo */}
      <section className="py-10 color-gray">
        
        <div className="mb-16 w-screen -mx-4 pb-8"
          style={{ zIndex: 1 }}>

          <div className="flex items-center justify-center gap-6 mb-10">
            <div className="flex-1 h-px bg-gray-300"></div>
            <div className="text-center">
              <div className="text-3xl font-serif">El mejor regalo sois vosotros</div>
            </div>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>
          <div className="text-center items-center justify-center">
            <p className="text-xl">
              Pero si queréis tener un detalle con nosotros para esta nueva etapa, os dejamos el número de cuenta:
            </p>
            <br></br>
            <div>
              <p className="text-2xl m-auto">
                ES82 0182 5322 2402 0133 3321
              </p>
            </div>
          </div>
        </div>
      </section>


      <footer className="bg-white  shadow-sm ">
          <div className="w-full mx-auto  p-5 flex items-center justify-center">
            <div className="flex text-sm text-stone-600 sm:text-center dark:text-stone-400">
              <p className="mr-1">© 2025. Hecho con  </p>
              <Heart className="w-4 h-4"></Heart>
              <p className="ml-1">por Marta y Álvaro.</p>
          </div>
          
          </div>
      </footer>

    </div>

  );
};

export default Index;
