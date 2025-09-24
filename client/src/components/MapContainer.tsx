import { useEffect, useRef, useState } from 'react';
import L, { LatLngBounds } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CrimeIncident } from '@shared/schema';
import { calculateSafetyScore, getCrimesInBounds } from '@/utils/safetyCalculations';

// Fix Leaflet default markers issue with Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapContainerProps {
  crimes: CrimeIncident[];
  onBoundsChange: (bounds: { north: number; south: number; east: number; west: number }) => void;
  onCrimeClick: (crime: CrimeIncident) => void;
  searchLocation?: { lat: number; lng: number };
}

export default function MapContainer({ crimes, onBoundsChange, onCrimeClick, searchLocation }: MapContainerProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.LayerGroup>(new L.LayerGroup());

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Initialize map centered on Lucknow
    const map = L.map(mapContainerRef.current).setView([26.8467, 80.9462], 12);
    mapRef.current = map;

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add markers layer group
    markersRef.current.addTo(map);

    // Handle map bounds change
    const handleBoundsChange = () => {
      const bounds = map.getBounds();
      onBoundsChange({
        north: bounds.getNorth(),
        south: bounds.getSouth(),
        east: bounds.getEast(),
        west: bounds.getWest()
      });
    };

    map.on('moveend zoomend', handleBoundsChange);
    
    // Initial bounds calculation
    handleBoundsChange();

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [onBoundsChange]);

  // Update markers when crimes change
  useEffect(() => {
    if (!mapRef.current) return;

    markersRef.current.clearLayers();

    crimes.forEach(crime => {
      const lat = parseFloat(crime.lat);
      const lng = parseFloat(crime.lng);
      
      // Create color based on severity
      let color = '#22c55e'; // green - low severity
      if (crime.severity >= 7) color = '#ef4444'; // red - high severity
      else if (crime.severity >= 4) color = '#f59e0b'; // amber - medium severity

      // Create custom icon with severity-based color
      const customIcon = L.divIcon({
        className: 'custom-crime-marker',
        html: `<div style="
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background-color: ${color};
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 10px;
          font-weight: bold;
        ">${crime.severity}</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker([lat, lng], { icon: customIcon })
        .bindPopup(`
          <div class="p-2">
            <h3 class="font-semibold text-sm mb-1">${crime.type}</h3>
            <p class="text-xs text-gray-600 mb-1">Severity: ${crime.severity}/10</p>
            <p class="text-xs text-gray-600 mb-1">${crime.date}</p>
            <p class="text-xs">${crime.description}</p>
          </div>
        `)
        .on('click', () => onCrimeClick(crime));

      markersRef.current.addLayer(marker);
    });
  }, [crimes, onCrimeClick]);

  // Handle search location changes
  useEffect(() => {
    if (!mapRef.current || !searchLocation) return;

    mapRef.current.setView([searchLocation.lat, searchLocation.lng], 15);
    
    // Add temporary search marker
    const searchMarker = L.marker([searchLocation.lat, searchLocation.lng])
      .addTo(mapRef.current)
      .bindPopup('Search Result')
      .openPopup();

    // Remove after 3 seconds
    setTimeout(() => {
      if (mapRef.current && mapRef.current.hasLayer(searchMarker)) {
        mapRef.current.removeLayer(searchMarker);
      }
    }, 3000);
  }, [searchLocation]);

  return (
    <div 
      ref={mapContainerRef} 
      className="w-full h-full"
      data-testid="map-container"
    />
  );
}