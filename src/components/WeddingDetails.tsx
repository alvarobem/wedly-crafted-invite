import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Camera, Music, Gift, CirclePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MapDialog } from "@/components/MapDialog";
import { useState } from "react";
import { Popover, PopoverTrigger } from "./ui/popover";
import { PopoverContent } from "@radix-ui/react-popover";

export const WeddingDetails = () => {
  const [selectedLocation, setSelectedLocation] = useState<{
    title: string;
    address: string;
    coordinates: [number, number];
  } | null>(null);

  const events = [
    {
      title: "Ceremonia",
      time: "12:30",
      location: "Parroquia del Inmaculado Corazón de María",
      address: "Calle Ferraz 74, Madrid",
      description: "",
      coordinates: [40.429183, -3.720136] as [number, number] // Madrid coordinates - update with real ones
    },
    {
      title: "Celebración",
      time: "15:00",
      location: "La Cañada de Mónico",
      address: "La Cañada de Mónico, Km. 1,600, M-533, kilometro 1-600, 28211 Peralejo, Madrid",
      description: "",
      coordinates: [40.539001, -4.128373] as [number, number] // Madrid coordinates - update with real ones
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
    <section className="py-10 px-4 bg-background" id="wedding-details">

      <div className="text-center mb-16 relative py-10">

        <div >
          <p className="text-xl text-muted-foreground mx-auto text-stone-600">
            Como ya sabéis, este 2025 empezó de la manera más especial que podíamos imaginar y es que empezamos nuevo viaje...
          </p>
          <br></br>
          <p className="text-xl text-muted-foreground mx-auto text-stone-600">
            ¡Nos casamos!
          </p>
          <br></br>
          <p className="text-xl text-muted-foreground mx-auto text-stone-600">
            Y nada nos puede hacer más ilusión que compartirlo con vosotros.
          </p>
          <br></br>
          <p className="text-xl text-muted-foreground mx-auto text-stone-600">
            Mientras llega el gran día, os dejamos por aquí toda la información para que no os perdáis nada
          </p>

        </div>

        
      </div>
      {/* Timeline */}
      <div className="mb-16 color-gray -mx-4 pb-12"
        style={{ zIndex: 1 }}>

        <div className="flex justify-center text-center">
          <div className="bg-white -mt-5 px-5 py-3 inline-block relative z-10 mb-8 text-3xl">
            Recuerda lo más importante... ¡LA FECHA!
          </div>
        </div>
        {/* Bloque fecha */}
        <div className="flex items-center justify-center gap-6 mt-4 mb-8">
          <div className="flex-1 h-px bg-gray-300"></div>
          <div className="text-center">
            <div className="text-4xl font-serif">21 de febrero 2026</div>
          </div>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mx-10 text-center">
          {events.map((event, index) => (
            <Card key={index} className="shadow-soft hover:shadow-elegant transition-all duration-300 group rounded-none">
              <CardHeader className="pb-3">
                <div className="flex justify-center">
                  <CardTitle className="text-xxl group-hover:text-romantic transition-colors">
                    {event.title} - {event.time} h
                  </CardTitle>
                </div>
              </CardHeader>
              <div className="flex-1 h-px bg-gray-300 mx-10"></div>
              <CardContent className="space-y-3">
                <div className="h-5"></div>
                <div className="mx-auto">
                  <h4 className="text-lg text-foreground mb-1">{event.location}</h4>
                  <div className="flex items-center justify-center text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-1 mt-0.5 text-romantic" />
                    <span className="">{event.address}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {event.description}
                </p>
                <Button
                  size="xl"
                  className="group uppercase rounded-none mx-auto text-stone-600"
                  onClick={() => setSelectedLocation({
                    title: event.location,
                    address: event.address,
                    coordinates: event.coordinates
                  })}
                >
                  Ver en mapa
                </Button>
              </CardContent>

            </Card>
          ))}
        </div>
      </div>

      <div className="mb-16 -mx-4 "
        style={{ zIndex: 1 }} id="como-llegar">

        <div className="flex items-center justify-center gap-6 mt-4 mb-10">
          <div className="flex-1 h-px bg-gray-300"></div>
          <div className="text-center">
            <div className="text-3xl font-serif">¿Cómo llegar?</div>
          </div>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mx-10">
          <Card key="bus" className="shadow-soft hover:shadow-elegant transition-all duration-300 group rounded-none">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-center">
                <CardTitle className="text-xxl group-hover:text-romantic transition-colors">
                  En autobús
                </CardTitle>
              </div>
            </CardHeader>
            <div className="flex-1 h-px bg-gray-300 mx-10"></div>
            <CardContent className="space-y-3">
              <div className="h-5"></div>
              <div className="">
                <p className="text-lg text-muted-foreground leading-relaxed text-center text-stone-800">
                  Pondremos autobuses de la Iglesia a la finca para que solo os preocupéis de disfrutar al máximo. La vuelta se hará en un solo turno con destino Móstoles y Moncloa al finalizar la fiesta.
                </p>
                <br/>
                <p className="text-lg text-muted-foreground leading-relaxed text-center">
                  ¿Necesitas autobús para ir de Móstoles a la Iglesia?
                </p>
                <div className="flex items-center justify-center">
                  
                  <Popover>
                    <PopoverTrigger>
                      <CirclePlus className="flex-shrink-0  text-stone-400"/>
                    </PopoverTrigger>
                    <PopoverContent side="top" className="bg-popover text-popover-foreground border shadow-md p-5 mb-3 w-70 max-w-[90vw] md:max-w-[40vw]">
                      <div className="space-y-2 bg-white">
                        <p className="text-sm text-muted-foreground text-center">
                          En función de la cantidad de invitados que necesiten el traslado desde Móstoles a la iglesia habilitaremos este autobús.
                        </p>
                        <br/>
                        <p className="text-sm text-muted-foreground text-center">
                          Haznos saber en el formulario de confirmación si necesitas este transporte indicando salida desde Móstoles. 
                        </p>
                        <br/>
                        <p className="text-sm text-muted-foreground text-center">
                         Os confirmaremos con suficiente antelación si finalmente dispondremos de este transporte o no. 
                        </p>
                      </div>
                    </PopoverContent>
                    
                  </Popover>
                </div>
                
              </div>
              
            </CardContent>
          </Card>

          <Card key="coche" className="shadow-soft hover:shadow-elegant transition-all duration-300 group rounded-none">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-center">
                <CardTitle className="text-xxl group-hover:text-romantic transition-colors">
                  En coche
                </CardTitle>
              </div>
            </CardHeader>
            <div className="flex-1 h-px bg-gray-300 mx-10"></div>
            <CardContent className="space-y-3">
              <div className="h-5"></div>
              <p className="text-lg text-muted-foreground leading-relaxed text-center text-stone-800">
                Hay parking subterráneo junto a la iglesia.
              </p>
              <Button
                  size="lg"
                  className="group uppercase rounded-none mx-auto flex items-center text-stone-600"
                  onClick={() => setSelectedLocation({
                    title: "Parking Iglesia",
                    address: "C. del Marqués de Urquijo, 20",
                    coordinates: [40.429830, -3.719070]
                  })}
                >
                  Ver en mapa
                </Button>
              <p className="text-lg text-muted-foreground leading-relaxed text-center">
                La finca cuenta con parking amplio para todo el que quiera ir en coche.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <MapDialog
        isOpen={!!selectedLocation}
        onClose={() => setSelectedLocation(null)}
        title={selectedLocation?.title || ""}
        address={selectedLocation?.address || ""}
        coordinates={selectedLocation?.coordinates || [0, 0]}
      />
      
    </section>

    
  );
};