import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Heart, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DBGuest {
  id: string;
  name: string;
  group_name: string;
  attending: boolean | null;
  bus_departure: string | null;
  bus_return: string | null;
  dietary_restrictions: string | null;
  special_notes: string | null;
}

interface GuestData {
  id: string;
  name: string;
  attending: boolean;
  dietaryRestrictions: string;
  busDeparture: string;
  busReturn: string;
  specialNotes: string;
}

export const RSVPForm = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [foundGuests, setFoundGuests] = useState<DBGuest[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [guestData, setGuestData] = useState<GuestData[]>([]);
  const [useSameBusConfig, setUseSameBusConfig] = useState(false);
  const [groupBusConfig, setGroupBusConfig] = useState({
    departure: "",
    return: ""
  });

  const searchGuests = async (query: string) => {
    if (query.length < 3) {
      setFoundGuests([]);
      return;
    }

    setIsSearching(true);
    try {
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .ilike('name', `%${query}%`)
        .limit(1);

      if (error) {
        console.error('Search error:', error);
        return;
      }

      if (data && data.length > 0) {
        // Get all guests from the same group
        const { data: groupGuests, error: groupError } = await supabase
          .from('guests')
          .select('*')
          .eq('group_name', data[0].group_name)
          .order('name');

        if (groupError) {
          console.error('Group search error:', groupError);
          return;
        }

        setFoundGuests(groupGuests || []);
      } else {
        setFoundGuests([]);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      searchGuests(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const startWizard = () => {
    const initialData = foundGuests.map(guest => ({
      id: guest.id,
      name: guest.name,
      attending: guest.attending !== null ? guest.attending : true,
      dietaryRestrictions: guest.dietary_restrictions || "",
      busDeparture: guest.bus_departure || "",
      busReturn: guest.bus_return || "",
      specialNotes: guest.special_notes || ""
    }));
    setGuestData(initialData);
    setCurrentStep(0);
    setShowWizard(true);
  };

  const updateGuestData = (guestId: string, field: keyof GuestData, value: any) => {
    setGuestData(prev => 
      prev.map(guest => 
        guest.id === guestId ? { ...guest, [field]: value } : guest
      )
    );
  };

  const applyBusConfigToAll = () => {
    if (useSameBusConfig) {
      setGuestData(prev => 
        prev.map(guest => ({
          ...guest,
          busDeparture: groupBusConfig.departure,
          busReturn: groupBusConfig.return
        }))
      );
    }
  };

  useEffect(() => {
    applyBusConfigToAll();
  }, [groupBusConfig, useSameBusConfig]);

  const nextStep = () => {
    if (currentStep < guestData.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      // Update all guests in the database
      for (const guest of guestData) {
        const { error } = await supabase
          .from('guests')
          .update({
            attending: guest.attending,
            dietary_restrictions: guest.dietaryRestrictions,
            bus_departure: guest.busDeparture,
            bus_return: guest.busReturn,
            special_notes: guest.specialNotes
          })
          .eq('id', guest.id);

        if (error) {
          console.error('Update error:', error);
          toast({
            title: "Error",
            description: "Hubo un problema al actualizar la información",
            variant: "destructive",
          });
          return;
        }
      }

      const attendingCount = guestData.filter(g => g.attending).length;
      toast({
        title: "¡Confirmación recibida!",
        description: `Gracias por confirmar. ${attendingCount} de ${guestData.length} invitados asistirán.`,
      });

      // Reset form
      setShowWizard(false);
      setFoundGuests([]);
      setSearchQuery("");
      setGuestData([]);
      setCurrentStep(0);
    } catch (error) {
      console.error('Submit error:', error);
      toast({
        title: "Error",
        description: "Hubo un problema al enviar la confirmación",
        variant: "destructive",
      });
    }
  };

  if (showWizard && guestData.length > 0) {
    const currentGuest = guestData[currentStep];
    
    return (
      <section className="py-20 px-4 bg-gradient-elegant">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Heart className="w-12 h-12 text-romantic mx-auto mb-4" />
            <h2 className="text-4xl font-light text-foreground mb-4">
              Confirmación de Asistencia
            </h2>
            <p className="text-lg text-muted-foreground">
              Paso {currentStep + 1} de {guestData.length}: {currentGuest.name}
            </p>
          </div>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Información de {currentGuest.name}</CardTitle>
              <CardDescription>
                Por favor, completa la información para este invitado
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Attendance */}
              <div className="space-y-2">
                <Label className="text-base font-medium">¿Asistirá a la boda?</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`attending-${currentGuest.id}`}
                    checked={currentGuest.attending}
                    onCheckedChange={(checked) => 
                      updateGuestData(currentGuest.id, 'attending', checked)
                    }
                  />
                  <Label htmlFor={`attending-${currentGuest.id}`}>
                    Sí, asistiré
                  </Label>
                </div>
              </div>

              {currentGuest.attending && (
                <>
                  {/* Dietary Restrictions */}
                  <div className="space-y-2">
                    <Label className="text-base font-medium">Restricciones alimentarias</Label>
                    <Input
                      value={currentGuest.dietaryRestrictions}
                      onChange={(e) => updateGuestData(currentGuest.id, 'dietaryRestrictions', e.target.value)}
                      placeholder="Ej: Vegetariano, sin gluten, alergias..."
                    />
                  </div>

                  {/* Bus Configuration */}
                  {currentStep === 0 && (
                    <div className="space-y-4 p-4 border border-border rounded-lg bg-muted/20">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="same-bus-config"
                          checked={useSameBusConfig}
                          onCheckedChange={(checked) => setUseSameBusConfig(checked === true)}
                        />
                        <Label htmlFor="same-bus-config" className="font-medium">
                          Usar la misma configuración de bus para todo el grupo
                        </Label>
                      </div>
                      
                      {useSameBusConfig && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Bus de salida</Label>
                            <Select 
                              value={groupBusConfig.departure}
                              onValueChange={(value) => setGroupBusConfig(prev => ({...prev, departure: value}))}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar salida" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="">No necesito bus</SelectItem>
                                <SelectItem value="Salida desde Móstoles">Salida desde Móstoles</SelectItem>
                                <SelectItem value="Salida desde Madrid">Salida desde Madrid</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Bus de vuelta</Label>
                            <Select 
                              value={groupBusConfig.return}
                              onValueChange={(value) => setGroupBusConfig(prev => ({...prev, return: value}))}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar vuelta" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="">No necesito bus</SelectItem>
                                <SelectItem value="Vuelta a Móstoles">Vuelta a Móstoles</SelectItem>
                                <SelectItem value="Vuelta a Madrid">Vuelta a Madrid</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {!useSameBusConfig && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>¿Utilizarás el bus para la salida?</Label>
                        <Select 
                          value={currentGuest.busDeparture}
                          onValueChange={(value) => updateGuestData(currentGuest.id, 'busDeparture', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar salida" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">No necesito bus</SelectItem>
                            <SelectItem value="Salida desde Móstoles">Salida desde Móstoles</SelectItem>
                            <SelectItem value="Salida desde Madrid">Salida desde Madrid</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>¿Utilizarás el bus para la vuelta?</Label>
                        <Select 
                          value={currentGuest.busReturn}
                          onValueChange={(value) => updateGuestData(currentGuest.id, 'busReturn', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar vuelta" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">No necesito bus</SelectItem>
                            <SelectItem value="Vuelta a Móstoles">Vuelta a Móstoles</SelectItem>
                            <SelectItem value="Vuelta a Madrid">Vuelta a Madrid</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {/* Special Notes */}
                  <div className="space-y-2">
                    <Label className="text-base font-medium">¿Hay algo especial que quieras compartir con nosotros?</Label>
                    <Textarea
                      value={currentGuest.specialNotes}
                      onChange={(e) => updateGuestData(currentGuest.id, 'specialNotes', e.target.value)}
                      placeholder="Escribe cualquier comentario especial..."
                      className="min-h-[100px]"
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8">
            <Button 
              variant="outline" 
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Anterior
            </Button>
            
            <span className="text-sm text-muted-foreground">
              {currentStep + 1} de {guestData.length}
            </span>

            {currentStep === guestData.length - 1 ? (
              <Button onClick={handleSubmit} variant="romantic">
                <Heart className="w-4 h-4 mr-2" />
                Confirmar Asistencia
              </Button>
            ) : (
              <Button onClick={nextStep}>
                Siguiente
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 bg-gradient-elegant">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Heart className="w-12 h-12 text-romantic mx-auto mb-4" />
          <h2 className="text-4xl font-light text-foreground mb-4">
            Confirmación de Asistencia
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Por favor, busca tu nombre para confirmar tu asistencia antes del 1 de Mayo.
          </p>
        </div>

        {/* Search Form */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5 text-romantic" />
              Buscar Invitación
            </CardTitle>
            <CardDescription>
              Escribe tu nombre para encontrar tu invitación (mínimo 3 caracteres)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Escribe tu nombre..."
                className="text-lg"
              />
              
              {isSearching && (
                <p className="text-sm text-muted-foreground">Buscando...</p>
              )}
              
              {foundGuests.length > 0 && (
                <div className="space-y-4">
                  <div className="p-4 border border-border rounded-lg bg-muted/20">
                    <h3 className="font-medium text-lg mb-2">
                      Grupo: {foundGuests[0].group_name}
                    </h3>
                    <div className="space-y-2">
                      {foundGuests.map((guest) => (
                        <div key={guest.id} className="flex justify-between items-center">
                          <span>{guest.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {guest.attending === null ? 'Pendiente' : 
                             guest.attending ? 'Confirmado' : 'No asiste'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Button 
                    onClick={startWizard}
                    className="w-full"
                    size="lg"
                  >
                    Continuar con la confirmación
                  </Button>
                </div>
              )}
              
              {searchQuery.length >= 3 && !isSearching && foundGuests.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No se encontraron invitados con ese nombre. Verifica que esté escrito correctamente.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};