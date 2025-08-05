import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Heart, Users, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CustomQuestion {
  id: string;
  type: 'text' | 'select' | 'checkbox' | 'textarea';
  question: string;
  options?: string[];
  required: boolean;
}

interface Guest {
  id: string;
  name: string;
  attending: boolean;
}

interface GuestGroup {
  id: string;
  groupName: string;
  guests: Guest[];
}

export const RSVPForm = () => {
  const { toast } = useToast();
  const [guestGroups, setGuestGroups] = useState<GuestGroup[]>([
    {
      id: '1',
      groupName: 'Familia Principal',
      guests: [
        { id: '1', name: '', attending: true }
      ]
    }
  ]);
  
  const [customQuestions] = useState<CustomQuestion[]>([
    {
      id: '1',
      type: 'select',
      question: '¿Tienes alguna restricción alimentaria?',
      options: ['Ninguna', 'Vegetariano', 'Vegano', 'Sin gluten', 'Otras alergias'],
      required: true
    },
    {
      id: '2',
      type: 'checkbox',
      question: '¿Participarás en las siguientes actividades?',
      options: ['Ceremonia', 'Cóctel', 'Cena', 'Fiesta'],
      required: false
    },
    {
      id: '3',
      type: 'textarea',
      question: '¿Hay algo especial que quieras compartir con nosotros?',
      required: false
    }
  ]);

  const [responses, setResponses] = useState<Record<string, any>>({});

  const addGuestGroup = () => {
    const newGroup: GuestGroup = {
      id: Date.now().toString(),
      groupName: `Grupo ${guestGroups.length + 1}`,
      guests: [{ id: Date.now().toString(), name: '', attending: true }]
    };
    setGuestGroups([...guestGroups, newGroup]);
  };

  const removeGuestGroup = (groupId: string) => {
    setGuestGroups(guestGroups.filter(group => group.id !== groupId));
  };

  const updateGroupName = (groupId: string, name: string) => {
    setGuestGroups(guestGroups.map(group => 
      group.id === groupId ? { ...group, groupName: name } : group
    ));
  };

  const addGuestToGroup = (groupId: string) => {
    setGuestGroups(guestGroups.map(group => 
      group.id === groupId 
        ? { 
            ...group, 
            guests: [...group.guests, { id: Date.now().toString(), name: '', attending: true }]
          }
        : group
    ));
  };

  const removeGuestFromGroup = (groupId: string, guestId: string) => {
    setGuestGroups(guestGroups.map(group => 
      group.id === groupId 
        ? { ...group, guests: group.guests.filter(guest => guest.id !== guestId) }
        : group
    ));
  };

  const updateGuest = (groupId: string, guestId: string, field: keyof Guest, value: any) => {
    setGuestGroups(guestGroups.map(group => 
      group.id === groupId 
        ? {
            ...group,
            guests: group.guests.map(guest => 
              guest.id === guestId ? { ...guest, [field]: value } : guest
            )
          }
        : group
    ));
  };

  const handleQuestionResponse = (questionId: string, value: any) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const totalGuests = guestGroups.reduce((acc, group) => acc + group.guests.length, 0);
    const attendingGuests = guestGroups.reduce((acc, group) => 
      acc + group.guests.filter(guest => guest.attending).length, 0
    );

    toast({
      title: "¡Confirmación recibida!",
      description: `Gracias por confirmar. ${attendingGuests} de ${totalGuests} invitados asistirán.`,
    });
  };

  const renderCustomQuestion = (question: CustomQuestion) => {
    switch (question.type) {
      case 'select':
        return (
          <Select 
            onValueChange={(value) => handleQuestionResponse(question.id, value)}
            required={question.required}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una opción" />
            </SelectTrigger>
            <SelectContent>
              {question.options?.map((option, index) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case 'checkbox':
        return (
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox 
                  id={`${question.id}-${index}`}
                  onCheckedChange={(checked) => {
                    const currentValues = responses[question.id] || [];
                    if (checked) {
                      handleQuestionResponse(question.id, [...currentValues, option]);
                    } else {
                      handleQuestionResponse(question.id, currentValues.filter((v: string) => v !== option));
                    }
                  }}
                />
                <Label htmlFor={`${question.id}-${index}`} className="text-sm font-normal">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        );
      
      case 'textarea':
        return (
          <Textarea
            placeholder="Escribe tu respuesta..."
            onChange={(e) => handleQuestionResponse(question.id, e.target.value)}
            required={question.required}
            className="min-h-[100px]"
          />
        );
      
      default:
        return (
          <Input
            type="text"
            placeholder="Escribe tu respuesta..."
            onChange={(e) => handleQuestionResponse(question.id, e.target.value)}
            required={question.required}
          />
        );
    }
  };

  return (
    <section className="py-20 px-4 bg-gradient-elegant">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Heart className="w-12 h-12 text-romantic mx-auto mb-4" />
          <h2 className="text-4xl font-light text-foreground mb-4">
            Confirmación de Asistencia
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Por favor, confirma tu asistencia antes del 1 de Mayo para ayudarnos 
            a planificar este día tan especial.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Guest Groups */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-romantic" />
                Invitados
              </CardTitle>
              <CardDescription>
                Organiza a los invitados por grupos (familia, amigos, etc.)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {guestGroups.map((group) => (
                <div key={group.id} className="border border-border rounded-lg p-4 bg-muted/30">
                  <div className="flex items-center justify-between mb-4">
                    <Input
                      value={group.groupName}
                      onChange={(e) => updateGroupName(group.id, e.target.value)}
                      className="max-w-xs font-medium"
                      placeholder="Nombre del grupo"
                    />
                    {guestGroups.length > 1 && (
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => removeGuestGroup(group.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    {group.guests.map((guest) => (
                      <div key={guest.id} className="flex items-center gap-3">
                        <Input
                          value={guest.name}
                          onChange={(e) => updateGuest(group.id, guest.id, 'name', e.target.value)}
                          placeholder="Nombre completo"
                          className="flex-1"
                          required
                        />
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`attending-${guest.id}`}
                            checked={guest.attending}
                            onCheckedChange={(checked) => 
                              updateGuest(group.id, guest.id, 'attending', checked)
                            }
                          />
                          <Label htmlFor={`attending-${guest.id}`} className="text-sm whitespace-nowrap">
                            Asistirá
                          </Label>
                        </div>
                        {group.guests.length > 1 && (
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            onClick={() => removeGuestFromGroup(group.id, guest.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    className="mt-3"
                    onClick={() => addGuestToGroup(group.id)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Añadir invitado
                  </Button>
                </div>
              ))}
              
              <Button 
                type="button" 
                variant="outline-romantic" 
                onClick={addGuestGroup}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Añadir nuevo grupo
              </Button>
            </CardContent>
          </Card>

          {/* Custom Questions */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Información Adicional</CardTitle>
              <CardDescription>
                Ayúdanos a personalizar tu experiencia respondiendo estas preguntas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {customQuestions.map((question) => (
                <div key={question.id} className="space-y-2">
                  <Label className="text-base font-medium flex items-center gap-2">
                    {question.question}
                    {question.required && <span className="text-romantic">*</span>}
                  </Label>
                  {renderCustomQuestion(question)}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="text-center">
            <Button type="submit" variant="romantic" size="xl" className="min-w-[200px]">
              <Heart className="w-5 h-5 mr-2" />
              Confirmar Asistencia
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};