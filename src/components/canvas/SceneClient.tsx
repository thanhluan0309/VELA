'use client'

import dynamic from 'next/dynamic'

// ssr: false only works inside a client component
const Scene = dynamic(() => import('./Scene').then((m) => m.Scene), { ssr: false })

export function SceneClient() {
  return <Scene />
}
