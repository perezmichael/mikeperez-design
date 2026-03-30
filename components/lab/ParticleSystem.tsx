"use client";

import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import * as THREE from "three";

export interface ParticleSystemHandle {
  setShape: (shape: "Sphere" | "Cube" | "Torus" | "Cloud") => void;
}

export const ParticleSystem = forwardRef<ParticleSystemHandle, Record<string, unknown>>((_, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pointsRef = useRef<THREE.Points | null>(null);
  const targetPositionsRef = useRef<Float32Array | null>(null);
  const currentPositionsRef = useRef<Float32Array | null>(null);
  
  const particleCount = 10000;

  const getShapePositions = (shape: "Sphere" | "Cube" | "Torus" | "Cloud") => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      if (shape === "Sphere") {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        const r = 2;
        pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
        pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        pos[i * 3 + 2] = r * Math.cos(phi);
      } else if (shape === "Cube") {
        pos[i * 3]     = (Math.random() - 0.5) * 3.5;
        pos[i * 3 + 1] = (Math.random() - 0.5) * 3.5;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 3.5;
      } else if (shape === "Torus") {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI * 2;
        const R = 2;
        const r = 0.6;
        pos[i * 3]     = (R + r * Math.cos(phi)) * Math.cos(theta);
        pos[i * 3 + 1] = (R + r * Math.cos(phi)) * Math.sin(theta);
        pos[i * 3 + 2] = r * Math.sin(phi);
      } else if (shape === "Cloud") {
        pos[i * 3]     = (Math.random() - 0.5) * 5 * Math.random();
        pos[i * 3 + 1] = (Math.random() - 0.5) * 2 * Math.random();
        pos[i * 3 + 2] = (Math.random() - 0.5) * 5 * Math.random();
      }
    }
    return pos;
  };

  useImperativeHandle(ref, () => ({
    setShape: (shape) => {
      targetPositionsRef.current = getShapePositions(shape);
    }
  }));

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 2));
    containerRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.BufferGeometry();
    const initialPositions = getShapePositions("Sphere");
    currentPositionsRef.current = new Float32Array(initialPositions);
    targetPositionsRef.current = new Float32Array(initialPositions);
    
    const colors = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      colors[i * 3]     = 200 / 255 + (Math.random() * 0.2 - 0.1);
      colors[i * 3 + 1] = 96 / 255 + (Math.random() * 0.2 - 0.1);
      colors[i * 3 + 2] = 26 / 255 + (Math.random() * 0.2 - 0.1);
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(currentPositionsRef.current, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.012,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geometry, material);
    pointsRef.current = points;
    scene.add(points);

    const animate = () => {
      requestAnimationFrame(animate);
      
      if (targetPositionsRef.current && points.geometry.attributes.position) {
        const positions = points.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < particleCount * 3; i++) {
          positions[i] += (targetPositionsRef.current[i] - positions[i]) * 0.05;
        }
        points.geometry.attributes.position.needsUpdate = true;
      }

      points.rotation.y += 0.0015;
      points.rotation.x += 0.0008;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    window.addEventListener("resize", handleResize);

    const container = containerRef.current;

    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      if (container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full" />;
});

ParticleSystem.displayName = "ParticleSystem";
