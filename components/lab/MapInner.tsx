"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import { LAEvent } from "@/lib/events";

interface MapInnerProps {
  events:        LAEvent[];
  selectedId:    string | null;
  onSelectEvent: (id: string) => void;
}

export function MapInner({ events, selectedId, onSelectEvent }: MapInnerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<import("leaflet").Map | null>(null);
  const markersRef   = useRef<Map<string, import("leaflet").Marker>>(new Map());

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Must import leaflet dynamically to avoid SSR issues
    import("leaflet").then((L) => {
      // Fix default marker icon issue with webpack
      // @ts-expect-error leaflet private property
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl:       "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl:     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      const map = L.map(containerRef.current!, {
        center:          [34.0522, -118.2437],
        zoom:            12,
        zoomControl:     false,
        attributionControl: false,
      });

      L.control.zoom({ position: "bottomright" }).addTo(map);

      // CARTO dark matter tiles
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_matter_nolabels/{z}/{x}/{y}{r}.png",
        { subdomains: "abcd", maxZoom: 19 }
      ).addTo(map);

      // Subtle label layer on top
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_matter_only_labels/{z}/{x}/{y}{r}.png",
        { subdomains: "abcd", maxZoom: 19, opacity: 0.6 }
      ).addTo(map);

      mapRef.current = map;

      // Add markers
      events.forEach((event) => {
        const isSelected = event.id === selectedId;

        const icon = L.divIcon({
          html: `
            <div style="
              width: ${isSelected ? 44 : 36}px;
              height: ${isSelected ? 44 : 36}px;
              border-radius: 50%;
              background: ${isSelected ? "rgba(200,96,26,0.95)" : "rgba(26,24,20,0.9)"};
              border: 2px solid ${isSelected ? "#c8601a" : "rgba(200,96,26,0.4)"};
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: ${isSelected ? "18px" : "15px"};
              cursor: pointer;
              box-shadow: 0 0 ${isSelected ? "20px" : "8px"} rgba(200,96,26,${isSelected ? "0.5" : "0.2"});
              transition: all 0.3s ease;
            ">
              ${event.image}
            </div>
          `,
          className: "",
          iconSize:     [isSelected ? 44 : 36, isSelected ? 44 : 36],
          iconAnchor:   [isSelected ? 22 : 18, isSelected ? 22 : 18],
        });

        const marker = L.marker([event.lat, event.lng], { icon })
          .addTo(map)
          .on("click", () => onSelectEvent(event.id));

        markersRef.current.set(event.id, marker);
      });
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      markersRef.current.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update markers when selection changes
  useEffect(() => {
    if (!mapRef.current) return;

    import("leaflet").then((L) => {
      markersRef.current.forEach((marker, id) => {
        const event      = events.find((e) => e.id === id);
        if (!event) return;
        const isSelected = id === selectedId;

        const icon = L.divIcon({
          html: `
            <div style="
              width: ${isSelected ? 44 : 36}px;
              height: ${isSelected ? 44 : 36}px;
              border-radius: 50%;
              background: ${isSelected ? "rgba(200,96,26,0.95)" : "rgba(26,24,20,0.9)"};
              border: 2px solid ${isSelected ? "#c8601a" : "rgba(200,96,26,0.4)"};
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: ${isSelected ? "18px" : "15px"};
              cursor: pointer;
              box-shadow: 0 0 ${isSelected ? "20px" : "8px"} rgba(200,96,26,${isSelected ? "0.5" : "0.2"});
              transition: all 0.3s ease;
            ">
              ${event.image}
            </div>
          `,
          className: "",
          iconSize:     [isSelected ? 44 : 36, isSelected ? 44 : 36],
          iconAnchor:   [isSelected ? 22 : 18, isSelected ? 22 : 18],
        });

        marker.setIcon(icon);
      });

      // Fly to selected event
      if (selectedId) {
        const event = events.find((e) => e.id === selectedId);
        if (event) {
          mapRef.current?.flyTo([event.lat, event.lng], 14, {
            animate:  true,
            duration: 0.8,
          });
        }
      } else {
        mapRef.current?.flyTo([34.0522, -118.2437], 12, {
          animate:  true,
          duration: 0.8,
        });
      }
    });
  }, [selectedId, events]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{ minHeight: "100%" }}
    />
  );
}
