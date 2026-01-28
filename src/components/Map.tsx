import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';

// Correction pour les icônes manquantes
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface MapProps {
  address: string;
  city: string;
  className?: string;
}

export function Map({ address, city, className = '' }: MapProps) {
  // Coordonnées par défaut (Paris)
  const [position, setPosition] = useState<[number, number]>([48.8566, 2.3522]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            `${address}, ${city}`,
          )}`,
        );
        const data = await response.json();
        if (data && data[0]) {
          setPosition([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
        }
      } catch (error) {
        console.error('Error fetching coordinates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoordinates();
  }, [address, city]);

  if (loading) {
    return (
      <div
        className={`h-64 bg-gray-100 flex items-center justify-center ${className}`}
      >
        Chargement de la carte...
      </div>
    );
  }

  return (
    <div className={`h-64 ${className}`}>
      <MapContainer
        center={position}
        zoom={15}
        style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position} icon={icon}>
          <Popup>
            {address} <br /> {city}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
