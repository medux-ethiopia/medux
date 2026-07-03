import { useEffect, useRef } from "react";
import * as THREE from "three";
// @ts-ignore
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
// @ts-ignore
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import handleResize from "./utils/resizeUtils";
import { useLoading } from "../../context/LoadingProvider";
import { setProgress } from "../Loading";

const Scene = () => {
  const canvasDiv = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef(new THREE.Scene());
  const { setLoading } = useLoading();

  useEffect(() => {
    if (canvasDiv.current) {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const aspect = width / height;
      const scene = sceneRef.current;

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: window.devicePixelRatio < 2,
        powerPreference: "high-performance",
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
      canvasDiv.current.appendChild(renderer.domElement);

      const camera = new THREE.PerspectiveCamera(14.5, aspect, 0.1, 1000);
      camera.position.set(15, 10, 25);
      camera.lookAt(0, 0, 0);

      const droneGroup = new THREE.Group();
      scene.add(droneGroup);

      let progress = setProgress((value) => setLoading(value));
      let droneMesh: THREE.Mesh | null = null;
      const clock = new THREE.Clock();

      // Lighting
      const rgbeLoader = new RGBELoader();
      rgbeLoader.load('/models/char_enviorment.hdr', (envMap: THREE.Texture) => {
        envMap.mapping = THREE.EquirectangularReflectionMapping;
        scene.environment = envMap;
      });
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
      scene.add(ambientLight);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 3.0);
      directionalLight.position.set(10, 20, 10);
      scene.add(directionalLight);

      // Sizing Constants
      const FULL_SIZE = 0.3;
      const SHRUNK_SIZE = 0.15;
      const SEVENTY_FIVE_PERCENT = 0.225;

      const stlLoader = new STLLoader();
      stlLoader.load('/models/drone.stl', (geometry: THREE.BufferGeometry) => {
        geometry.center();
        const material = new THREE.MeshStandardMaterial({
          color: 0x0a0a0a, metalness: 0.85, roughness: 0.2,
        });
        droneMesh = new THREE.Mesh(geometry, material);
        droneMesh.scale.set(FULL_SIZE, FULL_SIZE, FULL_SIZE);
        droneMesh.rotation.x = -Math.PI / 2;
        droneGroup.add(droneMesh);
        progress.loaded().then(() => {});
      });

      let mouse = { x: 0, y: 0 };
      let scrollY = 0;
      
      const onMouseMove = (event: MouseEvent) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      };

      const onScroll = () => { scrollY = window.scrollY; };

      document.addEventListener("mousemove", onMouseMove);
      window.addEventListener("scroll", onScroll);

      // Target vectors for smooth interaction
      const lookAtTarget = new THREE.Vector3(0, 0, 0);

      const animate = () => {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();
        const vh = window.innerHeight;

        if (droneMesh) {
          // --- STAGE 1 & 2: DYNAMIC SCALE & POSITION ---
          let targetScale = FULL_SIZE;
          const targetX = -4; // Always keep it on the left side

          if (scrollY < vh) {
            // Shrinking Phase
            const p = scrollY / vh;
            targetScale = FULL_SIZE - (p * (FULL_SIZE - SHRUNK_SIZE));
          } else {
            // Growing Phase (to 75%)
            const p = Math.min((scrollY - vh) / vh, 1);
            targetScale = SHRUNK_SIZE + (p * (SEVENTY_FIVE_PERCENT - SHRUNK_SIZE));
          }

          droneGroup.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.06);
          droneGroup.position.x = THREE.MathUtils.lerp(droneGroup.position.x, targetX, 0.06);

          // --- STAGE 3: CINEMATIC ZOOM & CURSOR FOCUS ---
          // Dolly in as we scroll further down
          const scrollProgress = Math.min(scrollY / (document.body.scrollHeight - vh), 1);
          const targetZ = 25 - (scrollProgress * 10); 
          
          camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.05);
          
          // Camera LookAt follows the mouse cursor for that "Pro" feel
          lookAtTarget.x = THREE.MathUtils.lerp(lookAtTarget.x, mouse.x * 2, 0.05);
          lookAtTarget.y = THREE.MathUtils.lerp(lookAtTarget.y, mouse.y * 2, 0.05);
          camera.lookAt(lookAtTarget);

          // Harmonic Hover
          const floatingWave = Math.sin(elapsedTime * 1.3) * 0.3;
          droneGroup.position.y = THREE.MathUtils.lerp(droneGroup.position.y, floatingWave, 0.05);
        }

        renderer.render(scene, camera);
      };

      animate();

      return () => {
        scene.clear();
        renderer.dispose();
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("scroll", onScroll);
        if (canvasDiv.current) canvasDiv.current.removeChild(renderer.domElement);
      };
    }
  }, []);

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
      zIndex: -10, pointerEvents: "none"
    }}>
      <div ref={canvasDiv} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default Scene;