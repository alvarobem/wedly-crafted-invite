import { Button } from "@/components/ui/button";
import { Heart, Calendar } from "lucide-react";
import heroImage from "@/assets/wedding-hero.jpg";
import heroImage1 from "@/assets/cabecera.png";
import logo from "@/assets/logo.png";

export const WeddingHero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${heroImage1})`,
          zIndex:1
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <img src={logo} alt="Wedding Hero" className="max-w-xs w-full h-auto mb-6 mx-auto animate-pulse" />
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6" />
         
        </div>
        
        <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
          <div className="flex items-center justify-center gap-3 text-black/90 mb-8">
            <Calendar className="w-6 h-6 text-gold" />
            <span className="text-lg md:text-xl font-light">15 de Junio, 2024</span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
          <Button  size="xl" className="group uppercase rounded-none">
            Confirmar tu Asistencia
          </Button>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center z-20">
        <span className="animate-bounce cursor-pointer transition-transform hover:scale-110"
          onClick={() => {
          document.getElementById("wedding-details")?.scrollIntoView({ behavior: "smooth" });
        }}>
          <svg width="32" height="32" fill="none" viewBox="0 0 24 24" className="text-white">
            <path d="M12 5v14m0 0l-7-7m7 7l7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </div>


      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-4 h-4 bg-gold/30 rounded-full animate-pulse" />
      <div className="absolute top-40 right-20 w-6 h-6 bg-romantic-light/20 rounded-full animate-pulse delay-1000" />
      <div className="absolute bottom-32 left-20 w-3 h-3 bg-champagne/40 rounded-full animate-pulse delay-500" />
    </section>
  );
};