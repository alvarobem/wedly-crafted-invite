import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
  dietaryRestrictionsOther: string;
  busDeparture: string;
  busReturn: string;
  specialNotes: string;
}

export const RSVPForm = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [foundGroups, setFoundGroups] = useState<{[groupName: string]: DBGuest[]}>({});
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [isSearching, setIsSearching] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [guestData, setGuestData] = useState<GuestData[]>([]);
  const [useSameBusConfig, setUseSameBusConfig] = useState(false);
  const [groupBusConfig, setGroupBusConfig] = useState({
    departure: "none",
    return: "none"
  });

  const searchGuests = async (query: string) => {
    if (query.length < 3) {
      setFoundGroups({});
      setSelectedGroup("");
      return;
    }

    setIsSearching(true);
    try {
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .ilike('name', `%${query}%`);

      if (error) {
        console.error('Search error:', error);
        return;
      }

      if (data && data.length > 0) {
        // Group guests by group_name (handle null groups)
        const groupedGuests: {[groupName: string]: DBGuest[]} = {};
        
        for (const guest of data) {
          const groupKey = guest.group_name || `Individual: ${guest.name}`;
          
          if (!groupedGuests[groupKey]) {
            if (guest.group_name) {
              // Get all guests from this group
              const { data: groupGuests, error: groupError } = await supabase
                .from('guests')
                .select('*')
                .eq('group_name', guest.group_name)
                .order('name');

              if (!groupError && groupGuests) {
                groupedGuests[groupKey] = groupGuests;
              }
            } else {
              // Individual guest without group
              groupedGuests[groupKey] = [guest];
            }
          }
        }

        setFoundGroups(groupedGuests);
        // Auto-select if only one group found
        const groupNames = Object.keys(groupedGuests);
        if (groupNames.length === 1) {
          setSelectedGroup(groupNames[0]);
        } else {
          setSelectedGroup("");
        }
      } else {
        setFoundGroups({});
        setSelectedGroup("");
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
    if (!selectedGroup || !foundGroups[selectedGroup]) return;
    
    const selectedGuests = foundGroups[selectedGroup];
    const initialData = selectedGuests.map(guest => ({
      id: guest.id,
      name: guest.name,
      attending: guest.attending !== null ? guest.attending : true,
      dietaryRestrictions: guest.dietary_restrictions || "none",
      dietaryRestrictionsOther: "",
      busDeparture: guest.bus_departure || "none",
      busReturn: guest.bus_return || "none",
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
        const finalDietaryRestrictions = guest.dietaryRestrictions === "other" 
          ? guest.dietaryRestrictionsOther 
          : guest.dietaryRestrictions === "none" ? null : guest.dietaryRestrictions;

        const { error } = await supabase
          .from('guests')
          .update({
            attending: guest.attending,
            dietary_restrictions: finalDietaryRestrictions || null,
            bus_departure: guest.busDeparture === "none" ? null : guest.busDeparture,
            bus_return: guest.busReturn === "none" ? null : guest.busReturn,
            special_notes: guest.specialNotes || null
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
      setFoundGroups({});
      setSelectedGroup("");
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
      <section className="py-10 px-4 bg-gradient-elegant color-blue">
        <div className="flex items-center justify-center gap-6 mb-10">
          <div className="flex-1 h-px bg-white"></div>
          <div className="text-center">
            <div className="text-3xl font-serif text-stone-800">Confirma tu asistencia</div>
          </div>
          <div className="flex-1 h-px bg-white"></div>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-lg text-muted-foreground text-stone-600">
              Paso {currentStep + 1} de {guestData.length}: {currentGuest.name}
            </p>
          </div>

          <Card className="shadow-sof">
            <CardHeader>
              <CardTitle>Información de {currentGuest.name}</CardTitle>
              <CardDescription>
                Por favor, completa la información para este invitado
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Attendance */}
              <div className="space-y-2">
                <Label className="text-base font-medium ">¿Asistirá {currentGuest.name} a la boda?</Label>
                <RadioGroup
                  value={currentGuest.attending ? "yes" : "no"}
                  onValueChange={(value) => 
                    updateGuestData(currentGuest.id, 'attending', value === "yes")
                  }
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id={`attending-yes-${currentGuest.id}`} />
                    <Label htmlFor={`attending-yes-${currentGuest.id}`} >
                      Sí, asistiré
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id={`attending-no-${currentGuest.id}`} />
                    <Label htmlFor={`attending-no-${currentGuest.id}`} >
                      No asistiré
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {currentGuest.attending && (
                <>
                  {/* Dietary Restrictions */}
                  <div className="space-y-2">
                    <Label className="text-base font-medium">Restricciones alimentarias de {currentGuest.name}</Label>
                    <Select 
                      value={currentGuest.dietaryRestrictions}
                      onValueChange={(value) => updateGuestData(currentGuest.id, 'dietaryRestrictions', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar restricciones" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Sin restricciones</SelectItem>
                        <SelectItem value="vegetariano">Vegetariano</SelectItem>
                        <SelectItem value="vegano">Vegano</SelectItem>
                        <SelectItem value="sin_gluten">Sin gluten</SelectItem>
                        <SelectItem value="sin_lactosa">Sin lactosa</SelectItem>
                        <SelectItem value="pescetariano">Pescetariano</SelectItem>
                        <SelectItem value="other">Otras (especificar)</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    {currentGuest.dietaryRestrictions === "other" && (
                      <Input
                        value={currentGuest.dietaryRestrictionsOther}
                        onChange={(e) => updateGuestData(currentGuest.id, 'dietaryRestrictionsOther', e.target.value)}
                        placeholder="Especifica tus restricciones alimentarias..."
                        className="mt-2"
                      />
                    )}
                  </div>

                  {/* Bus Configuration */}
                  <div className="space-y-4">
                    <Label className="text-base font-medium">Transporte de {currentGuest.name}</Label>
                    
                    {!useSameBusConfig && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>¿Utilizará {currentGuest.name} el bus para la salida?</Label>
                          <Select 
                            value={currentGuest.busDeparture}
                            onValueChange={(value) => updateGuestData(currentGuest.id, 'busDeparture', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar salida" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">No necesito bus</SelectItem>
                              <SelectItem value="Salida desde Móstoles">Salida desde Móstoles</SelectItem>
                              <SelectItem value="Salida desde Madrid">Salida desde Madrid</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>¿Utilizará {currentGuest.name} el bus para la vuelta?</Label>
                          <Select 
                            value={currentGuest.busReturn}
                            onValueChange={(value) => updateGuestData(currentGuest.id, 'busReturn', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar vuelta" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">No necesito bus</SelectItem>
                              <SelectItem value="Vuelta a Móstoles">Vuelta a Móstoles</SelectItem>
                              <SelectItem value="Vuelta a Madrid">Vuelta a Madrid</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}

                    {useSameBusConfig && currentStep === 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Bus de salida para el grupo</Label>
                          <Select 
                            value={groupBusConfig.departure}
                            onValueChange={(value) => setGroupBusConfig(prev => ({...prev, departure: value}))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar salida" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">No necesito bus</SelectItem>
                              <SelectItem value="Salida desde Móstoles">Salida desde Móstoles</SelectItem>
                              <SelectItem value="Salida desde Madrid">Salida desde Madrid</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Bus de vuelta para el grupo</Label>
                          <Select 
                            value={groupBusConfig.return}
                            onValueChange={(value) => setGroupBusConfig(prev => ({...prev, return: value}))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar vuelta" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">No necesito bus</SelectItem>
                              <SelectItem value="Vuelta a Móstoles">Vuelta a Móstoles</SelectItem>
                              <SelectItem value="Vuelta a Madrid">Vuelta a Madrid</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}

                    {useSameBusConfig && currentStep > 0 && (
                      <div className="p-4 border border-border rounded-lg bg-muted/20">
                        <p className="text-sm text-muted-foreground mb-2">
                          Configuración de bus aplicada para todo el grupo:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Salida:</span> {groupBusConfig.departure === "none" ? "No necesita bus" : groupBusConfig.departure}
                          </div>
                          <div>
                            <span className="font-medium">Vuelta:</span> {groupBusConfig.return === "none" ? "No necesita bus" : groupBusConfig.return}
                          </div>
                        </div>
                      </div>
                    )}

                    {currentStep === 0 && guestData.length > 1 && !selectedGroup.startsWith('Individual:') && (
                      <div className="flex items-center space-x-2 p-4 border border-border rounded-lg bg-muted/20">
                        <Checkbox
                          id="same-bus-config"
                          checked={useSameBusConfig}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              // When enabling, copy current guest's values to group config
                              setGroupBusConfig({
                                departure: currentGuest.busDeparture,
                                return: currentGuest.busReturn
                              });
                            }
                            setUseSameBusConfig(checked === true);
                          }}
                        />
                        <Label htmlFor="same-bus-config" className="font-medium">
                          Usar la misma configuración de bus para todo el grupo
                        </Label>
                      </div>
                    )}
                  </div>

                  {/* Special Notes */}
                  <div className="space-y-2">
                    <Label className="text-base font-medium">¿Hay algo especial que {currentGuest.name} quiera compartir con nosotros?</Label>
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
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 justify-between items-center mt-8 text-stone-600">
            <Button 
              variant="outline" 
              onClick={prevStep}
              className="rounded-none"
              size="xl"
              disabled={currentStep === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-2"  />
              Anterior
            </Button>
            
            <span className="text-sm text-muted-foreground text-center justify-center text-stone-600">
              {currentStep + 1} de {guestData.length}
            </span>

            {currentStep === guestData.length - 1 ? (
              <Button onClick={handleSubmit}  className="rounded-none bg-stone-400 text-white" size="xl" variant="secondary">
                Confirmar
              </Button>
            ) : (
              <Button onClick={nextStep} className="rounded-none bg-stone-400 text-white" size="xl" variant="secondary">
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
    <section className="py-10 color-blue" id="confirmation">
      <div className="flex items-center justify-center gap-6 mb-10">
        <div className="flex-1 h-px bg-white"></div>
        <div className="text-center">
          <div className="text-3xl font-serif text-stone-800">Confirma tu asistencia</div>
        </div>
        <div className="flex-1 h-px bg-white"></div>
      </div>
      <div className="max-w-4xl mx-auto ">
        
        <div className="text-center mb-12 mx-6">
          <p className="text-lg text-muted-foreground mx-auto text-stone-700">
            Escribe tu nombre y apellido. Si vas en pareja o familia, aparecerán los datos de todos para confirmar asistencia a la vez.
          </p>
          <br/>
          <p className="text-lg text-muted-foreground  mx-auto text-stone-700">
            Cuando le des a CONTINUAR, podrás ir confirmando a cada uno de los asistentes.
          </p>
        </div>

        {/* Search Form */}
        <Card className="shadow-soft text-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5 text-romantic" />
               <p className="text-2xl">
                Buscar invitación
              </p>
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
              
              {Object.keys(foundGroups).length > 0 && (
                <div className="space-y-4">
                  {Object.keys(foundGroups).length > 1 && (
                    <div className="space-y-2">
                      <Label className="text-base font-medium">Selecciona tu grupo:</Label>
                      <Select 
                        value={selectedGroup}
                        onValueChange={setSelectedGroup}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar grupo" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(foundGroups).map((groupName) => (
                            <SelectItem key={groupName} value={groupName}>
                              {groupName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  
                  {selectedGroup && foundGroups[selectedGroup] && (
                    <div className="p-4 border border-border rounded-lg bg-muted/20">
                      <h3 className="font-medium text-lg mb-2">
                        {selectedGroup.startsWith('Individual:') ? 'Individual' : `Grupo: ${selectedGroup}`}
                      </h3>
                      <div className="space-y-2">
                        {foundGroups[selectedGroup].map((guest) => (
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
                  )}
                  
                  {selectedGroup && (
                    <Button 
                      onClick={startWizard}
                      className="w-full text-stone-600"
                      size="lg"
                      disabled={!selectedGroup}
                    >
                      Continuar con la confirmación
                    </Button>
                  )}
                </div>
              )}
              
              {searchQuery.length >= 3 && !isSearching && Object.keys(foundGroups).length === 0 && (
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