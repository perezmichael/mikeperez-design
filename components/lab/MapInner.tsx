"use client";

import { useEffect, useRef } from "react";
import { LAEvent } from "@/lib/events";

interface MapInnerProps {
  events:        LAEvent[];
  selectedId:    string | null;
  onSelectEvent: (id: string) => void;
}

export function MapInner({ events, selectedId, onSelectEvent }: MapInnerProps) {
  const containerRef  = useRef<HTMLDivElement>(null);
  const mapRef        = useRef<import("leaflet").Map | null>(null);
  const markersRef    = useRef<Map<string, import("leaflet").Marker>>(new Map());
  // Tracks whether init has started so the Strict Mode second mount skips it
  const initStarted   = useRef(false);

  useEffect(() => {
    if (!containerRef.current || initStarted.current) return;
    initStarted.current = true;

    let cancelled = false;

    import("leaflet").then((L) => {
      if (cancelled || !containerRef.current) return;

      // Inject Leaflet CSS once
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id   = "leaflet-css";
        link.rel  = "stylesheet";
        link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
        document.head.appendChild(link);
      }

      // @ts-expect-error leaflet private property
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl:       "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl:     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      const map = L.map(containerRef.current!, {
        center:             [34.0522, -118.2437],
        zoom:               12,
        zoomControl:        false,
        attributionControl: false,
      });

      // Add dark class so CSS filter inverts OSM tiles to dark
      containerRef.current!.classList.add("leaflet-dark");

      L.control.zoom({ position: "bottomright" }).addTo(map);

      // OpenStreetMap tiles — free, no API key, globally reliable
      // CSS filter in globals.css inverts them to dark
      L.tileLayer(
        "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
        { maxZoom: 19 }
      ).addTo(map);

      mapRef.current = map;

      events.forEach((event) => {
        const icon   = makeIcon(L, event, event.id === selectedId);
        const marker = L.marker([event.lat, event.lng], { icon })
          .addTo(map)
          .on("click", () => onSelectEvent(event.id));
        markersRef.current.set(event.id, marker);
      });
    });

    return () => {
      cancelled          = true;
      initStarted.current = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      markersRef.current.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update markers + flyTo when selection changes
  useEffect(() => {
    if (!mapRef.current) return;

    import("leaflet").then((L) => {
      markersRef.current.forEach((marker, id) => {
        const event = events.find((e) => e.id === id);
        if (!event) return;
        marker.setIcon(makeIcon(L, event, id === selectedId));
      });

      if (selectedId) {
        const event = events.find((e) => e.id === selectedId);
        if (event) {
          mapRef.current?.flyTo([event.lat, event.lng], 14, { animate: true, duration: 0.8 });
        }
      } else {
        mapRef.current?.flyTo([34.0522, -118.2437], 12, { animate: true, duration: 0.8 });
      }
    });
  }, [selectedId, events]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0"
      style={{ background: "#0a0906" }}
    />
  );
}

function makeIcon(L: typeof import("leaflet"), event: LAEvent, isSelected: boolean) {
  const size = isSelected ? 44 : 36;
  return L.divIcon({
    html: `<div style="
      width:${size}px;height:${size}px;border-radius:50%;
      background:${isSelected ? "rgba(200,96,26,0.95)" : "rgba(26,24,20,0.92)"};
      border:2px solid ${isSelected ? "#c8601a" : "rgba(200,96,26,0.35)"};
      display:flex;align-items:center;justify-content:center;
      font-size:${isSelected ? "18px" : "15px"};cursor:pointer;
      box-shadow:0 0 ${isSelected ? "20px" : "8px"} rgba(200,96,26,${isSelected ? "0.5" : "0.2"});
    ">${event.image}</div>`,
    className:  "",
    iconSize:   [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}
