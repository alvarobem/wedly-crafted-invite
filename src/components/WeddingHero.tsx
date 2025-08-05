import { Button } from "@/components/ui/button";
import { Heart, Calendar } from "lucide-react";
import heroImage from "@/assets/wedding-hero.jpg";

export const WeddingHero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${heroImage})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <Heart className="w-16 h-16 text-romantic-light mx-auto mb-6 animate-pulse" />
          <h1 className="text-5xl md:text-7xl font-light text-white mb-4 tracking-wide">
            María & Carlos
          </h1>
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6" />
          <p className="text-xl md:text-2xl text-white/90 font-light tracking-wider">
            Celebrando nuestro amor
          </p>
        </div>
        
        <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
          <div className="flex items-center justify-center gap-3 text-white/90 mb-8">
            <Calendar className="w-6 h-6 text-gold" />
            <span className="text-lg md:text-xl font-light">15 de Junio, 2024</span>
          </div>
          <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
            Nos complace invitarte a compartir este día tan especial con nosotros. 
            Tu presencia hará que nuestro momento sea aún más mágico.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
          <Button variant="romantic" size="xl" className="group">
            Confirmar Asistencia
            <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </Button>
          <Button variant="elegant" size="xl">
            Ver Detalles
          </Button>
        </div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-4 h-4 bg-gold/30 rounded-full animate-pulse" />
      <div className="absolute top-40 right-20 w-6 h-6 bg-romantic-light/20 rounded-full animate-pulse delay-1000" />
      <div className="absolute bottom-32 left-20 w-3 h-3 bg-champagne/40 rounded-full animate-pulse delay-500" />
    </section>
  );
};