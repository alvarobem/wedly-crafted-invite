import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Clock, Camera, Music, Gift } from "lucide-react";
import tailandia from "@/assets/Tailandia.png";
import { Button } from "@/components/ui/button";

export const WeddingDetails = () => {
  const events = [
    {
      title: "Ceremonia",
      time: "12:30",
      location: "Parroquia del Inmaculado Corazón de María",
      address: "Calle Ferraz 74",
      description: "La ceremonia religiosa donde uniremos nuestras vidas"
    },
    {
      title: "Celebración",
      time: "15:00",
      location: "La Cañada de Mónico",
      address: "Avenida de los Rosales 456",
      description: "Brindis y aperitivos en un ambiente íntimo"
    }
  ];

  const details = [
    {
      icon: <Camera className="w-6 h-6" />,
      title: "Fotografías",
      description: "Tendremos un fotógrafo profesional, pero también nos encantaría que compartas tus fotos usando #MariaYCarlos2024"
    },
    {
      icon: <Music className="w-6 h-6" />,
      title: "Música",
      description: "Habrá música en vivo durante la ceremonia y DJ para la fiesta. Si tienes alguna canción especial, ¡háznoslo saber!"
    },
    {
      icon: <Gift className="w-6 h-6" />,
      title: "Regalos",
      description: "Tu presencia es nuestro mejor regalo. Si deseas obsequiarnos algo, tenemos una lista de regalos disponible."
    }
  ];

  return (
    <section className="py-20 px-4 bg-background" id="wedding-details">

      <div className="text-center mb-16 relative">
        
        <div >
          <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
            Como ya sabéis, este 2025 empezó de la manera más especial que podíamos imaginar y es que empezamos nuevo viaje..
          </p>
          <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
            ¡Nos casamos!
          </p>
          <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
            Y nada nos puede hacer más ilusión que compartirlo con vosotros.
          </p>
          <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
            Mientras llega el gran día, os dejamos por aquí toda la información para que no os perdáis nada
          </p>
    
        </div>
        
        <img
          src= {tailandia}
          alt="Decoración"
          className="absolute right-0 bottom-0 sm:w-1/8 md:w-1/3 h-auto pointer-events-none select-none"
          style={{ zIndex: 0, 
            marginBottom: '-7rem',
          }}
        />
      </div>
      {/* Timeline */}
        <div className="mb-16 color-gray w-screen -mx-4 pb-8" 
          style={{zIndex:1}}>

            <div className="bg-white -mt-5 px-5 py-3 inline-block relative z-10 mx-auto ml-[25em] mb-8">
              Recuerda lo más importante... ¡LA FECHA!
            </div>
            {/* Bloque fecha */}
            <div className="flex items-center justify-center gap-6 mt-4 mb-6">
              <div className="flex-1 h-px bg-gray-300"></div>
              <div className="text-center">
                <div className="text-3xl font-serif">21 de febrero 2026</div>
                <div className="text-lg mt-1">12:30h</div>
              </div>
              <div className="flex-1 h-px bg-gray-300"></div> 
            </div>
          
          <div className="grid gap-6 md:grid-cols-2 mx-6">
            {events.map((event, index) => (
              <Card key={index} className="shadow-soft hover:shadow-elegant transition-all duration-300 group rounded-none">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xxl group-hover:text-romantic transition-colors">
                      {event.title}
                    </CardTitle>
                    <div className="flex items-center text-romantic font-medium">
                      <Clock className="w-4 h-4 mr-1" />
                      {event.time}
                    </div>
                  </div>
                </CardHeader>
                <div className="flex-1 h-px bg-gray-300 mx-10"></div> 
                <CardContent className="space-y-3">
                  <div>
                    <h4 className="font-medium text-foreground mb-1">{event.location}</h4>
                    <div className="flex items-start text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0 text-romantic" />
                      <span>{event.address}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {event.description}
                  </p>
                  <Button  size="xl" className="group uppercase rounded-none mx-auto">
                    Ver en mapa
                  </Button>
                </CardContent>
                
              </Card>
            ))}
          </div>
        </div>


      <div className="max-w-6xl mx-auto" >
        

        

        {/* Additional Details */}
        <div>
          <h3 className="text-2xl font-light text-center mb-8 text-foreground">
            Información Adicional
          </h3>
          <div className="grid gap-6 md:grid-cols-3">
            {details.map((detail, index) => (
              <Card key={index} className="shadow-soft hover:shadow-elegant transition-all duration-300 group text-center">
                <CardHeader>
                  <div className="text-romantic mx-auto mb-2 group-hover:scale-110 transition-transform">
                    {detail.icon}
                  </div>
                  <CardTitle className="text-lg group-hover:text-romantic transition-colors">
                    {detail.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {detail.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Dress Code */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto shadow-soft bg-gradient-elegant">
            <CardHeader>
              <CardTitle className="text-xl text-romantic">Código de Vestimenta</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                <strong>Formal / Elegante</strong><br />
                Te sugerimos colores en tonos pasteles, evitando el blanco que está reservado para la novia. 
                Los hombres pueden usar traje oscuro o claro, y las mujeres vestido elegante o conjunto formal.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};