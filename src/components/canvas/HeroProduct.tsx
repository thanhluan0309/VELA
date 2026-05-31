'use client'

import { useRef, useMemo, type MutableRefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface Props {
  mouseRef: MutableRefObject<{ x: number; y: number }>
}

function OrbitingSphere({
  radius,
  speed,
  offset,
  yPosition,
}: {
  radius: number
  speed: number
  offset: number
  yPosition: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.elapsedTime * speed + offset
    meshRef.current.position.x = Math.cos(t) * radius
    meshRef.current.position.z = Math.sin(t) * radius
    meshRef.current.position.y = yPosition + Math.sin(t * 1.3) * 0.08
  })

  return (
    <mesh ref={meshRef} castShadow>
      <sphereGeometry args={[0.04, 16, 16]} />
      <meshStandardMaterial
        color="#FF5B4A"
        roughness={0.2}
        metalness={0.5}
        emissive="#FF5B4A"
        emissiveIntensity={0.15}
      />
    </mesh>
  )
}

function FloatingRing({
  yPosition,
  speed,
  offset,
}: {
  yPosition: number
  speed: number
  offset: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.elapsedTime * speed + offset
    meshRef.current.rotation.x = t * 0.4
    meshRef.current.rotation.z = t * 0.2
    meshRef.current.position.y = yPosition + Math.sin(t * 0.8) * 0.12
  })

  return (
    <mesh ref={meshRef}>
      <torusGeometry args={[0.18, 0.012, 8, 40]} />
      <meshStandardMaterial
        color="#FFD66B"
        roughness={0.3}
        metalness={0.6}
        emissive="#FFD66B"
        emissiveIntensity={0.05}
      />
    </mesh>
  )
}

export function HeroProduct({ mouseRef }: Props) {
  const groupRef = useRef<THREE.Group>(null)
  const smoothedMouse = useRef({ x: 0, y: 0 })
  const baseRotation = useRef(0)
  const entryProgress = useRef(0)

  // Procedural LatheGeometry — fashion torso silhouette
  const torsoGeometry = useMemo(() => {
    const pts = [
      new THREE.Vector2(0.0,   1.72),
      new THREE.Vector2(0.08,  1.68),
      new THREE.Vector2(0.20,  1.52),
      new THREE.Vector2(0.30,  1.38),
      new THREE.Vector2(0.32,  1.20),
      new THREE.Vector2(0.29,  1.02),
      new THREE.Vector2(0.22,  0.78),
      new THREE.Vector2(0.25,  0.62),
      new THREE.Vector2(0.34,  0.42),
      new THREE.Vector2(0.36,  0.22),
      new THREE.Vector2(0.30,  0.04),
      new THREE.Vector2(0.0,   0.0),
    ]
    const geo = new THREE.LatheGeometry(pts, 80)
    geo.computeVertexNormals()
    return geo
  }, [])

  useFrame(({ clock }, delta) => {
    if (!groupRef.current) return

    // Entry scale-in: quartOut easing
    entryProgress.current = Math.min(1, entryProgress.current + delta * 0.65)
    const ease = 1 - Math.pow(1 - entryProgress.current, 4)

    // Idle float
    const floatY = Math.sin(clock.elapsedTime * 0.7) * 0.04

    // Smooth mouse lerp
    const mx = mouseRef.current.x
    const my = mouseRef.current.y
    const lerpFactor = 1 - Math.pow(0.015, delta)
    smoothedMouse.current.x += (mx - smoothedMouse.current.x) * lerpFactor
    smoothedMouse.current.y += (my - smoothedMouse.current.y) * lerpFactor

    // Slow idle auto-rotation
    baseRotation.current += delta * 0.2

    groupRef.current.scale.setScalar(ease)
    groupRef.current.position.y = -0.5 + ease * 0.5 + floatY
    groupRef.current.rotation.y = baseRotation.current + smoothedMouse.current.x * 0.35
    groupRef.current.rotation.x = smoothedMouse.current.y * -0.15
  })

  return (
    <group ref={groupRef} position={[0.9, 0.15, 0]} scale={0}>
      {/* Main torso */}
      <mesh geometry={torsoGeometry} position={[0, -0.86, 0]} castShadow>
        <meshStandardMaterial
          color="#EDE7DC"
          roughness={0.28}
          metalness={0.12}
          envMapIntensity={1.2}
        />
      </mesh>

      {/* Orbiting coral spheres */}
      <OrbitingSphere radius={0.55} speed={0.5}  offset={0}             yPosition={0.4} />
      <OrbitingSphere radius={0.65} speed={0.35} offset={Math.PI}       yPosition={0.1} />
      <OrbitingSphere radius={0.48} speed={0.6}  offset={Math.PI / 2}   yPosition={0.7} />

      {/* Floating gold rings */}
      <FloatingRing yPosition={0.5}  speed={0.4} offset={0} />
      <FloatingRing yPosition={-0.1} speed={0.3} offset={Math.PI * 0.7} />
    </group>
  )
}
