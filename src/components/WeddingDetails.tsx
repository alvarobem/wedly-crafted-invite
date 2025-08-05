import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Clock, Camera, Music, Gift } from "lucide-react";

export const WeddingDetails = () => {
  const events = [
    {
      title: "Ceremonia",
      time: "16:00",
      location: "Iglesia de San Francisco",
      address: "Calle Principal 123, Centro Histórico",
      description: "La ceremonia religiosa donde uniremos nuestras vidas"
    },
    {
      title: "Cóctel",
      time: "17:30",
      location: "Jardines del Hotel Boutique",
      address: "Avenida de los Rosales 456",
      description: "Brindis y aperitivos en un ambiente íntimo"
    },
    {
      title: "Cena y Fiesta",
      time: "20:00",
      location: "Salón de Eventos Villa Romántica",
      address: "Carretera a las Flores Km 5",
      description: "Cena de gala seguida de música y baile hasta el amanecer"
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
    <section className="py-20 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-light text-foreground mb-4">
            Detalles del Evento
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Toda la información que necesitas para acompañarnos en este día tan especial
          </p>
        </div>

        {/* Timeline */}
        <div className="mb-16">
          <h3 className="text-2xl font-light text-center mb-8 text-foreground">
            Cronograma del Día
          </h3>
          <div className="grid gap-6 md:grid-cols-3">
            {events.map((event, index) => (
              <Card key={index} className="shadow-soft hover:shadow-elegant transition-all duration-300 group">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl group-hover:text-romantic transition-colors">
                      {event.title}
                    </CardTitle>
                    <div className="flex items-center text-romantic font-medium">
                      <Clock className="w-4 h-4 mr-1" />
                      {event.time}
                    </div>
                  </div>
                </CardHeader>
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
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

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