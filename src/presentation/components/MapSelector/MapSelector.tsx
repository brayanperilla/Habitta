import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Arreglar el ícono de Leaflet por defecto en React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface MapSelectorProps {
  initialLat?: number;
  initialLng?: number;
  city?: string;
  department?: string;
  address?: string;
  onLocationSelect: (lat: number, lng: number) => void;
}

// Componente para actualizar el centro del mapa dinámicamente
function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 15);
  }, [center, map]);
  return null;
}

// Componente para manejar clics en el mapa
function MapClickHandler({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e: L.LeafletMouseEvent) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export function MapSelector({ initialLat, initialLng, city, department, address, onLocationSelect }: MapSelectorProps) {
  // Centro por defecto (Bogotá)
  const defaultCenter: [number, number] = [4.6097, -74.0817];

  const [position, setPosition] = useState<[number, number] | null>(
    initialLat && initialLng ? [initialLat, initialLng] : null
  );

  const [lastQuery, setLastQuery] = useState<string>(
    initialLat && initialLng && (city || department)
      ? `${address ? address + ", " : ""}${city}, ${department}, Colombia`
      : ""
  );

  useEffect(() => {
    const geocodeLocation = async () => {
      if (!city || !department) return;
      const query = `${address ? address + ", " : ""}${city}, ${department}, Colombia`;
      if (query === lastQuery) return;

      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
        const data = await res.json();

        if (data && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          setPosition([lat, lon]);
          onLocationSelect(lat, lon);
          setLastQuery(query);
        }
      } catch (err) {
        console.error("Geocoding failed:", err);
      }
    };

    if (city || department) {
      const timeoutId = setTimeout(() => {
        geocodeLocation();
      }, 1500);
      return () => clearTimeout(timeoutId);
    }
  }, [city, department, address, lastQuery]);

  const center = position || defaultCenter;

  return (
    <div style={{ height: "400px", width: "100%", borderRadius: "12px", overflow: "hidden", border: "1px solid #e5e7eb", zIndex: 0 }}>
      <MapContainer 
        center={center} 
        zoom={position ? 15 : 6} 
        minZoom={5}
        maxBounds={[[-5, -85], [15, -65]]}
        maxBoundsViscosity={1.0}
        style={{ height: "100%", width: "100%", zIndex: 1 }}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapUpdater center={center} />
        <MapClickHandler
          onLocationSelect={(lat, lng) => {
            setPosition([lat, lng]);
            onLocationSelect(lat, lng);
          }}
        />
        {position && <Marker position={position} />}
      </MapContainer>
    </div>
  );
}
