/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";

interface SimpleMapProps {
  position: [number, number]; // Customer
  riderPosition?: [number, number] | null;
  zoom?: number;
}

export default function SimpleMap({
  position,
  riderPosition,
  zoom = 13,
}: SimpleMapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const leafletRef = useRef<any>(null);
  const isInitializedRef = useRef(false);

  const customerMarkerRef = useRef<any>(null);
  const riderMarkerRef = useRef<any>(null);
  const myMarkerRef = useRef<any>(null);

  const riderLineRef = useRef<any>(null);
  const myLineRef = useRef<any>(null);

  const [myPosition, setMyPosition] =
    useState<[number, number] | null>(null);

  /* ---------- Get my location ---------- */
  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) =>
        setMyPosition([
          pos.coords.latitude,
          pos.coords.longitude,
        ]),
      console.error,
      { enableHighAccuracy: true }
    );
  }, []);

  /* ---------- Init map (ONLY ONCE) ---------- */
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!mapRef.current) return;
    if (isInitializedRef.current || mapInstanceRef.current) return;

    const initMap = async () => {
      try {
        const L = (await import("leaflet")).default;
        leafletRef.current = L;

        // Check if container already has a map
        const container = mapRef.current;
        if (container && (container as any)._leaflet_id) {
          return;
        }

        // Fix default marker icon issue
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
          iconUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
          shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        });

        const map = L.map(mapRef.current!).setView(position, zoom);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "&copy; OpenStreetMap contributors",
        }).addTo(map);

        mapInstanceRef.current = map;
        isInitializedRef.current = true;

        // Fix modal / hidden container issue
        setTimeout(() => {
          map.invalidateSize();
        }, 100);
      } catch (error) {
        console.error("Map initialization error:", error);
      }
    };

    initMap();

    return () => {
      // Cleanup all markers and lines
      if (customerMarkerRef.current) {
        customerMarkerRef.current.remove();
        customerMarkerRef.current = null;
      }
      if (riderMarkerRef.current) {
        riderMarkerRef.current.remove();
        riderMarkerRef.current = null;
      }
      if (myMarkerRef.current) {
        myMarkerRef.current.remove();
        myMarkerRef.current = null;
      }
      if (riderLineRef.current) {
        riderLineRef.current.remove();
        riderLineRef.current = null;
      }
      if (myLineRef.current) {
        myLineRef.current.remove();
        myLineRef.current = null;
      }
      
      // Cleanup map
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      
      // Reset refs
      leafletRef.current = null;
      isInitializedRef.current = false;
      
      // Clear leaflet ID from container
      if (mapRef.current) {
        delete (mapRef.current as any)._leaflet_id;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run once

  /* ---------- Update markers & polylines ---------- */
  useEffect(() => {
    if (!mapInstanceRef.current || !leafletRef.current) return;

    const L = leafletRef.current;
    const map = mapInstanceRef.current;

    /* ---------- Icons ---------- */
    const customerIcon = L.icon({
      iconUrl:
        "https://cdn-icons-png.flaticon.com/512/684/684908.png",
      iconSize: [35, 35],
      iconAnchor: [17, 35],
    });

    const riderIcon = L.icon({
      iconUrl:
        "https://cdn-icons-png.flaticon.com/512/3448/3448339.png",
      iconSize: [40, 40],
      iconAnchor: [20, 40],
    });

    const myIcon = L.icon({
      iconUrl:
        "https://cdn-icons-png.flaticon.com/512/149/149060.png",
      iconSize: [38, 38],
      iconAnchor: [19, 38],
    });

    /* ---------- Customer ---------- */
    if (!customerMarkerRef.current) {
      customerMarkerRef.current = L.marker(position, {
        icon: customerIcon,
      })
        .addTo(map)
        .bindPopup("📍 Customer Location");
    } else {
      customerMarkerRef.current.setLatLng(position);
    }

    /* ---------- Rider ---------- */
    if (riderPosition) {
      if (!riderMarkerRef.current) {
        riderMarkerRef.current = L.marker(riderPosition, {
          icon: riderIcon,
        })
          .addTo(map)
          .bindPopup("🏍️ Rider Location");
      } else {
        riderMarkerRef.current.setLatLng(riderPosition);
      }

      if (!riderLineRef.current) {
        riderLineRef.current = L.polyline(
          [riderPosition, position],
          {
            color: "#6366f1",
            dashArray: "8,8",
            weight: 3,
          }
        ).addTo(map);
      } else {
        riderLineRef.current.setLatLngs([
          riderPosition,
          position,
        ]);
      }
    } else {
      // Remove rider marker and line if no rider position
      if (riderMarkerRef.current) {
        riderMarkerRef.current.remove();
        riderMarkerRef.current = null;
      }
      if (riderLineRef.current) {
        riderLineRef.current.remove();
        riderLineRef.current = null;
      }
    }

    /* ---------- My Location ---------- */
    if (myPosition) {
      if (!myMarkerRef.current) {
        myMarkerRef.current = L.marker(myPosition, {
          icon: myIcon,
        })
          .addTo(map)
          .bindPopup("🧍 Your Location");
      } else {
        myMarkerRef.current.setLatLng(myPosition);
      }

      if (!myLineRef.current) {
        myLineRef.current = L.polyline(
          [myPosition, position],
          {
            color: "#16a34a",
            weight: 2,
            opacity: 0.6,
          }
        ).addTo(map);
      } else {
        myLineRef.current.setLatLngs([
          myPosition,
          position,
        ]);
      }
    }

    /* ---------- Fit bounds ---------- */
    const points: [number, number][] = [position];
    if (riderPosition) points.push(riderPosition);
    if (myPosition) points.push(myPosition);

    if (points.length > 1) {
      map.fitBounds(points, {
        padding: [60, 60],
        maxZoom: 15,
      });
    } else {
      map.setView(position, zoom);
    }
  }, [position, riderPosition, myPosition, zoom]);

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height: "100%",
        minHeight: "300px",
        borderRadius: "8px",
      }}
    />
  );
}