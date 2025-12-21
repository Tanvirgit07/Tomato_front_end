/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

interface DeliveryMapProps {
  position: [number, number];
  onMapClick: (lat: number, lng: number) => void;
}

export default function DeliveryMap({ position, onMapClick }: DeliveryMapProps) {
  const mapRef = useRef<any>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;

    // Dynamic import of Leaflet
    const initMap = async () => {
      const L = (await import("leaflet")).default;

      // Fix icon issue
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      });

      if (!mapRef.current || mapInstanceRef.current) return;

      // Initialize map
      const map = L.map(mapRef.current).setView(position, 13);

      // Add tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Add marker
      const marker = L.marker(position).addTo(map);
      markerRef.current = marker;

      // Handle map clicks
      map.on("click", (e: any) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        onMapClick(lat, lng);
      });

      mapInstanceRef.current = map;
      setIsLoaded(true);

      // Fix size for modal
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    };

    initMap();

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update marker position when prop changes
  useEffect(() => {
    if (markerRef.current && isLoaded) {
      markerRef.current.setLatLng(position);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setView(position);
      }
    }
  }, [position, isLoaded]);

  return (
    <div 
      ref={mapRef} 
      style={{ 
        width: "100%", 
        height: "100%", 
        minHeight: "250px",
        borderRadius: "8px" 
      }} 
    />
  );
}