// src/components/RDLeafletMap.tsx
import { useEffect, useRef } from "react";
import L from 'leaflet';

// Fix for default markers in Leaflet with React
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix for default marker icons - without using 'any'
// Tuna-extend interface ya Leaflet kwa kuongeza property _getIconUrl
declare module 'leaflet' {
  interface IconDefault {
    _getIconUrl?: (name: string) => string;
  }
}

// Safely fix default marker icons without using 'any'
const defaultIcon = L.Icon.Default.prototype as L.Icon.Default & {
  _getIconUrl?: (name: string) => string;
};

if (defaultIcon._getIconUrl) {
  delete defaultIcon._getIconUrl;
}

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Koordinates za Iyumbu, Dodoma
const MAP_CENTER: [number, number] = [-6.163, 35.7516];

interface RDLeafletMapProps {
  height?: string;
  className?: string;
  showPopup?: boolean;
}

export default function RDLeafletMap({ 
  height = "500px", 
  className = "",
  showPopup = true 
}: RDLeafletMapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current).setView(MAP_CENTER, 14);
    mapInstanceRef.current = map;

    // Add tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // Add marker with custom styling
    const marker = L.marker(MAP_CENTER).addTo(map);
    
    // Add popup if enabled
    if (showPopup) {
      marker.bindPopup(`
        <div style="font-size:14px;line-height:1.4;text-align:center;">
          <strong style="color:#4f46e5;">VitoTech Office</strong><br>
          <span style="color:#64748b;">Iyumbu, Dodoma, Tanzania</span>
        </div>
      `).openPopup();
    }

    // Handle window resize for better responsiveness
    const handleResize = () => {
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    };

    window.addEventListener('resize', handleResize);

    // Add click event to open popup
    marker.on('click', () => {
      marker.openPopup();
    });

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [showPopup]);

  return (
    <section className="section section-fluid">
      <section className="section">
        <div 
          ref={mapRef} 
          className={`w-full rounded-lg shadow-lg border border-slate-300 overflow-hidden ${className}`}
          style={{ 
            height: height,
            zIndex: 0 
          }}
        />
      </section>
    </section>
  );
}
