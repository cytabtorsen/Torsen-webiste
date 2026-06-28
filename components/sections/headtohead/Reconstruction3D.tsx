"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, useAnimations, Center } from "@react-three/drei";
import type { Group, Mesh, MeshStandardMaterial } from "three";

/**
 * THE 3D RECONSTRUCTION STAGE (Phase 3a · brief §5a).
 *
 * A lazy, client-only WebGL stage that sits ATOP the existing curated 2D reveal
 * in the head-to-head right panel (the 2D signals + grounded why remain the
 * always-present, accessible payload below it). Phase 3a is a STATIC scene —
 * the cinematic camera path, the topple, the in-3D anchored signals, and the
 * hand-control orbit come in 3b/3c. The HeadToHead state machine is untouched;
 * this only mounts when an eligible desktop reconstructs (see useCanvasEligible),
 * so three.js never enters the initial bundle and never touches LCP.
 *
 * Asset: "Animated Robot" by Quaternius (Poly Pizza) — CC0, no attribution
 * required. Stored at /public/models/humanoid.glb.
 */

// Warm the model fetch as soon as this (already-lazy) chunk loads.
useGLTF.preload("/models/humanoid.glb");

// The GLB renders upright at world scale; tune here if a future asset differs.
const MODEL_SCALE = 1;
const MODEL_Y_ROT = -0.35; // face the robot a touch toward the camera/operator

function Humanoid() {
  const group = useRef<Group>(null);
  const { scene, animations } = useGLTF("/models/humanoid.glb");
  const { actions, names } = useAnimations(animations, group);

  // Recolor the CC0 game asset (orange "Main" / grey / black) into muted technical
  // metals that fit the dark teal/amber system, so it reads industrial, not toylike.
  useEffect(() => {
    scene.traverse((o) => {
      const mesh = o as Mesh;
      if (!mesh.isMesh) return;
      const mat = mesh.material as MeshStandardMaterial;
      if (!mat || !mat.color) return;
      const n = mat.name ?? "";
      if (/main/i.test(n)) mat.color.set("#3b4655");
      else if (/grey|gray/i.test(n)) mat.color.set("#6b7585");
      else if (/black/i.test(n)) mat.color.set("#15191f");
      mat.metalness = 0.4;
      mat.roughness = 0.55;
    });
  }, [scene]);

  // The GLB's bind pose is a sprawl; play a standing/idle clip for a clean stance.
  // (Phase 3b swaps this for the rigid tip-over toward the operator.)
  useEffect(() => {
    const clip =
      actions["Robot_Idle"] ??
      actions["Robot_Standing"] ??
      (names[0] ? actions[names[0]] : undefined);
    clip?.reset().fadeIn(0.25).play();
    return () => void clip?.fadeOut(0.25);
  }, [actions, names]);

  return (
    <Center disableY>
      <group ref={group} scale={MODEL_SCALE} rotation={[0, MODEL_Y_ROT, 0]}>
        <primitive object={scene} />
      </group>
    </Center>
  );
}

/** Cheap in-canvas placeholder while the GLB streams. */
function SceneFallback() {
  return (
    <mesh position={[0, 0.95, 0]}>
      <capsuleGeometry args={[0.32, 1, 4, 12]} />
      <meshStandardMaterial color="#1B2230" />
    </mesh>
  );
}

function WorkcellScene() {
  return (
    <>
      <color attach="background" args={["#0B0E14"]} />
      <ambientLight intensity={0.65} />
      <directionalLight position={[4, 6, 3]} intensity={1.15} />

      {/* workcell floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[16, 16]} />
        <meshStandardMaterial color="#0F141C" />
      </mesh>

      {/* the novel-surface patch — the amber "why" accent, by the lead foot */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.55, 0.002, 0.7]}>
        <planeGeometry args={[0.95, 0.95]} />
        <meshStandardMaterial color="#FFB454" transparent opacity={0.45} />
      </mesh>

      {/* operator stand-in — teal, the space it lost its footing toward */}
      <mesh position={[1.9, 0.85, 0.5]}>
        <capsuleGeometry args={[0.3, 0.9, 4, 12]} />
        <meshStandardMaterial color="#16C79A" emissive="#0E8C6C" emissiveIntensity={0.25} />
      </mesh>

      <Suspense fallback={<SceneFallback />}>
        <Humanoid />
      </Suspense>
    </>
  );
}

export function Reconstruction3D() {
  return (
    <div
      role="img"
      aria-label="Spatial reconstruction: a humanoid robot stands in the workcell beside the operator, on a surface unlike anything in its training — the moment before it lost its footing."
      className="mb-5 h-72 w-full overflow-hidden rounded-lg border border-ground-line bg-ground"
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [3.0, 1.4, 4.2], fov: 40 }}
        onCreated={({ camera }) => camera.lookAt(0, 0.85, 0)}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <WorkcellScene />
      </Canvas>
    </div>
  );
}
