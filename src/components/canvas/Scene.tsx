"use client";

import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { StudioLights } from "./StudioLights";
import { HeroModel } from "./HeroModel";
import { useMouseParallax } from "@/hooks/useMouseParallax";
import { onScene } from "@/lib/sceneEvents";

function SceneContents({
  mouseRef,
}: {
  mouseRef: ReturnType<typeof useMouseParallax>;
}) {
  const [shoeOpacity, setShoeOpacity] = useState(1);

  useEffect(() => {
    return onScene((e) => {
      if (e.type === "shoe:visible") setShoeOpacity(e.visible ? 1 : 0);
    });
  }, []);

  return (
    <>
      <StudioLights />
      <Suspense fallback={null}>
        <HeroModel mouseRef={mouseRef} targetOpacity={shoeOpacity} />
      </Suspense>
    </>
  );
}

export function Scene() {
  const mouseRef = useMouseParallax();

  return (
    <Canvas
      id="r3f-canvas"
      style={{
        position: "absolute",
        top: 0,
        left: "2%",
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
      camera={{ position: [0, 0, 5], fov: 45, near: 0.1, far: 100 }}
      dpr={[1, 2]}
      frameloop="always"
      gl={{ antialias: true, alpha: true }}
    >
      <SceneContents mouseRef={mouseRef} />
    </Canvas>
  );
}
