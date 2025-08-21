import { WeddingHero } from "@/components/WeddingHero";
import { WeddingDetails } from "@/components/WeddingDetails";
import { RSVPForm } from "@/components/RSVPForm";
import { Faqs } from "@/components/Faqs";
import PlaylistForm from "@/components/PlaylistForm";
import { Heart, Copy, Check } from "lucide-react";
import {HamburgerMenu} from "@/components/ui/hamburger-menu"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPen, Info, Car, Music, MessageCircleQuestion, Gift } from 'lucide-react';


const Index = () => {
  const [copied, setCopied] = useState(false);
  const bankAccount = "ES82 0182 5322 2402 0133 3321";

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(bankAccount);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  const menuItems = [
    { icon: Info, label: 'Información', href: '/#wedding-details' },
    { icon: Car, label: 'Cómo llegar', href: '/#como-llegar' },
    { icon: UserPen, label: 'Confirma asistencia', href: '/#confirmation' },
    { icon: Music, label: 'Playlist', href: '/#playlist' },
    { icon: Gift, label: 'Regalo', href: '/#gifts' },
    { icon: MessageCircleQuestion, label: 'FAQs', href: '/#faqs' },
  ]

  const faqs = [
   {
      id: 'item-1',
      title: '¿A qué hora terminará la fiesta?',
      content: <p>La fiesta terminará alrededor de las 23:00 h, aunque prometemos que habrá tiempo de sobra para bailar, reír y brindar.</p>
    },
    {
      id: 'item-2',
      title: '¿Qué hago si quiero ir con un acompañante que no aparece en el formulario de confirmación?',
      content: <p>¡Nos encanta que quieras compartir el día con alguien especial! Pero necesitamos tener controlada la lista de invitados para que todo encaje a la perfección. Escríbenos directamente y vemos juntos cómo solucionarlo.</p>
    },
    {
      id: 'item-3',
      title: 'La finca tiene jardín, ¿habrá disponible cubretacones?',
      content: <p>¡Sí! Tendremos cubretacones disponibles para que puedas pasear y bailar por el jardín sin preocupaciones. </p>
    },
    {
      id: 'item-4',
      title: '¿Dondé me recogerá y dejará el autobús?',
      content: (<> 
        <p>Tendremos dos puntos de recogida y regreso por eso es muy importante que nos hagas saber en el formulario que servicio vas a usar:</p>
        <br/>
        <ul className="list-disc ml-8">
          <li>Salida desde Móstoles (para ir a la iglesia)<span className="text-xs font-black">*</span>: Calle Abogados de Atocha 1</li>
          <li>Salida desde Madrid: Calle Ferraz 74 (justo en la salida de la iglesia)</li>
        </ul>

        <br/>
        <ul className="list-disc ml-8">
          <li>Regreso a Móstoles: Calle Abogados de Atocha 1</li>
          <li>Regreso a Madrid: Intercambiador de Moncloa</li>
        </ul>

        <br/>
        <p className="italic">*El servicio de autobus desde Móstoles a la iglesia estará disponible en función de los invitados que hagan uso del mismo, os confirmaremos su disponibilidad con suficiente antelación.</p>
      </>)
      
      
    }
  ]

  return (
    <div className="min-h-screen">

      <HamburgerMenu 
        menuItems={menuItems}
        title="Menú"
        footerText=""
      />
      
      <WeddingHero />
      <WeddingDetails />
      <RSVPForm />
      
      {/* Playlist Section */}
      <section className="py-10" id="playlist">
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
      <section className="py-10 color-gray" id="gifts">
        
        <div className="mb-16 pb-8"
          style={{ zIndex: 1 }}>

          <div className="flex items-center justify-center gap-6 mb-10">
            <div className="flex-1 h-px bg-gray-300"></div>
            <div className="text-center">
              <div className="text-3xl">El mejor regalo sois vosotros</div>
            </div>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>
          <div className="text-center items-center justify-center mx-6">
            <p className="text-xl">
              Pero si queréis tener un detalle con nosotros para esta nueva etapa, os dejamos el número de cuenta:
            </p>
            <br></br>
            <div  onClick={copyToClipboard}
                  className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-3  transition-colors group">
              <p className="text-2xl m-auto">
                ES82 0182 5322 2402 0133 3321
              </p>
              <div className="flex-shrink-0">
                {copied ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : (
                  <Copy className="w-7 h-7 text-gray-400 group-hover:text-stone-600 transition-colors" />
                )}
              </div>
              
              {copied && (
                <span className="text-sm text-stone-600 font-medium animate-in fade-in duration-200">
                  ¡Copiado!
                </span>
            )}
            </div>
          </div>
        </div>
      </section>


      
      <Faqs items={faqs}/>
      


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
