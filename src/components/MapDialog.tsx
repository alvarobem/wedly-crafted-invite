import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix para los iconos por defecto
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface MapDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  address: string;
  coordinates: [number, number];
}

export const MapDialog = ({ isOpen, onClose, title, address, coordinates }: MapDialogProps) => {
  const mapInstance = useRef<L.Map | null>(null);

  // EFECTO DE LIMPIEZA MEJORADO
  // Este efecto ahora depende de `isOpen` para ejecutarse en el momento correcto.
  useEffect(() => {
    // Si el diálogo se cierra Y tenemos una instancia del mapa...
    if (!isOpen && mapInstance.current) {
      console.log("🧼 Diálogo cerrado. Limpiando instancia del mapa...");
      mapInstance.current.remove();
      // ¡Esta es la línea clave que faltaba!
      mapInstance.current = null; 
    }
  }, [isOpen]); // Se ejecuta cada vez que `isOpen` cambia.

  // Callback ref para inicializar el mapa cuando el div está listo.
  const mapInitializer = useCallback((node: HTMLDivElement | null) => {
    // Si el div no existe o el mapa ya fue creado, no hacer nada.
    if (node === null || mapInstance.current !== null) {
      return;
    }
    
    console.log("✅ Div montado. Inicializando el mapa...");

    const map = L.map(node, {
      center: coordinates,
      zoom: 16,
    });
    mapInstance.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    const marker = L.marker(coordinates).addTo(map);
    marker.bindPopup(
      `<div style="text-align: center; min-width: 200px;"><h3>${title}</h3><p>${address}</p></div>`
    ).openPopup();

    setTimeout(() => map.invalidateSize(), 100);

  }, [coordinates, title, address]);

  return (
    // El componente Dialog de shadcn gestiona la existencia del DialogContent por nosotros.
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 w-full min-h-0">
          <div 
            ref={mapInitializer} 
            style={{ width: '100%', height: '100%', minHeight: '400px' }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};