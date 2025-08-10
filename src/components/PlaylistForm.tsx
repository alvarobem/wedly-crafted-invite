import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Music, Plus } from 'lucide-react';

const PlaylistForm = () => {
  const [songName, setSongName] = useState('');
  const [artist, setArtist] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const addSong = async () => {
    if (!songName.trim() || !artist.trim()) {
      toast({
        title: "Error",
        description: "Por favor completa tanto el nombre de la canción como el artista",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('playlist_songs')
        .insert([{
          song_name: songName.trim(),
          artist: artist.trim(),
        }]);

      if (error) {
        toast({
          title: "Error",
          description: "No se pudo añadir la canción",
          variant: "destructive",
        });
      } else {
        toast({
          title: "¡Genial!",
          description: `"${songName}" de ${artist} añadida a la playlist`,
        });
        setSongName('');
        setArtist('');
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addSong();
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Music className="h-5 w-5 text-primary" />
          Playlist Colaborativa
        </CardTitle>
        <CardDescription>
          Añade tu canción favorita para la boda
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="song-name">Nombre de la Canción</Label>
          <Input
            id="song-name"
            placeholder="Ej: Perfect"
            value={songName}
            onChange={(e) => setSongName(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
        <div>
          <Label htmlFor="artist">Artista</Label>
          <Input
            id="artist"
            placeholder="Ej: Ed Sheeran"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
        <Button 
          onClick={addSong} 
          disabled={isLoading} 
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Añadir a la Playlist
        </Button>
      </CardContent>
    </Card>
  );
};

export default PlaylistForm;