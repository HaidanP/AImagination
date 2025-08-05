import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeJSAnimationProps {
  type: 'wordCloud' | 'tokenVisualization' | 'patternFlow' | 'attentionMap' | 'diffusionWave';
  data?: any;
  width?: number;
  height?: number;
}

const ThreeJSAnimations: React.FC<ThreeJSAnimationProps> = ({ 
  type, 
  data, 
  width = 800, 
  height = 400 
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8fafc);
    
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    mountRef.current.appendChild(renderer.domElement);
    
    sceneRef.current = scene;
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Create animations based on type
    switch (type) {
      case 'wordCloud':
        createWordCloudAnimation(scene, camera);
        break;
      case 'tokenVisualization':
        createTokenVisualization(scene, camera, data);
        break;
      case 'patternFlow':
        createPatternFlow(scene, camera);
        break;
      case 'attentionMap':
        createAttentionMap(scene, camera, data);
        break;
      case 'diffusionWave':
        createDiffusionWave(scene, camera);
        break;
    }

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      
      // Rotate camera around the scene for dynamic view
      const time = Date.now() * 0.0005;
      camera.position.x = Math.cos(time) * 10;
      camera.position.z = Math.sin(time) * 10;
      camera.lookAt(scene.position);
      
      renderer.render(scene, camera);
    };
    
    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [type, data, width, height]);

  const createWordCloudAnimation = (scene: THREE.Scene, camera: THREE.Camera) => {
    const words = ['Hello', 'World', 'AI', 'Magic', 'Learn', 'Fun', 'Code', 'Smart'];
    const colors = [0x4F46E5, 0x7C3AED, 0x10B981, 0xF59E0B, 0xEF4444, 0x8B5CF6];
    
    words.forEach((word, index) => {
      // Create text geometry (simplified as boxes for this example)
      const geometry = new THREE.BoxGeometry(1, 0.5, 0.2);
      const material = new THREE.MeshLambertMaterial({ 
        color: colors[index % colors.length],
        transparent: true,
        opacity: 0.8 
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 4
      );
      
      // Add floating animation
      mesh.userData = {
        originalY: mesh.position.y,
        floatSpeed: 0.02 + Math.random() * 0.03,
        floatRange: 0.5 + Math.random() * 1
      };
      
      scene.add(mesh);
    });
    
    camera.position.set(0, 0, 12);
    
    // Animate floating
    const animateWords = () => {
      scene.children.forEach((child) => {
        if (child instanceof THREE.Mesh && child.userData.floatSpeed) {
          const time = Date.now() * child.userData.floatSpeed;
          child.position.y = child.userData.originalY + Math.sin(time) * child.userData.floatRange;
          child.rotation.y += 0.01;
        }
      });
    };
    
    const originalAnimate = rendererRef.current?.render;
    if (originalAnimate) {
      const enhancedAnimate = () => {
        animateWords();
        originalAnimate.call(rendererRef.current, scene, camera);
      };
    }
  };

  const createTokenVisualization = (scene: THREE.Scene, camera: THREE.Camera, tokenData: any) => {
    if (!tokenData) return;
    
    const tokens = Array.isArray(tokenData) ? tokenData : [123, 456, 789, 101, 112];
    
    tokens.forEach((token, index) => {
      // Create cube for each token
      const geometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
      const material = new THREE.MeshLambertMaterial({ 
        color: new THREE.Color().setHSL((index * 0.1) % 1, 0.7, 0.6),
        transparent: true,
        opacity: 0.9
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(
        (index - tokens.length / 2) * 1.5,
        Math.sin(index * 0.5) * 2,
        0
      );
      
      // Add pulsing animation
      mesh.userData = {
        originalScale: 1,
        pulseSpeed: 0.03 + Math.random() * 0.02,
        pulseRange: 0.2
      };
      
      scene.add(mesh);
      
      // Add connecting lines
      if (index > 0) {
        const points = [
          new THREE.Vector3((index - 1 - tokens.length / 2) * 1.5, Math.sin((index - 1) * 0.5) * 2, 0),
          new THREE.Vector3((index - tokens.length / 2) * 1.5, Math.sin(index * 0.5) * 2, 0)
        ];
        
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const lineMaterial = new THREE.LineBasicMaterial({ 
          color: 0x4F46E5, 
          transparent: true, 
          opacity: 0.6 
        });
        const line = new THREE.Line(lineGeometry, lineMaterial);
        scene.add(line);
      }
    });
    
    camera.position.set(0, 2, 8);
  };

  const createPatternFlow = (scene: THREE.Scene, camera: THREE.Camera) => {
    const particleCount = 100;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      
      const color = new THREE.Color().setHSL(Math.random(), 0.7, 0.6);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.8
    });
    
    const points = new THREE.Points(particles, material);
    scene.add(points);
    
    camera.position.set(0, 0, 15);
    
    // Add flowing motion
    points.userData = { rotationSpeed: 0.005 };
  };

  const createAttentionMap = (scene: THREE.Scene, camera: THREE.Camera, attentionData: any) => {
    const words = ['The', 'red', 'car', 'drives', 'fast'];
    const attentionWeights = attentionData || [0.2, 0.8, 0.9, 0.7, 0.8];
    
    words.forEach((word, index) => {
      const attention = attentionWeights[index] || 0.5;
      
      // Create sphere with size based on attention
      const geometry = new THREE.SphereGeometry(0.3 + attention * 0.5, 16, 16);
      const material = new THREE.MeshLambertMaterial({ 
        color: new THREE.Color().setHSL(0.1, 0.8, 0.4 + attention * 0.4),
        transparent: true,
        opacity: 0.7 + attention * 0.3
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(
        (index - words.length / 2) * 2,
        0,
        0
      );
      
      // Add glowing effect for high attention
      if (attention > 0.7) {
        const glowGeometry = new THREE.SphereGeometry(0.5 + attention * 0.8, 16, 16);
        const glowMaterial = new THREE.MeshBasicMaterial({
          color: 0xFFFF00,
          transparent: true,
          opacity: 0.2
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.position.copy(mesh.position);
        scene.add(glow);
        
        glow.userData = { pulseSpeed: 0.05, pulseRange: 0.3 };
      }
      
      scene.add(mesh);
    });
    
    camera.position.set(0, 2, 10);
  };

  const createDiffusionWave = (scene: THREE.Scene, camera: THREE.Camera) => {
    // Create wave-like surface
    const geometry = new THREE.PlaneGeometry(10, 6, 32, 32);
    const material = new THREE.MeshLambertMaterial({ 
      color: 0x4F46E5,
      transparent: true,
      opacity: 0.7,
      wireframe: false,
      side: THREE.DoubleSide
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, 0);
    mesh.rotation.x = -Math.PI / 4;
    scene.add(mesh);
    
    // Add wave animation
    mesh.userData = { 
      time: 0,
      originalPositions: geometry.attributes.position.array.slice()
    };
    
    // Create particles above the wave
    const particleCount = 50;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = Math.random() * 4 + 2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xFFFFFF,
      size: 0.05,
      transparent: true,
      opacity: 0.8
    });
    
    const points = new THREE.Points(particles, particleMaterial);
    scene.add(points);
    
    camera.position.set(0, 4, 8);
    
    // Animate wave and particles
    const animateWave = () => {
      if (mesh.userData) {
        mesh.userData.time += 0.02;
        const positions = geometry.attributes.position.array;
        const originalPositions = mesh.userData.originalPositions;
        
        for (let i = 0; i < positions.length; i += 3) {
          const x = originalPositions[i];
          const z = originalPositions[i + 2];
          positions[i + 1] = originalPositions[i + 1] + 
            Math.sin(x * 0.5 + mesh.userData.time) * 0.3 +
            Math.cos(z * 0.3 + mesh.userData.time * 0.8) * 0.2;
        }
        
        geometry.attributes.position.needsUpdate = true;
      }
      
      // Animate particles
      const particlePositions = points.geometry.attributes.position.array;
      for (let i = 1; i < particlePositions.length; i += 3) {
        particlePositions[i] -= 0.02;
        if (particlePositions[i] < -2) {
          particlePositions[i] = 4;
        }
      }
      points.geometry.attributes.position.needsUpdate = true;
    };
  };

  return <div ref={mountRef} className="threejs-container" style={{ width, height }} />;
};

export default ThreeJSAnimations;