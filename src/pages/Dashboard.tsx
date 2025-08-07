import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Trash2, Plus, LogOut, PieChart, Bus } from 'lucide-react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface Guest {
  id: string;
  name: string;
  attending: boolean | null;
  group_name: string;
  bus_departure: string | null;
  bus_return: string | null;
  created_at: string;
}

interface GuestGroup {
  groupName: string;
  guests: Guest[];
}

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [guests, setGuests] = useState<Guest[]>([]);
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestGroup, setNewGuestGroup] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    fetchGuests();
  }, [user, navigate]);

  const fetchGuests = async () => {
    const { data, error } = await supabase
      .from('guests')
      .select('*')
      .order('group_name', { ascending: true })
      .order('name', { ascending: true });

    if (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los invitados",
        variant: "destructive",
      });
    } else {
      setGuests(data || []);
    }
  };

  const addGuest = async () => {
    if (!newGuestName.trim() || !newGuestGroup.trim()) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const { error } = await supabase
      .from('guests')
      .insert([{
        name: newGuestName.trim(),
        group_name: newGuestGroup.trim(),
        attending: null,
        bus_departure: null,
        bus_return: null,
      }]);

    if (error) {
      toast({
        title: "Error",
        description: "No se pudo añadir el invitado",
        variant: "destructive",
      });
    } else {
      toast({
        title: "¡Éxito!",
        description: "Invitado añadido correctamente",
      });
      setNewGuestName('');
      setNewGuestGroup('');
      fetchGuests();
    }

    setIsLoading(false);
  };

  const deleteGuest = async (id: string) => {
    const { error } = await supabase
      .from('guests')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el invitado",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Eliminado",
        description: "Invitado eliminado correctamente",
      });
      fetchGuests();
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // Group guests by group_name
  const guestGroups: GuestGroup[] = guests.reduce((acc, guest) => {
    const existingGroup = acc.find(group => group.groupName === guest.group_name);
    if (existingGroup) {
      existingGroup.guests.push(guest);
    } else {
      acc.push({
        groupName: guest.group_name,
        guests: [guest]
      });
    }
    return acc;
  }, [] as GuestGroup[]);

  // Calculate statistics
  const totalGuests = guests.length;
  const confirmedAttending = guests.filter(g => g.attending === true).length;
  const confirmedNotAttending = guests.filter(g => g.attending === false).length;
  const pending = guests.filter(g => g.attending === null).length;

  // Chart data
  const chartData = [
    { name: 'Confirmados', value: confirmedAttending, color: '#22c55e' },
    { name: 'No Asisten', value: confirmedNotAttending, color: '#ef4444' },
    { name: 'Pendientes', value: pending, color: '#eab308' },
  ].filter(item => item.value > 0);

  // Calculate bus statistics
  const busStatistics = {
    departure: {
      total: guests.filter(g => g.bus_departure && g.bus_departure !== "none").length,
      madrid: guests.filter(g => g.bus_departure === "Salida desde Madrid").length,
      mostoles: guests.filter(g => g.bus_departure === "Salida desde Móstoles").length,
    },
    return: {
      total: guests.filter(g => g.bus_return && g.bus_return !== "none").length,
      madrid: guests.filter(g => g.bus_return === "Vuelta a Madrid").length,
      mostoles: guests.filter(g => g.bus_return === "Vuelta a Móstoles").length,
    }
  };

  // Functions to get guests by status
  const getGuestsByStatus = (status: 'total' | 'confirmed' | 'not_attending' | 'pending') => {
    switch (status) {
      case 'total':
        return guests;
      case 'confirmed':
        return guests.filter(g => g.attending === true);
      case 'not_attending':
        return guests.filter(g => g.attending === false);
      case 'pending':
        return guests.filter(g => g.attending === null);
      default:
        return [];
    }
  };

  const GuestListDialog = ({ title, guests: dialogGuests }: { title: string; guests: Guest[] }) => (
    <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>
          {dialogGuests.length} invitados en esta categoría
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-3">
        {dialogGuests.map((guest) => (
          <div key={guest.id} className="flex items-center justify-between p-3 border rounded">
            <div className="flex-1">
              <div className="font-medium">{guest.name}</div>
              <div className="text-sm text-muted-foreground">
                Grupo: {guest.group_name}
                {guest.bus_departure && (
                  <span className="ml-2">• Bus salida: {guest.bus_departure}</span>
                )}
                {guest.bus_return && (
                  <span className="ml-2">• Bus vuelta: {guest.bus_return}</span>
                )}
              </div>
            </div>
            <Badge variant={
              guest.attending === null ? "outline" : 
              guest.attending ? "default" : 
              "destructive"
            }>
              {guest.attending === null ? 'Pendiente' : 
               guest.attending ? 'Confirmado' : 
               'No asiste'}
            </Badge>
          </div>
        ))}
      </div>
    </DialogContent>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Dashboard de Invitados</h1>
            <p className="text-muted-foreground">Gestiona a todos los invitados de tu boda</p>
          </div>
          <Button onClick={handleSignOut} variant="outline">
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">{totalGuests}</div>
                  <p className="text-xs text-muted-foreground">Total Invitados</p>
                </CardContent>
              </Card>
            </DialogTrigger>
            <GuestListDialog title="Todos los Invitados" guests={getGuestsByStatus('total')} />
          </Dialog>
          
          <Dialog>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-green-600">{confirmedAttending}</div>
                  <p className="text-xs text-muted-foreground">Confirmados</p>
                </CardContent>
              </Card>
            </DialogTrigger>
            <GuestListDialog title="Invitados Confirmados" guests={getGuestsByStatus('confirmed')} />
          </Dialog>
          
          <Dialog>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-red-600">{confirmedNotAttending}</div>
                  <p className="text-xs text-muted-foreground">No Asisten</p>
                </CardContent>
              </Card>
            </DialogTrigger>
            <GuestListDialog title="Invitados que No Asisten" guests={getGuestsByStatus('not_attending')} />
          </Dialog>
          
          <Dialog>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-yellow-600">{pending}</div>
                  <p className="text-xs text-muted-foreground">Pendientes</p>
                </CardContent>
              </Card>
            </DialogTrigger>
            <GuestListDialog title="Invitados Pendientes" guests={getGuestsByStatus('pending')} />
          </Dialog>
        </div>

        {/* Chart */}
        {totalGuests > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-primary" />
                Estado de los Invitados
              </CardTitle>
              <CardDescription>
                Distribución visual del estado de confirmación
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} invitados`, 'Cantidad']} />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Bus Statistics */}
        {totalGuests > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bus className="h-5 w-5 text-primary" />
                Estadísticas de Transporte
              </CardTitle>
              <CardDescription>
                Uso del servicio de autobús por los invitados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Departure Statistics */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Autobús de Ida</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <span className="font-medium">Total usando autobús</span>
                      <Badge variant="secondary" className="text-lg font-bold">
                        {busStatistics.departure.total}
                      </Badge>
                    </div>
                    {busStatistics.departure.madrid > 0 && (
                      <div className="flex justify-between items-center p-2 border rounded-lg bg-muted/20">
                        <span className="text-sm">Desde Madrid</span>
                        <Badge variant="outline">
                          {busStatistics.departure.madrid} personas
                        </Badge>
                      </div>
                    )}
                    {busStatistics.departure.mostoles > 0 && (
                      <div className="flex justify-between items-center p-2 border rounded-lg bg-muted/20">
                        <span className="text-sm">Desde Móstoles</span>
                        <Badge variant="outline">
                          {busStatistics.departure.mostoles} personas
                        </Badge>
                      </div>
                    )}
                    {busStatistics.departure.total === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Ningún invitado ha solicitado autobús para la ida
                      </p>
                    )}
                  </div>
                </div>

                {/* Return Statistics */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Autobús de Vuelta</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <span className="font-medium">Total usando autobús</span>
                      <Badge variant="secondary" className="text-lg font-bold">
                        {busStatistics.return.total}
                      </Badge>
                    </div>
                    {busStatistics.return.madrid > 0 && (
                      <div className="flex justify-between items-center p-2 border rounded-lg bg-muted/20">
                        <span className="text-sm">A Madrid</span>
                        <Badge variant="outline">
                          {busStatistics.return.madrid} personas
                        </Badge>
                      </div>
                    )}
                    {busStatistics.return.mostoles > 0 && (
                      <div className="flex justify-between items-center p-2 border rounded-lg bg-muted/20">
                        <span className="text-sm">A Móstoles</span>
                        <Badge variant="outline">
                          {busStatistics.return.mostoles} personas
                        </Badge>
                      </div>
                    )}
                    {busStatistics.return.total === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Ningún invitado ha solicitado autobús para la vuelta
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Add Guest Form */}
        <Card>
          <CardHeader>
            <CardTitle>Añadir Nuevo Invitado</CardTitle>
            <CardDescription>
              Agrega invitados organizados por grupos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="guest-name">Nombre del Invitado</Label>
                <Input
                  id="guest-name"
                  placeholder="Nombre completo"
                  value={newGuestName}
                  onChange={(e) => setNewGuestName(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="guest-group">Nombre del Grupo</Label>
                <Input
                  id="guest-group"
                  placeholder="Ej: Familia García"
                  value={newGuestGroup}
                  onChange={(e) => setNewGuestGroup(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <Button onClick={addGuest} disabled={isLoading}>
                  <Plus className="h-4 w-4 mr-2" />
                  Añadir
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Guest Groups */}
        <div className="space-y-6">
          {guestGroups.map((group) => (
            <Card key={group.groupName}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {group.groupName}
                  <Badge variant="secondary">{group.guests.length} invitados</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {group.guests.map((guest) => (
                    <div key={guest.id} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex-1">
                        <div className="font-medium">{guest.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Estado: {
                            guest.attending === null ? (
                              <Badge variant="outline">Pendiente</Badge>
                            ) : guest.attending ? (
                              <Badge className="bg-green-600">Confirmado</Badge>
                            ) : (
                              <Badge className="bg-red-600">No asiste</Badge>
                            )
                          }
                          {guest.bus_departure && (
                            <span className="ml-2">
                              Bus salida: {guest.bus_departure}
                            </span>
                          )}
                          {guest.bus_return && (
                            <span className="ml-2">
                              Bus vuelta: {guest.bus_return}
                            </span>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteGuest(guest.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {guestGroups.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">No hay invitados registrados aún.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Usa el formulario de arriba para añadir el primer invitado.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;