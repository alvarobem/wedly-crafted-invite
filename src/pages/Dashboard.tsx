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
  const [selectedExistingGroup, setSelectedExistingGroup] = useState('');
  const [isCreatingGroup, setIsCreatingGroup] = useState(true);
  const [multipleNames, setMultipleNames] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
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
    setIsLoading(true);

    try {
      if (isCreatingGroup) {
        // Creating a new group with multiple members
        if (!multipleNames.trim()) {
          toast({
            title: "Error",
            description: "Por favor añade al menos un invitado",
            variant: "destructive",
          });
          return;
        }

        const names = multipleNames
          .split('\n')
          .map(name => name.trim())
          .filter(name => name.length > 0);

        if (names.length === 0) {
          toast({
            title: "Error",
            description: "Por favor añade al menos un nombre de invitado",
            variant: "destructive",
          });
          return;
        }

        const guestsToInsert = names.map(name => ({
          name: name,
          group_name: newGuestGroup.trim() || null,
          attending: null,
          bus_departure: null,
          bus_return: null,
        }));

        const { error } = await supabase
          .from('guests')
          .insert(guestsToInsert);

        if (error) {
          toast({
            title: "Error",
            description: "No se pudo crear el grupo",
            variant: "destructive",
          });
        } else {
          const groupMessage = newGuestGroup.trim() 
            ? `Grupo "${newGuestGroup}" creado con ${names.length} invitado(s)`
            : `${names.length} invitado(s) creado(s) sin grupo`;
          toast({
            title: "¡Éxito!",
            description: groupMessage,
          });
          setNewGuestGroup('');
          setMultipleNames('');
          fetchGuests();
        }
      } else {
        // Adding to existing group
        if (!newGuestName.trim() || !selectedExistingGroup) {
          toast({
            title: "Error",
            description: "Por favor completa el nombre del invitado y selecciona un grupo",
            variant: "destructive",
          });
          return;
        }

        const { error } = await supabase
          .from('guests')
          .insert([{
            name: newGuestName.trim(),
            group_name: selectedExistingGroup,
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
            description: `Invitado añadido al grupo "${selectedExistingGroup}"`,
          });
          setNewGuestName('');
          fetchGuests();
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error inesperado",
        variant: "destructive",
      });
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

  // Group guests by group_name and apply filtering
  const filteredGuestGroups: GuestGroup[] = guests.reduce((acc, guest) => {
    // Apply name filter
    const matchesFilter = searchFilter === '' || 
      guest.name.toLowerCase().includes(searchFilter.toLowerCase());
    
    if (!matchesFilter) return acc;

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

  // All groups for the select dropdown (unfiltered)
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

  // Pagination for filtered groups
  const totalPages = Math.ceil(filteredGuestGroups.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedGroups = filteredGuestGroups.slice(startIndex, endIndex);

  // Reset to first page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchFilter]);

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

        {/* Guest Management Form */}
        <Card>
          <CardHeader>
            <CardTitle>Gestión de Invitados</CardTitle>
            <CardDescription>
              Crea grupos nuevos o añade invitados a grupos existentes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Mode Selector */}
            <div className="flex gap-2 p-1 bg-muted rounded-lg">
              <Button
                variant={isCreatingGroup ? "default" : "ghost"}
                size="sm"
                onClick={() => setIsCreatingGroup(true)}
                className="flex-1"
              >
                Crear Grupo Nuevo
              </Button>
              <Button
                variant={!isCreatingGroup ? "default" : "ghost"}
                size="sm"
                onClick={() => setIsCreatingGroup(false)}
                className="flex-1"
              >
                Añadir a Grupo Existente
              </Button>
            </div>

            {isCreatingGroup ? (
              /* Create New Group */
              <div className="space-y-4">
                <div>
                  <Label htmlFor="new-group-name">Nombre del Grupo</Label>
                  <Input
                    id="new-group-name"
                    placeholder="Ej: Familia García"
                    value={newGuestGroup}
                    onChange={(e) => setNewGuestGroup(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="multiple-names">Nombres de los Invitados</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Escribe un nombre por línea
                  </p>
                  <textarea
                    id="multiple-names"
                    className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Juan García&#10;María García&#10;Pedro García"
                    value={multipleNames}
                    onChange={(e) => setMultipleNames(e.target.value)}
                  />
                </div>
                <Button onClick={addGuest} disabled={isLoading} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Grupo
                </Button>
              </div>
            ) : (
              /* Add to Existing Group */
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="guest-name">Nombre del Invitado</Label>
                    <Input
                      id="guest-name"
                      placeholder="Nombre completo"
                      value={newGuestName}
                      onChange={(e) => setNewGuestName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="existing-group">Seleccionar Grupo</Label>
                    <Select
                      value={selectedExistingGroup}
                      onValueChange={setSelectedExistingGroup}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un grupo existente" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border shadow-md z-50">
                        {guestGroups.map((group) => (
                          <SelectItem key={group.groupName} value={group.groupName}>
                            {group.groupName} ({group.guests.length} invitado{group.guests.length !== 1 ? 's' : ''})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={addGuest} disabled={isLoading} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Añadir Invitado
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Filter and Search */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Invitados</CardTitle>
            <CardDescription>
              Filtra por nombre y navega entre los grupos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <Label htmlFor="search-filter">Buscar por nombre</Label>
                <Input
                  id="search-filter"
                  placeholder="Escribe un nombre para filtrar..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                />
              </div>
            </div>
            
            {searchFilter && (
              <div className="text-sm text-muted-foreground mb-4">
                Mostrando {filteredGuestGroups.reduce((acc, group) => acc + group.guests.length, 0)} invitado(s) 
                en {filteredGuestGroups.length} grupo(s) que coinciden con "{searchFilter}"
              </div>
            )}
          </CardContent>
        </Card>

        {/* Guest Groups */}
        <div className="space-y-6">
          {paginatedGroups.map((group) => (
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

        {/* Pagination */}
        {totalPages > 1 && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Página {currentPage} de {totalPages}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Anterior
                  </Button>
                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="w-10"
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Siguiente
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {filteredGuestGroups.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center">
              {searchFilter ? (
                <>
                  <p className="text-muted-foreground">No se encontraron invitados que coincidan con "{searchFilter}".</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => setSearchFilter('')}
                  >
                    Limpiar filtro
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-muted-foreground">No hay invitados registrados aún.</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Usa el formulario de arriba para añadir el primer invitado.
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;