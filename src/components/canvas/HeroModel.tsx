'use client'

import { useEffect, useRef, type MutableRefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

interface Props {
  mouseRef: MutableRefObject<{ x: number; y: number }>
  targetOpacity: number
}

useGLTF.preload('/models/shoe.glb')

export function HeroModel({ mouseRef, targetOpacity }: Props) {
  const { scene } = useGLTF('/models/shoe.glb')
  const groupRef = useRef<THREE.Group>(null)
  const smoothedMouse = useRef({ x: 0, y: 0 })
  const entryProgress = useRef(0)
  const currentOpacity = useRef(1)

  const clonedScene = useRef(scene.clone(true))

  // Collect all materials once on mount so we can lerp opacity without traversing every frame
  const materialsRef = useRef<THREE.Material[]>([])
  useEffect(() => {
    clonedScene.current.traverse((child) => {
      const mesh = child as THREE.Mesh
      if (!mesh.isMesh) return
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
      mats.forEach((m) => {
        m.transparent = true
        materialsRef.current.push(m)
      })
    })
  }, [])

  useFrame(({ clock }, delta) => {
    const group = groupRef.current
    if (!group) return

    // Entry scale-in: quartOut easing, ~1.8s
    entryProgress.current = Math.min(1, entryProgress.current + delta * 0.55)
    const ease = 1 - Math.pow(1 - entryProgress.current, 4)

    // Idle float — gentle bob
    const floatY = Math.sin(clock.elapsedTime * 0.7) * 0.04

    // Mouse lerp
    const lf = 1 - Math.pow(0.02, delta)
    smoothedMouse.current.x += (mouseRef.current.x - smoothedMouse.current.x) * lf
    smoothedMouse.current.y += (mouseRef.current.y - smoothedMouse.current.y) * lf

    group.scale.setScalar(ease)
    group.position.y = floatY
    group.rotation.y = -0.5 + smoothedMouse.current.x * 0.28
    group.rotation.x = smoothedMouse.current.y * -0.08

    // Smooth opacity fade toward targetOpacity
    const opacityLf = 1 - Math.pow(0.04, delta)
    currentOpacity.current += (targetOpacity - currentOpacity.current) * opacityLf
    const op = currentOpacity.current
    materialsRef.current.forEach((m) => { m.opacity = op })
  })

  return (
    <group
      ref={groupRef}
      position={[1.0, 0.2, 0]}
      scale={0}
      rotation={[0, -0.5, 0]}
    >
      <primitive
        object={clonedScene.current}
        scale={8}
        position={[0, 0, 0]}
        rotation={[0.15, 0, 0]}
      />
    </group>
  )
}
